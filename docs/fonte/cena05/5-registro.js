
  /* ================= Parte 5: o registro da cena ================= */
  Deck.registrar({
    id: '05',
    titulo: '05 · O final do jogo — As conquistas do analista',
    notas: NOTAS,
    montar, desmontar,
    passos: [
      { nome: 'sai de "Fase concluída"; amanhece de vez; título e "0/5 conquistas"', ambiente: { vento: 0.3 }, tocar: tocar0, fim: FIM[0] }
    ].concat(CONQUISTAS.map((c, i) => ({ nome: `conquista ${i + 1} · ${c.nome}${c.etiqueta ? ' (' + c.etiqueta + ')' : ''} · ${i + 1}/${N}${c.grande ? ' · acende a trilha dos quatro mundos' : ''}`, tocar: tocarConquista(i), fim: FIM[1 + i] })), [
      { nome: 'painel das cinco conquistas · "' + TEXTO.pergunta + '"', tocar: tocar6, fim: FIM[1 + N] },
      { nome: 'créditos: o cartão "' + CREDITOS.cabecalho + '"', ambiente: { vento: 0.15 }, tocar: tocar7, fim: FIM[2 + N] }
    ])
  });
})();
