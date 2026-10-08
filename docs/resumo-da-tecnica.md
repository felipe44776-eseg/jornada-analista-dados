# O método em uma página

Este é o resumo do que a apresentação mostra e do que o kit deste repositório faz. O detalhe está no [`README.md`](../README.md) e, para a IA, no [`AGENTS.md`](../AGENTS.md).

## O problema

A IA faz em segundos o que levava dias, e erra com a mesma segurança com que acerta. Quatro falhas aparecem logo na primeira semana de uso:

| Falha | O que acontece |
|---|---|
| Inventa a fonte | cita dataset, tabela ou URL que não existe |
| Calcula de cabeça | devolve um número plausível sem ter executado código |
| Concorda com você | confirma a hipótese de quem pergunta |
| Testa até dar | roda dezenas de recortes e mostra o que "deu" |

Quem usa não enxerga onde a IA deixa de ser boa. Por isso o controle não pode depender de "parece certo".

## A ideia

Um funil de **5 fases e 13 etapas**, em que a IA trabalha em todas e um humano aprova cada passagem.

| Fase | Entra | Sai |
|---|---|---|
| 1 · Enquadrar | muitas perguntas | uma pergunta ligada a uma decisão |
| 2 · Reunir | todas as fontes | dados internos e externos aptos; a parte de confirmação guardada num cofre |
| 3 · Explorar | gráficos | hipóteses travadas antes de qualquer teste |
| 4 · Comprovar | o cofre, aberto uma única vez | evidências testadas, robustas e comparadas com fontes de fora |
| 5 · Comunicar | evidências | até 5 achados e uma recomendação |

## O que acontece dentro de cada etapa

O mesmo ciclo de quatro passos, sempre:

1. **Planejar** (IA): diz o que vai fazer e o que espera encontrar, antes de rodar.
2. **Executar** (IA): escreve e roda o código; todo número é gravado por script.
3. **Verificar** (IA): testes, reexecução, e a comparação entre o que esperava e o que saiu.
4. **Decidir** (humano): aprova, pede ajuste ou manda voltar.

Depois de cada etapa há um **portão**. São 13, e em 5 deles (★) a decisão pede uma segunda pessoa.

## Quem faz o quê

| Papel | Faz |
|---|---|
| IA analista | planeja, executa e verifica |
| Você | decide em todo portão |
| Segunda pessoa | revisa os 5 portões ★ |
| IA auditora | outra sessão, que não viu o trabalho; confere tudo numa cópia e não edita nada |

## As travas que ficam fora do alcance da IA

Instrução para a IA é a última linha de defesa. O que importa vira trava que ela não consegue mover:

- **Cofre:** os dados que vão testar a hipótese ficam numa pasta fora do projeto até a hora do teste.
- **Registro travado:** a hipótese é escrita e travada antes de o teste rodar, com uma marca guardada fora do projeto.
- **Números por script:** nenhum número é digitado; todos saem de `resultados/*.json`.
- **Sorteio:** em cada portão, você dá uma semente, dois números são sorteados e o código de cada um roda de novo. A IA não escolhe o que será conferido.
- **Auditoria numa cópia:** a segunda IA refaz tudo do zero e compara com os resultados congelados.
- **Aprovação literal:** portão só abre com a sua frase escrita.

## Por que humano e IA juntos

Num sistema de pesquisa parecido com este (HLER, Zhu et al., 2026), com os mesmos modelos e os mesmos prompts, acrescentar três portões humanos e passar o cálculo para código reduziu as falhas críticas de 72% para 16%, em 280 execuções. O número é daquele sistema, não deste kit. O que ele mostra é onde está o controle: no processo em volta do modelo.

## O que uma análise de dados precisa ser

É o fecho da apresentação:

- **Rápida**, para não perder o tempo do cliente nem o da ação que a análise vai gerar.
- **Precisa.** Sempre teve de ser; agora mais que nunca, porque uma alucinação leva o time para o caminho errado.
- **Visual.** Os outros precisam entender o que você fez; quem não entende não age.
- **Com sentido no negócio.** Um número solto não basta: a conclusão tem de se ligar ao problema que você começou a explorar.
- **Uma jornada.** Você não sabe onde vai terminar, nem se a hipótese vai dar certo. Goste do caminho e seja criativo.

## Limites

- O kit organiza o processo e torna os erros visíveis. Não substitui julgamento.
- Portão aprovado sem leitura anula o sistema.
- Nenhuma trava local é absoluta: uma IA com acesso ao terminal consegue ler o que você lê. O cofre torna a violação deliberada e visível, não impossível.
- O rigor completo custa tempo. Para trabalho de disciplina, use o modo essencial, com 6 portões.

As fontes de cada número estão em [`pesquisa/`](../pesquisa/) e em [`referencias/bibliografia.md`](../referencias/bibliografia.md).
