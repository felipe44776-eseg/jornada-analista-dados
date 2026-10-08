# Declaração de uso de inteligência artificial generativa

> Rascunhada na etapa 10 e completada e assinada na etapa 12, a partir do `saidas/log-ia.md` e do `saidas/log-decisoes.md`.
> Modelo baseado em: Unicamp (Deliberação CONSU-A-005/2026), guia da UFMG (2026), Sampaio, Sabbatini e Limongi (Intercom, 2024), política da Elsevier (2026) e política da Springer Nature. **A regra da sua instituição, disciplina ou periódico prevalece.** Não foi localizada política pública da ESEG sobre IA (set/2026): confirme com a coordenação.
> **Onde colocar:** na metodologia (UFMG, Springer Nature) ou numa seção própria antes das referências (Elsevier). Algumas instituições aceitam nota de rodapé (Unicamp). No deck, use a versão curta no slide final.

## Como preencher (leia antes)

Cada frase abaixo é uma **afirmação de fato**. Ela só fica na declaração se aconteceu, com a evidência indicada entre colchetes. **O que não aconteceu é apagado, não suavizado.** Uma declaração falsa é pior que nenhuma.

---

## Versão completa

**Declaração de uso de Inteligência Artificial Generativa**

Neste trabalho, [autor(es)] utilizou(aram) as seguintes ferramentas de IA generativa: [ferramenta, modelo e versão], no período de [AAAA-MM-DD] a [AAAA-MM-DD]. [evidência: log-ia]

**Etapas e finalidades.** A IA foi usada em [etapas] para [finalidades específicas; ex.: "escrever e executar código de limpeza, revisado pelos autores"; "sugerir fontes externas candidatas"]. [evidência: log-ia, por etapa] A IA **não** foi usada para [ex.: "aprovar etapas, escolher as hipóteses testadas, definir a recomendação"]. [evidência: DECs de portão com a frase dos autores]

Marque o que ocorreu e apague o resto:

- [ ] Os resultados numéricos vêm de código executado e salvo em [repositório/apêndice]; nenhum número foi digitado sem execução. [evidência: `resultados/`, conferência número a número]
- [ ] Hipóteses e plano de análise foram registrados e travados antes dos testes confirmatórios (tag `trava-registro`, ancorada em [remoto protegido / e-mail]). [evidência: DEC `âncora` de `trava-registro`]
- [ ] Todas as fontes externas foram abertas, baixadas e registradas; referências e URLs sugeridas pela IA foram conferidas na origem. [evidência: `03-fontes-externas.md`, manifesto]
- [ ] Foram testadas [n] hipóteses e [m] variações de sensibilidade, todas reportadas. [evidência: placar do funil]
- [ ] A auditoria adversarial foi feita por [pessoa / sessão de IA sem histórico / outro modelo], com reexecução do código. [evidência: DECs de auditoria]
- [ ] Houve revisão por segunda pessoa nos portões críticos: [nomes] **ou** não houve revisão independente, o que foi declarado nos decks. [evidência: DECs]
- [ ] Erros da IA detectados e corrigidos: [resumo]. [evidência: log-ia]

**Dados enviados à IA.** [agregados · anonimizados · pseudonimizados (continuam sendo dado pessoal pela LGPD, art. 13, §4º) · públicos · só o esquema], conforme a Lei nº 13.709/2018 (LGPD) e [norma institucional]. [evidência: kickoff §4–5; log-ia]

**Responsabilidade.** Os autores revisaram todo o material produzido com auxílio de IA e assumem integral responsabilidade pelos dados, análises, resultados e conclusões, inclusive por eventuais imprecisões. A IA não é autora deste trabalho.

Assinatura(s): ___ · Data: AAAA-MM-DD

---

## Versão curta (slide final ou nota de rodapé)

> Este trabalho usou [ferramenta/modelo, versão] para [finalidades] nas etapas [lista]. [Todos os números vêm de código executado e revisado ([link]).] [Prompts e decisões estão em [link].] [Os dados enviados à IA eram ___.] Os autores revisaram todo o conteúdo e assumem total responsabilidade por ele.

*(Os trechos entre colchetes só ficam se ocorreram.)*

---

## Checklist antes de assinar

- [ ] **Cada frase conferida pelo humano contra o log**; o que não ocorreu foi apagado
- [ ] Ferramenta, modelo, versão e período informados
- [ ] Etapas e finalidades específicas, sem "a IA ajudou no trabalho"
- [ ] O que a IA **não** fez está dito
- [ ] Rastreabilidade: onde estão código, logs e prompts
- [ ] Tratamento de dados pessoais descrito corretamente (pseudonimizado ≠ anonimizado)
- [ ] Responsabilidade assumida; IA não listada como autora
- [ ] Regra da instituição conferida
