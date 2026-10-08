/* ================================================================
   SOM · Web Audio API, tudo sintetizado. Nenhum arquivo de áudio.
   Cadeia: [bus do passo] + [bus de ambiente] -> mestre -> compressor -> saída
   O contexto só nasce na primeira tecla (Som.destravar).
   ================================================================ */
const Som = (() => {
  let ac = null, mestre = null, comp = null, busPasso = null, busAmb = null;
  let ruidoBuf = null, mudo = false, travado = false;
  const GANHO_MESTRE = 0.5;
  const amb = {};                       // camadas contínuas: nome -> {ganho, parar}

  function criar() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC();
    comp = ac.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 14; comp.ratio.value = 6;
    comp.attack.value = 0.004; comp.release.value = 0.22;
    mestre = ac.createGain(); mestre.gain.value = mudo ? 0 : GANHO_MESTRE;
    mestre.connect(comp); comp.connect(ac.destination);
    busAmb = ac.createGain(); busAmb.connect(mestre);
    busPasso = ac.createGain(); busPasso.connect(mestre);
    // 2 s de ruído rosado aproximado, reusado por todas as primitivas
    const n = ac.sampleRate * 2; ruidoBuf = ac.createBuffer(1, n, ac.sampleRate);
    const d = ruidoBuf.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.0990460; b1 = 0.96300 * b1 + w * 0.2965164; b2 = 0.57000 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
    }
    return true;
  }
  /* chamada em toda tecla ou clique: cria ou retoma o contexto */
  function destravar() {
    if (travado) return;
    try { if (!ac && !criar()) return; if (ac.state === 'suspended') ac.resume(); } catch (e) { ac = null; }
  }
  const pronto = () => !!ac && !mudo && !travado;
  function ruido(dest, t, dur, ganho) {
    const s = ac.createBufferSource(); s.buffer = ruidoBuf; s.loop = true;
    const g = ac.createGain(); g.gain.value = ganho;
    s.connect(g); g.connect(dest); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    return g;
  }
  function env(g, t, ataque, pico, queda) {       // ataque linear, queda exponencial
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(pico, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ataque + queda);
  }

  /* ---------- primitivas (o = {t: atraso em s, ganho, ...}) ---------- */
  const P = {
    /* tambor grave; freq = afinação da pele */
    tambor(o = {}) {
      const t = ac.currentTime + (o.t || 0), f = o.freq || 70, g0 = o.ganho == null ? 0.9 : o.ganho, dur = o.dur || 0.55;
      const osc = ac.createOscillator(), g = ac.createGain(); osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 2.4, t); osc.frequency.exponentialRampToValueAtTime(f, t + 0.07);
      env(g, t, 0.003, g0, dur); osc.connect(g); g.connect(busPasso); osc.start(t); osc.stop(t + dur + 0.1);
      const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'triangle';
      o2.frequency.setValueAtTime(f * 1.5, t); env(g2, t, 0.003, g0 * 0.25, dur * 0.5);
      o2.connect(g2); g2.connect(busPasso); o2.start(t); o2.stop(t + dur);
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(busPasso);
      env(ruido(lp, t, 0.06, 1), t, 0.001, g0 * 0.5, 0.05);
    },
    /* flauta andina: tom com sopro e vibrato tardio */
    flauta(o = {}) {
      const t = ac.currentTime + (o.t || 0), f = o.freq || 440, dur = o.dur || 0.45, g0 = o.ganho == null ? 0.3 : o.ganho;
      const g = ac.createGain(); g.connect(busPasso);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(g0, t + 0.06);
      g.gain.setValueAtTime(g0, t + Math.max(0.07, dur - 0.1)); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.12);
      const o1 = ac.createOscillator(); o1.type = 'sine';
      const fFim = o.ate || f;                                  // 'ate' = glissando até outra nota
      o1.frequency.setValueAtTime(f * 0.975, t); o1.frequency.linearRampToValueAtTime(f, t + 0.05);
      if (fFim !== f) o1.frequency.exponentialRampToValueAtTime(fFim, t + dur);
      const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'triangle'; g2.gain.value = 0.22;
      o2.frequency.setValueAtTime(f * 2, t); if (fFim !== f) o2.frequency.exponentialRampToValueAtTime(fFim * 2, t + dur);
      const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.2;
      lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(dur, 0.35));
      lfo.connect(lg); lg.connect(o1.frequency);
      o1.connect(g); o2.connect(g2); g2.connect(g);
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(f * 2.2, 6000); bp.Q.value = 1.4;
      const gs = ac.createGain(); gs.gain.value = 0.55; bp.connect(gs); gs.connect(g);
      ruido(bp, t, dur + 0.1, 1);
      [o1, o2, lfo].forEach(x => { x.start(t); x.stop(t + dur + 0.2); });
    },
    /* pancada de pedra: baque grave + ruído abafado + estalo */
    pedra(o = {}) {
      const t = ac.currentTime + (o.t || 0), g0 = o.ganho == null ? 1 : o.ganho, f = o.freq || 52;
      const osc = ac.createOscillator(), g = ac.createGain(); osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 1.9, t); osc.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.22);
      env(g, t, 0.002, g0, 0.42); osc.connect(g); g.connect(busPasso); osc.start(t); osc.stop(t + 0.6);
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(700, t);
      lp.frequency.exponentialRampToValueAtTime(140, t + 0.4); lp.connect(busPasso);
      env(ruido(lp, t, 0.5, 1), t, 0.002, g0 * 1.3, 0.4);
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2400; hp.connect(busPasso);
      env(ruido(hp, t, 0.04, 1), t, 0.001, g0 * 0.35, 0.03);
    },
    /* "clac" seco de tabuleta; tom = 0.8 a 1.4 */
    clac(o = {}) {
      const t = ac.currentTime + (o.t || 0), g0 = o.ganho == null ? 0.5 : o.ganho, k = o.tom || 1;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2100 * k; bp.Q.value = 5; bp.connect(busPasso);
      env(ruido(bp, t, 0.06, 1), t, 0.001, g0 * 2.2, 0.045);
      const osc = ac.createOscillator(), g = ac.createGain(); osc.type = 'triangle'; osc.frequency.value = 880 * k;
      env(g, t, 0.001, g0 * 0.4, 0.03); osc.connect(g); g.connect(busPasso); osc.start(t); osc.stop(t + 0.08);
    },
    /* passo: toque abafado */
    passo(o = {}) {
      const t = ac.currentTime + (o.t || 0), g0 = o.ganho == null ? 0.3 : o.ganho;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.connect(busPasso);
      env(ruido(lp, t, 0.08, 1), t, 0.002, g0 * 1.6, 0.06);
      const osc = ac.createOscillator(), g = ac.createGain(); osc.type = 'sine';
      osc.frequency.setValueAtTime(130, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
      env(g, t, 0.002, g0 * 0.6, 0.07); osc.connect(g); g.connect(busPasso); osc.start(t); osc.stop(t + 0.12);
    },
    /* glissando descendente (de -> para, em Hz) */
    gliss(o = {}) {
      P.flauta({ t: o.t, freq: o.de || 660, ate: o.para || 165, dur: o.dur || 0.7, ganho: o.ganho == null ? 0.26 : o.ganho });
    },

    /* ---------- sons de jogo: ondas quadrada e triangular, curtos ---------- */
    /* nota de "chip": tipo = 'square' ou 'triangle'; ate = desliza até outra frequência */
    chip(o = {}) {
      const t = ac.currentTime + (o.t || 0), f = o.freq || 440, dur = o.dur || 0.1, g0 = o.ganho == null ? 0.14 : o.ganho, tipo = o.tipo || 'square';
      const osc = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
      osc.type = tipo; osc.frequency.setValueAtTime(f, t); if (o.ate) osc.frequency.exponentialRampToValueAtTime(o.ate, t + dur);
      lp.type = 'lowpass'; lp.frequency.value = tipo === 'square' ? 3200 : 6000;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(g0, t + 0.006);
      g.gain.setValueAtTime(g0, t + Math.max(0.01, dur - 0.03)); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.02);
      osc.connect(lp); lp.connect(g); g.connect(busPasso); osc.start(t); osc.stop(t + dur + 0.05);
    },
    /* jogador pronto: arpejo curto para cima */
    pronto(o = {}) { const t = o.t || 0; [0, 2, 3, 5].forEach((g, i) => P.chip({ t: t + i * 0.085, freq: penta(g, 440), dur: i === 3 ? 0.22 : 0.075, ganho: 0.13 })); },
    /* vida perdida: dois degraus para baixo; tom < 1 deixa mais grave */
    vida(o = {}) {
      const t = o.t || 0, k = o.tom || 1;
      P.chip({ t, freq: 660 * k, ate: 440 * k, dur: 0.11, ganho: 0.15 }); P.chip({ t: t + 0.12, freq: 392 * k, ate: 196 * k, dur: 0.22, ganho: 0.15 });
      P.chip({ t: t + 0.12, tipo: 'triangle', freq: 196 * k, ate: 98 * k, dur: 0.26, ganho: 0.2 });
    },
    /* derrota: melodia descendente lenta */
    derrota(o = {}) {
      const t = o.t || 0;
      [[5, 0, 0.26], [4, 0.3, 0.26], [3, 0.6, 0.26], [1, 0.9, 0.3], [0, 1.26, 0.9]].forEach(([g, q, d]) => {
        P.chip({ t: t + q, tipo: 'triangle', freq: penta(g, 220), dur: d, ganho: 0.24 }); P.chip({ t: t + q, freq: penta(g, 440), dur: d * 0.8, ganho: 0.06 });
      });
    },
    /* bipe de contagem */
    bipe(o = {}) { P.chip({ t: o.t, freq: o.freq || 880, dur: o.dur || 0.09, ganho: o.ganho == null ? 0.12 : o.ganho }); },
    /* novo jogador: arpejo brilhante e uma nota longa */
    novoJogador(o = {}) {
      const t = o.t || 0;
      [0, 2, 3, 5, 7].forEach((g, i) => P.chip({ t: t + i * 0.07, freq: penta(g, 523.25), dur: 0.065, ganho: 0.12 }));
      P.chip({ t: t + 0.36, freq: penta(10, 523.25), dur: 0.4, ganho: 0.12 }); P.chip({ t: t + 0.36, tipo: 'triangle', freq: penta(5, 523.25), dur: 0.5, ganho: 0.18 });
    },
    /* fanfarra de fase concluída; completa = com o acorde final longo */
    fanfarra(o = {}) {
      const t = o.t || 0, notas = o.completa ? [[0, 0], [2, 0.12], [3, 0.24], [5, 0.36], [5, 0.56], [7, 0.68]] : [[0, 0], [2, 0.12], [3, 0.24], [5, 0.36]];
      notas.forEach(([g, q], i) => P.chip({ t: t + q, freq: penta(g, 523.25), dur: i === notas.length - 1 ? (o.completa ? 0.7 : 0.3) : 0.1, ganho: 0.13 }));
      if (o.completa) [0, 2, 3].forEach(g => P.chip({ t: t + 0.68, tipo: 'triangle', freq: penta(g, 261.63), dur: 0.8, ganho: 0.14 }));
    },
    /* falha de imagem: ruído curto e duas notas tortas */
    falha(o = {}) {
      const t = ac.currentTime + (o.t || 0), g0 = o.ganho == null ? 0.3 : o.ganho;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.8; bp.connect(busPasso);
      env(ruido(bp, t, 0.16, 1), t, 0.002, g0 * 1.6, 0.14);
      P.chip({ t: o.t || 0, freq: 196, ate: 92, dur: 0.12, ganho: g0 * 0.5 }); P.chip({ t: (o.t || 0) + 0.07, freq: 740, ate: 370, dur: 0.07, ganho: g0 * 0.3 });
    },
    /* toque de presente: três notas claras subindo */
    presente(o = {}) { const t = o.t || 0; [5, 7, 10].forEach((g, i) => P.chip({ t: t + i * 0.09, tipo: 'triangle', freq: penta(g, 523.25), dur: 0.14, ganho: 0.2 })); }
  };

  /* ---------- ambiente: camadas contínuas, fora do bus do passo ---------- */
  function criarVento() {
    const src = ac.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.7;
    const g = ac.createGain(); g.gain.value = 0.0001;
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.11; lg.gain.value = 170;
    lfo.connect(lg); lg.connect(bp.frequency);
    const lfo2 = ac.createOscillator(), lg2 = ac.createGain(), tr = ac.createGain(); lfo2.frequency.value = 0.07; lg2.gain.value = 0.3; tr.gain.value = 0.7;
    lfo2.connect(lg2); lg2.connect(tr.gain);
    src.connect(bp); bp.connect(tr); tr.connect(g); g.connect(busAmb);
    src.start(); lfo.start(); lfo2.start();
    return { ganho: g, teto: 0.55, parar() { try { src.stop(); lfo.stop(); lfo2.stop(); } catch (e) {} } };
  }
  const FABRICA_AMB = { vento: criarVento };
  /* estado = {vento: 0..1}; camada ausente do estado vai a zero */
  function ambiente(estado, rampa) {
    if (!ac || travado) return;
    const r = rampa == null ? 1.2 : rampa, t = ac.currentTime;
    Object.keys(FABRICA_AMB).forEach(nome => {
      const nivel = (estado && estado[nome]) || 0;
      if (!amb[nome]) { if (nivel <= 0) return; amb[nome] = FABRICA_AMB[nome](); }
      const g = amb[nome].ganho.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(Math.max(g.value, 0.0001), t);
      g.linearRampToValueAtTime(Math.max(nivel * amb[nome].teto, 0.0001), t + Math.max(r, 0.05));
    });
  }

  /* corta tudo o que o passo agendou e abre um bus novo */
  function cortar() {
    if (!ac) return;
    const velho = busPasso, t = ac.currentTime;
    velho.gain.cancelScheduledValues(t); velho.gain.setValueAtTime(velho.gain.value, t); velho.gain.linearRampToValueAtTime(0, t + 0.04);
    setTimeout(() => { try { velho.disconnect(); } catch (e) {} }, 120);
    busPasso = ac.createGain(); busPasso.connect(mestre);
  }
  function alternarMudo() {
    mudo = !mudo;
    if (ac) mestre.gain.setTargetAtTime(mudo ? 0 : GANHO_MESTRE, ac.currentTime, 0.03);
    return mudo;
  }
  /* escala pentatônica menor (lá-dó-ré-mi-sol): grau 0 = base */
  const PENTA = [0, 3, 5, 7, 10];
  function penta(grau, base) {
    const o = Math.floor(grau / 5), i = ((grau % 5) + 5) % 5;
    return (base || 440) * Math.pow(2, (PENTA[i] + 12 * o) / 12);
  }
  /* API pública: cada primitiva vira no-op se o som não está pronto */
  const api = { destravar, ambiente, cortar, alternarMudo, penta, travar() { travado = true; }, diag() { return ac ? { ac, saida: comp } : null; }, get mudo() { return mudo || travado; }, get vivo() { return !!ac; } };
  Object.keys(P).forEach(k => { api[k] = o => { if (pronto()) { try { P[k](o); } catch (e) {} } }; });
  return api;
})();
