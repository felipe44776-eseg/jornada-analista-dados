/* ================================================================
   CENA 05 · O final do jogo — As conquistas do analista
   Conteúdo: roteiro.md, seção 05. Templo, herói, aliado, cabeçalho, frase e cartão vêm da camada de jogo (fonte\jogo-*.js).
   O aviso de conquista, os emblemas, o contador, o painel, a trilha dos quatro mundos e a luz do dia são desta cena.

   Parte 1: CONTEÚDO. É AQUI QUE SE TROCA TEXTO.
   Todo texto que aparece na tela (e nas notas) está neste arquivo, e nada aqui mexe em animação.
   Para trocar o texto de tela das conquistas, edite só
   `nome`, `linha` e `etiqueta` em CONQUISTAS. O aviso cresce para cima e aguenta de 1 a 3 linhas de texto.
   Mudou texto aqui, mude também em esperado.json.
   ================================================================ */
(() => {
  /* ---------- texto fixo na tela ---------- */
  const TEXTO = {
    eyebrow: 'Fim de jogo',
    titulo: 'As conquistas do analista de dados',
    rotulo: 'Conquista desbloqueada',                // em cada aviso
    contador: 'conquistas',                           // sai como "n/5 conquistas"
    pergunta: 'Qual é a mais difícil para você?',     // passo 6, sob o painel
    partida: 'Fase concluída'                         // quadro de partida: a faixa com que a cena 04 termina
  };

  /* ---------- as cinco conquistas (texto de tela) ----------
     nome      o que vai grande no aviso e sob o emblema no painel do passo 6
     linha     a frase do aviso. Cada item da lista é uma linha na tela: a lista só diz ONDE quebrar, o texto é a soma dos
               itens. Item comprido demais quebra sozinho. Também aceita um texto só ('...'): aí a quebra é automática
     etiqueta  opcional: etiqueta pequena ao lado do nome, só no aviso
     emblema   ampulheta | alvo | olho | ponte | bussola (desenhos em 2-desenho.js)
     grande    o aviso desta conquista é maior que os outros e acende a trilha dos quatro mundos */
  const CONQUISTAS = [
    { nome: 'Rápida', emblema: 'ampulheta',
      linha: ['Para não perder o tempo do cliente,', 'nem o da ação que a sua análise vai gerar.'] },
    { nome: 'Precisa', emblema: 'alvo',
      linha: ['Sempre teve de ser. Agora mais que nunca:', 'uma alucinação leva o time para o caminho errado.'] },
    { nome: 'Visual', emblema: 'olho',
      linha: ['Os outros precisam entender o que você fez.', 'Quem não entende não age, por medo.'] },
    { nome: 'Faz sentido no negócio', etiqueta: 'explicabilidade', emblema: 'ponte',
      linha: ['Um número solto não basta: a conclusão tem de', 'se ligar ao problema que você começou a explorar.'] },
    { nome: 'É uma jornada', emblema: 'bussola', grande: true,
      linha: ['Você não sabe onde vai terminar,', 'nem se a hipótese vai dar certo.', 'Goste do caminho e seja criativo.'] }
  ];

  /* ---------- cartão do passo 7: "Leve o jogo para casa" ----------
     Endereço e código QR do repositório. Com os dois campos vazios, o cartão mostra
     os espaços tracejados com o texto de `vago`.
       endereco  texto do endereço, sem "https://" (ex.: 'github.com/conta/repositorio'). Vai em uma linha, em destaque
       qr        a imagem do código QR como data URI ('data:image/png;base64,...' ou 'data:image/svg+xml;base64,...').
                 Nada de http em src: o deck é um arquivo só. O espaço é um quadrado de 268 px, com fundo branco */
  const CREDITOS = {
    cabecalho: 'Leve o jogo para casa',
    chamada: 'No repositório:',
    itens: ['o código', 'esta apresentação', 'o resumo da técnica', 'o pipeline movido a IA', 'como usar'],
    /* créditos: rótulo em cima, nome embaixo, entre a lista e o código QR */
    autoria: [
      { rotulo: 'Autores', texto: 'Felipe Marins e Claude' },
      { rotulo: 'Professor', texto: 'Marino Hilario Catarino' },
      { rotulo: 'ESEG · 2026', texto: 'Data Science 2' }
    ],
    endereco: 'github.com/felipe44776-eseg/jornada-analista-dados',
    qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjAAAAIwCAYAAACY8VFvAAAAAklEQVR4AewaftIAAA/MSURBVO3BUY5juRIlyENHANwgl8kN8otTf4GHQjegmzVKudrMxv1HAAAaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZn7yxcZc4e+5Z+dVY658q3t2Pt2YK0/cs/OqMVfe6Z6dbzTmyhP37LzLmCv8PffsfKMKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANPMT/uWeHX6NufIu9+w8MebKE/fsvMuYK0/cs/Mu9+w8MebKq+7ZeacxV151z86nu2fnW92zw68xV/hVAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMz/hPzHmyqe7Z4f/NebKpxtz5VX37LzTPTuvGnPlne7ZedWYK+90z86rxlx5p3t2Pt2YK5/unh3+TAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACa+Ql8kDFXnrhn513GXHninp13GXPlne7ZedU9O0+MufIu9+x8q3t2oLMKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANPMT+H/YmCvvMubKp7tn513GXPl0Y648cc8O8P+vCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmvkJ/4l7dvh7xlx54p4d/tyYK6+6Z+edxlx51T07T4y58sQ9O6+6Z4f/dc8O368CANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzfyEfxlzhV7u2XlizJVX3bPzxJgrT9yz86oxV564Z+fTjbnyxD07rxpz5Yl7dp4Yc+VV9+w8MebKE/fsvMuYK/B/UgEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmxv1H4EOMufLEPTtPjLny6e7ZeZcxVz7dPTufbsyVb3XPDnyCCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmvnJFxtz5Yl7dj7dmCuvumfniTFXvtU9O99ozJUn7tl5YsyVTzfmyqe7Z+dVY648cc/OE2Ou8OuenXcZc+WJe3a+UQUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACa+ckXu2fniTFXPt09O+9yz84TY668y5grT9yz86oxV77VmCtP3LPzLmOuPHHPzruMucKve3Y+3ZgrT4y58i737PCrAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM385IuNufLEPTuvGnPliXt23mXMlXe6Z+dVY648cc/OE2OuvOqenSfGXHninp13GXPlXcZc+Vb37Hyre3b4dc/OE2Ou8GcqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBo5if8y5grr7pn54kxVz7dPTtPjLnyLmOu8GvMlSfu2fl09+w8MeYKf8eYK0/cs/Mu9+x8ujFXnrhn5xtVAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJmf8J8Yc+VbjbnyLvfsPDHmyhP37LxqzJV3GnMF/mtjrjxxz867jLny6e7Z4e+oAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDPj/iNfasyVd7ln54kxV564Z4c/N+bKu9yz863GXPl09+y8y5grT9yz86oxVz7dPTtPjLnyxD07rxpz5Z3u2eHPVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0My4/wj8X4y58unu2fl0Y648cc/Oq8ZceeKenSfGXHmXe3b4NebKt7pn51uNufKqe3b4VQEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmfvLFxlx54p6dV4258k737LxqzJUn7tl5YswVft2z88SYK5/unp1XjbnyxJgrT9yz86oxV77VPTtPjLnCn7tnhz9TAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGZ+8sXu2flWY6686p6dJ8ZceZd7dp4Yc+Vb3bPzqjFXnhhz5dPds/PEmCvf6J6dJ8ZceeKenVeNufJOY6686p6ddxpz5VX37PCrAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZsb9R77UmCuf7p6ddxlz5Yl7dp4Yc+XT3bPzjcZcead7dvg7xlx54p6dJ8ZcedU9O59uzJV3umeHP1MBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZn7Cf+KenXcac+Vdxlx54p4d/tyYK59uzJV3uWfnXcZc4c+NufJO9+y8yz07T4y58qp7dvhVAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGZ+wr/cs/ON7tn5dGOuPHHPzruMufJO9+y8y5grT9yz86oxV54Yc+Vb3bPzqjFXnhhz5Yl7dl415sqnu2eHXioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGjmJ1/snp1PN+bKpxtz5Yl7dr7RPTtPjLny6e7Z+XT37Hy6MVeeGHPlVffsPDHmyqe7Z+eJMVfe5Z6dJ+7ZedWYK0/cs/ONKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANDMuP/Ilxpz5dPds/PEmCvvcs/Opxtz5dPds/PEmCvvcs/Opxtz5Yl7dr7RmCtP3LPzxJgrr7pn54kxV564Z+dVY658unt2+FUBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZn7yxe7ZeZcxV54Yc+Vd7tl5YsyVJ+7ZedWYK+90z86rxlx5p3t23mXMlSfu2XnVmCtP3LPzLmOuPHHPzhNjrvB33LPzxJgr/B0VAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0M+4/Qjtjrrzqnh3+15gr3+ienXcac+Vd7tl5YsyVV92z88SYK0/cs/OqMVf4X/fsvGrMlSfu2XmXMVeeuGfnG1UAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmZ98sTFXvtU9O68ac+Vb3bPz6e7ZeWLMlVeNufLEPTv8GnPlncZcedU9O0+MufKtxlx51T077zTmyqvu2eFXBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJoZ9x+BDzHmyqe7Z+eJMVeeuGfnVWOuvNM9O+8y5soT9+y8asyVd7pn51VjrrzTPTufbsyVV92z88SYK+9yzw6/KgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaOYnX2zMFf6ee3a+0Zgr7zTmyqcbc4W/456dJ8ZceZcxV564Z+ddxlx54p6dJ8Zc4c9UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJmf8C/37PBrzJV3uWfniTFX3uWenXcac+XT3bPzqjFXnrhn51uNufKqe3Y+3T07n+6eHXqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDM/4T8x5sqnu2fn04258sQ9O0+MufLp7tn5dGOufKN7dp4Yc+VbjbnyjcZceeKenSfu2eHPVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0MxP4IPcs8OfG3Pl092z88SYK0/cs/Pp7tl51Zgr73TPzqvGXIH/WgUAoJkKAEAzFQCAZioAAM1UAACaqQAANFMBAGimAgDQTAUAoJkKAEAzFQCAZioAAM1UAACa+Qnwde7ZeWLMlSfu2XnVmCufbsyVJ+7ZoZd7dp4Yc+WJe3b4MxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBo5if8J+7Z4e8Zc+WJe3ZeNebKE/fsfLp7dvh1z84TY648cc/ON7pn51vds8PfUQEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDM/4V/GXOHvGHPl092z88SYK0/cs/MuY67wa8yVdxpz5RuNufLEPTv8GnPliXt2vlEFAKCZCgBAMxUAgGYqAADNVAAAmqkAADRTAQBopgIA0EwFAKCZCgBAMxUAgGYqAADNVAAAmhn3HwEAaKQCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzVQAAJqpAAA0UwEAaKYCANBMBQCgmQoAQDMVAIBmKgAAzfx/9LPV9m5RckoAAAAASUVORK5CYII=',
    vago: {
      endereco: { rotulo: 'Endereço', texto: 'do repositório' },
      qr: { rotulo: 'Código QR', texto: 'do repositório' }
    }
  };

  /* ---------- notas do apresentador (tecla N): campos "Fala", "Interação com a turma" e "Rastreio" do roteiro ---------- */
  const NOTAS = {
    fala: '"A análise de dados precisa ser rápida, para não perder o tempo do cliente, ou o da ação que a sua análise vai gerar. Mas ela também tem de ser precisa. Sempre teve, mas agora mais do que nunca: alucinação não pode acontecer, para não levar o time para o caminho errado. A análise de dados precisa ser visual: as outras pessoas precisam entender o que você fez, senão não vão agir, por medo. E ela precisa fazer sentido no negócio, ou seja, ter explicabilidade. Não é só jogar um número ou uma conclusão que não se conecta com o problema de negócio que você começou a explorar. E, por fim, análise de dados é uma jornada, uma aventura. Quando você começa, não sabe exatamente onde vai terminar, nem se vai dar certo testar as suas hipóteses. Então o analista tem de gostar também do caminho, e ser criativo para ir resolvendo os problemas ao longo da jornada." (cerca de 2 min, nas palavras do autor)',
    interacao: 'Antes do passo 1: "depois de quatro mundos, o que a análise de dados precisa ser? Uma palavra." Ouvir três ou quatro respostas e só então apertar a tecla. Passo 6: "qual destas é a mais difícil para você?". Mão levantada para cada conquista.',
    rastreio: [
      'As cinco conquistas são a mensagem do autor, não citação de fonte. Não levam número.',
      'A coluna "Retoma" liga cada conquista a uma cena deste deck; é costura de roteiro, não evidência.'
    ]
  };
