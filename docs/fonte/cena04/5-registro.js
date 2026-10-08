
  /* ================= Parte 5: o registro da cena ================= */
  Deck.registrar({
    id: '04',
    titulo: '04 · Mundo 4 — O mapa: herói e aliado jogam juntos',
    notas: {
      fala: '"Este é o mapa. Treze etapas em cinco regiões: enquadrar, reunir, explorar, comprovar, comunicar. Nada aqui é novo; é o templo do mundo 1 redesenhado. O que muda é o que acontece dentro de cada etapa. [zoom] A IA planeja e diz o que espera antes de rodar. Executa, com o código salvo. Verifica. E para. [pergunta] Quem decide é você: aprova, ajusta ou manda voltar. Por isso depois de cada etapa tem um checkpoint. São treze, e em cinco deles você não decide sozinho: chama uma segunda pessoa. E o jogo salvo mora nos arquivos, não na conversa. Agora vejam o que acontece com os problemas de antes. A pedra ainda cai, mas você volta só até o último portão. O presente ainda chega: a IA diz \'já calculei\'. [pergunta] Só que no portão, antes de aprovar, você sorteia dois números do que ela entregou e manda rodar de novo o código que gerou cada um. Como o sorteio é seu, ela não escolhe o que vai ser conferido. Se o número não saiu de código nenhum, aparece ali, antes de você abrir. E na etapa oito entra outra IA, que não viu a partida, e confere tudo numa cópia. Por que tanto cuidado com quem faz o quê? [aposta] Num sistema parecido com este, com os mesmos modelos e os mesmos prompts, três portões humanos e o cálculo em código derrubaram as falhas críticas de setenta e dois para dezesseis por cento. O controle não está no modelo; está no processo em volta dele. A IA acelera. O método protege." (cerca de 3 min)',
      interacao: 'Entre os passos 2 e 3, com a faísca parada diante do portão: "quem aperta o botão de salvar: a IA ou você?". Resposta em voz alta, depois a tecla. · Entre os passos 6 e 7, com o baú fechado na tela: "abre ou não abre?", como no mundo 3. Agora quem responde é o portão. · Entre os passos 9 e 10: a aposta, com mão levantada para cada opção, depois a tecla. · Em todos os casos a pausa é do apresentador: a animação espera a tecla, nunca um tempo fixo.',
      rastreio: [
        '5 fases, 13 etapas, nomes das etapas, 13 portões e os 5 críticos (G1, G3, G5, G8, G11), segunda pessoa nos críticos: fluxo/AGENTS.md §2.',
        'Ciclo PEVD, com P, E e V da IA e D do humano; expectativa declarada antes de rodar; respostas do portão (aprova, ajusta, volta): fluxo/AGENTS.md §4 e slide 10 de apresentacao/roteiro.md.',
        'Sorteio de 2 números com semente do humano (um da etapa atual, um do projeto todo) e reexecução do script de origem de cada um: fluxo/AGENTS.md §4 e §5. O baú desta cena é o "Já calculei." do mundo 3 (calcula de cabeça), porque é a armadilha que o sorteio pega.',
        '"O estado do projeto mora nos arquivos, não na memória da conversa": fluxo/AGENTS.md §3.',
        'Analista e auditor separados; o auditor não edita e trabalha só na cópia de auditoria, na etapa 08: fluxo/AGENTS.md §0 e §1.',
        '72% para 16% em 280 execuções sobre 4 datasets, mesmos modelos e prompts, 3 portões humanos e estimação em código: pesquisa/03-ia-na-analise-de-dados.md §2 (HLER).',
        'Ilustrativo, sem fonte: a pedra e o baú reaproveitados, e a imagem de "voltar só até o último portão". No kit, o que existe é a resposta "Voltar à etapa NN" no portão. As opções 50% e 30% são da aposta, não são dados. A barra de prazo não tem número.',
        'Cuidado: o número do HLER é de outro sistema, de pesquisa em econometria, não deste kit. Dizer "num sistema parecido", nunca "com o nosso fluxo".'
      ]
    },
    montar, desmontar,
    passos: [
      { nome: 'o mapa se desenrola: 5 regiões, um caminho, 13 pontos; herói e faísca no ponto 00', tocar: tocar0, fim: FIM[0] },
      { nome: 'o caminho se acende de 00 a 12, com o nome de cada etapa; as regiões ganham nome · "5 fases · 13 etapas"', tocar: tocar1, fim: FIM[1] },
      { nome: 'zoom numa etapa: a faísca percorre P, E e V e para diante do portão fechado · ESPERA A TECLA: "quem aperta o botão de salvar: a IA ou você?"', tocar: tocar2, fim: FIM[2] },
      { nome: 'o herói dá o último passo e o portão abre · "A IA planeja, executa e verifica. Só o humano decide."', tocar: tocar3, fim: FIM[3] },
      { nome: 'zoom de volta; 13 bandeiras, 5 com ★ e segunda pessoa · "O jogo salvo mora nos arquivos, não na conversa."', tocar: tocar4, fim: FIM[4] },
      { nome: 'a pedra cai na etapa 03 · "Os dados estavam incompletos." · volta só até a bandeira anterior, sem perder vida', tocar: tocar5, fim: FIM[5] },
      { nome: 'o baú chega pela faísca e fica fechado diante do portão · "Já calculei." · ESPERA A TECLA: "abre ou não abre?"', tocar: tocar6, fim: FIM[6] },
      { nome: 'o portão não abre: o sorteio do herói expõe a armadilha · "O número que a IA não calculou não passa do portão."', tocar: tocar7, fim: FIM[7] },
      { nome: 'etapa 08: entra o auditor, numa cópia fantasma do mapa · cartão dos papéis', tocar: tocar8, fim: FIM[8] },
      { nome: 'a aposta: a pergunta e as três opções · ESPERA A TECLA: mão levantada para 50%, 30% e 16%', tocar: tocar9, fim: FIM[9] },
      { nome: 'a resposta: de 72% para 16%, com o rodapé · ESPERA A TECLA: a fala sobre o número é longa', tocar: tocar10, fim: FIM[10] },
      { nome: 'o último portão, o prêmio, "Fase concluída" · "A IA acelera. O método protege."', tocar: tocar11, fim: FIM[11] }
    ]
  });
})();
