/* ================================================================
   CENA 05 · O final do jogo — As conquistas do analista
   Conteúdo: roteiro.md, seção 05. Templo, herói, aliado, cabeçalho, frase e cartão vêm da camada de jogo (fonte\jogo-*.js).
   O aviso de conquista, os emblemas, o contador, o painel, a trilha dos quatro mundos e a luz do dia são desta cena.

   Parte 1: CONTEÚDO. É AQUI QUE SE TROCA TEXTO.
   Todo texto que aparece na tela (e nas notas) está neste arquivo, e nada aqui mexe em animação.
   O texto de tela das conquistas ainda espera a aprovação do Felipe (roteiro, seção 05): para trocar, edite só
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

  /* ---------- as cinco conquistas (texto de tela, A APROVAR) ----------
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
     ENDEREÇO E CÓDIGO QR ENTRAM AQUI, quando o repositório público existir. Enquanto os dois campos estiverem vazios,
     o cartão mostra os dois espaços tracejados com o texto de `vago`. Não invente endereço nem QR.
       endereco  texto do endereço, sem "https://" (ex.: 'github.com/conta/repositorio'). Vai em uma linha, em destaque
       qr        a imagem do código QR como data URI ('data:image/png;base64,...' ou 'data:image/svg+xml;base64,...').
                 Nada de http em src: o deck é um arquivo só. O espaço é um quadrado de 268 px, com fundo branco */
  const CREDITOS = {
    cabecalho: 'Leve o jogo para casa',
    chamada: 'No repositório:',
    itens: ['o código', 'esta apresentação', 'o resumo da técnica', 'o pipeline movido a IA', 'como usar'],
    /* créditos pedidos pelo Felipe em 2026-10-08: rótulo em cima, nome embaixo, entre a lista e o código QR */
    autoria: [
      { rotulo: 'Autores', texto: 'Felipe Marins e Claude' },
      { rotulo: 'Professor', texto: 'Marino Hilario Catarino' },
      { rotulo: 'ESEG · 2026', texto: 'Data Science 2' }
    ],
    endereco: 'github.com/felipe44776-eseg/jornada-analista-dados',
    qr: 'data:image/png;base64,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',
    vago: {
      endereco: { rotulo: 'Endereço', texto: 'a preencher' },
      qr: { rotulo: 'Código QR', texto: 'a preencher quando o repositório público existir' }
    }
  };

  /* ---------- notas do apresentador (tecla N): campos "Fala", "Interação com a turma" e "Rastreio" do roteiro ---------- */
  const NOTAS = {
    fala: '"A análise de dados precisa ser rápida, para não perder o tempo do cliente, ou o da ação que a sua análise vai gerar. Mas ela também tem de ser precisa. Sempre teve, mas agora mais do que nunca: alucinação não pode acontecer, para não levar o time para o caminho errado. A análise de dados precisa ser visual: as outras pessoas precisam entender o que você fez, senão não vão agir, por medo. E ela precisa fazer sentido no negócio, ou seja, ter explicabilidade. Não é só jogar um número ou uma conclusão que não se conecta com o problema de negócio que você começou a explorar. E, por fim, análise de dados é uma jornada, uma aventura. Quando você começa, não sabe exatamente onde vai terminar, nem se vai dar certo testar as suas hipóteses. Então o analista tem de gostar também do caminho, e ser criativo para ir resolvendo os problemas ao longo da jornada." (cerca de 2 min, nas palavras do Felipe)',
    interacao: 'Antes do passo 1: "depois de quatro mundos, o que a análise de dados precisa ser? Uma palavra." Ouvir três ou quatro respostas e só então apertar a tecla. Passo 6: "qual destas é a mais difícil para você?". Mão levantada para cada conquista.',
    rastreio: [
      'As cinco conquistas são a mensagem do Felipe, não citação de fonte. Não levam número.',
      'A coluna "Retoma" liga cada conquista a uma cena deste deck; é costura de roteiro, não evidência.'
    ]
  };
