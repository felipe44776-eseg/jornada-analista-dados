/* ================================================================
   CAMADA DE JOGO · HUD e telas (título, GAME OVER, Continuar?)
   A cena declara quantas vidas e fases tem e muda o HUD por uma API pequena:
     const hud = Jogo.hud(pai, { vidas: 5, fases: ['...', ...], rotulos: { fase: 'Etapa' }, formato: (n, N) => ..., jogadores: ['Analista', { nome: 'IA', ia: true }] });
     hud.definir({ visivel, vidas, fase, prazo, jogadores })   estado na hora: é o que o fim() de cada passo usa
     hud.entrar(ctx) · hud.perderVida(ctx) · hud.mudarFase(ctx, n) · hud.gastarPrazo(ctx, fracao, ms) · hud.entrarJogadores(ctx)
   O prazo é uma fração de 0 a 1, sem número na tela.
   ================================================================ */
const Jogo = (() => {
  const { html } = Deck.util;
  const CORACAO = 'M15,26 C15,26 2,17.5 2,9.2 C2,4.6 5.4,2 9,2 C11.8,2 14,3.6 15,6.2 C16,3.6 18.2,2 21,2 C24.6,2 28,4.6 28,9.2 C28,17.5 15,26 15,26 Z';
  const TRINCA = 'M15,6.5 L12,11.5 L17,15 L13.5,19.5 L15.5,24';

  function hud(pai, cfg) {
    const total = cfg.vidas, fases = cfg.fases, rot = Object.assign({ vidas: 'Vidas', fase: 'Fase', prazo: 'Prazo', jogadores: 'jogadores:' }, cfg.rotulos);
    const fmt = cfg.formato || ((n, N) => `${n}/${N}`);                  // ex.: etapas 00 a 12: (n, N) => String(n - 1).padStart(2, '0')
    const jog = (cfg.jogadores || []).map(j => typeof j === 'string' ? { nome: j } : j);
    const el = html(`<div class="jg-hud">${jog.length ? `<div class="jg-jog" style="opacity:0"><span class="jg-r">${jog.length} ${rot.jogadores}</span> ${jog.map(j => `<b${j.ia ? ' class="ia"' : ''}>${j.nome}</b>`).join(' <i>·</i> ')}</div>` : ''}
      <div class="jg-g jg-vidas"><span class="jg-r">${rot.vidas}</span><span class="jg-cor">${Array.from({ length: total }, () => `<svg viewBox="0 0 30 28"><path class="ch" d="${CORACAO}"/><path class="tr" d="${TRINCA}"/></svg>`).join('')}</span></div>
      <div class="jg-g jg-fase"><span class="jg-r">${rot.fase}</span><b></b><span class="jg-nome"></span></div>
      <div class="jg-g jg-prazo"><span class="jg-r">${rot.prazo}</span><span class="jg-barra"><i></i></span></div></div>`);
    pai.appendChild(el);
    const cor = Array.from(el.querySelectorAll('.jg-cor svg')), num = el.querySelector('.jg-fase b'), nome = el.querySelector('.jg-nome'), prazoEl = el.querySelector('.jg-prazo'), barra = el.querySelector('.jg-barra i');
    const jogEl = el.querySelector('.jg-jog');
    const st = { visivel: false, vidas: total, fase: 1, prazo: 1, jogadores: false };
    function pintar() {
      el.style.opacity = st.visivel ? 1 : 0;
      if (jogEl) jogEl.style.opacity = st.jogadores ? 1 : 0;
      cor.forEach((c, i) => c.classList.toggle('vazio', i >= st.vidas));
      num.textContent = fmt(st.fase, fases.length); nome.textContent = fases[st.fase - 1] || '';
      barra.style.setProperty('--p', Math.max(0, Math.min(1, st.prazo)).toFixed(3)); prazoEl.classList.toggle('baixo', st.prazo > 0 && st.prazo <= 0.2);
    }
    pintar();
    return {
      el, get estado() { return Object.assign({}, st); },
      definir(o) { Object.assign(st, o); pintar(); },
      entrar(ctx, atraso) { return ctx.anim(el, [{ opacity: 0, transform: 'translateY(-70px)' }, { opacity: 1, transform: 'translateY(6px)', offset: 0.7 }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 620, delay: atraso || 0, easing: 'cubic-bezier(.2,.7,.2,1)' }); },
      /* um coração se quebra: treme, as metades caem, fica o contorno */
      perderVida(ctx) {
        if (st.vidas <= 0) return;
        const c = cor[st.vidas - 1]; st.vidas--;
        ctx.anim(c, [{ transform: 'scale(1)' }, { transform: 'scale(1.5) rotate(-10deg)' }, { transform: 'scale(1.35) rotate(9deg)' }, { transform: 'scale(1.45) rotate(-6deg)' }, { transform: 'scale(1)' }], { duration: 420, fill: 'none', easing: 'ease-out' });
        ctx.em(190, () => {
          c.classList.add('vazio');
          const cx = c.getBoundingClientRect(), base = el.getBoundingClientRect(), k = el.offsetWidth / base.width;
          [-1, 1].forEach(lado => {
            const p = ctx.temp(html(`<svg viewBox="0 0 30 28" style="position:absolute;left:${((cx.left - base.left) * k).toFixed(1)}px;top:${((cx.top - base.top) * k).toFixed(1)}px;width:30px;height:28px;overflow:visible;clip-path:inset(0 ${lado < 0 ? 50 : 0}% 0 ${lado < 0 ? 0 : 50}%)"><path d="${CORACAO}" fill="#fff"/></svg>`));
            el.appendChild(p);
            const a = ctx.anim(p, [{ transform: 'translate(0px,0px) rotate(0deg)', opacity: 1 }, { transform: `translate(${lado * 16}px,-8px) rotate(${lado * 24}deg)`, opacity: 1, offset: 0.3 }, { transform: `translate(${lado * 26}px,58px) rotate(${lado * 70}deg)`, opacity: 0 }], { duration: 720, easing: 'cubic-bezier(.4,0,.8,.6)' });
            if (a) a.onfinish = () => ctx.soltar(p);
          });
        });
      },
      mudarFase(ctx, n) {
        if (n === st.fase) return;
        st.fase = n; num.textContent = fmt(n, fases.length); nome.textContent = fases[n - 1] || '';
        ctx.anim(num, [{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 240, fill: 'none', easing: 'ease-out' });
        ctx.anim(nome, [{ opacity: 0.2, transform: 'translateX(10px)' }, { opacity: 1, transform: 'translateX(0px)' }], { duration: 260, fill: 'none', easing: 'ease-out' });
      },
      /* a aba "2 jogadores" desce de trás do HUD; o estado final é definir({ jogadores: true }) */
      entrarJogadores(ctx, atraso) { st.jogadores = true; return jogEl && ctx.anim(jogEl, [{ opacity: 0, transform: 'translateY(-34px)' }, { opacity: 1, transform: 'translateY(0px)' }], { duration: 420, delay: atraso || 0, easing: 'cubic-bezier(.2,.7,.2,1)' }); },
      gastarPrazo(ctx, f, ms, atraso) {
        const de = st.prazo; st.prazo = f;
        ctx.tween(ms || 600, e => { const v = de + (f - de) * e; barra.style.setProperty('--p', Math.max(0, v).toFixed(3)); prazoEl.classList.toggle('baixo', v > 0 && v <= 0.2); }, { atraso: atraso || 0 });
      }
    };
  }

  /* telas: só a marcação e a classe; a cena posiciona e anima */
  function titulo(pai, t) {
    const el = html(`<div class="jg-titulo"><div class="jg-t-mundo">${t.mundo}</div><h1 class="jg-t-nome">${t.nome}</h1><div class="jg-t-dica"><i>${t.dica}</i></div></div>`);
    pai.appendChild(el); return el;
  }
  /* faixa grande: GAME OVER por padrão; com texto, serve para "Fase concluída" */
  function gameOver(pai, texto) { const el = html(`<div class="jg-go">${texto || 'GAME OVER'}</div>`); pai.appendChild(el); return el; }
  function continuar(pai, texto, pinos) {
    const el = html(`<div class="jg-cont"><span>${texto}</span><span class="jg-cont-b">${'<i></i>'.repeat(pinos || 3)}</span></div>`);
    pai.appendChild(el);
    return { el, pinos: Array.from(el.querySelectorAll('i')), gastar(k) { this.pinos.forEach((p, i) => p.classList.toggle('gasto', i >= this.pinos.length - k)); }, espera(v) { el.classList.toggle('espera', !!v); } };
  }
  return { hud, heroi: Heroi.criar, titulo, gameOver, continuar };
})();
