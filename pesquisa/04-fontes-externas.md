# Fontes externas para comparação e checagem de dados — catálogo verificado e metodologia

Pesquisa 4 · Data Science (ESEG), São Paulo · verificação executada em 23/09/2026 · somente leitura web.

---

## 0. Como ler este relatório

Status de verificação usado em todo o documento:

- `[OK]` — URL aberta (HTTP 200) e o conteúdo citado foi conferido na própria página, arquivo ou resposta de API.
- `[PARCIAL]` — o site bloqueia acesso automatizado (Cloudflare "Just a moment...", Akamai "Access Denied", reCAPTCHA) ou só parte do conteúdo foi conferida; o que se afirma foi confirmado por outra via oficial do mesmo produtor (API, FTP, documentação) ou por leitura via WebFetch.
- `[NV]` — não verificado (bloqueio ou erro). A fonte segue listada; nada do que se diz dela conta como conferido.

Regras seguidas: código de tabela SIDRA, série SGS, endpoint, nome de tabela BigQuery e número só aparecem se foram devolvidos pela fonte nesta sessão. Números são os valores servidos em 23/09/2026 e podem ser revisados depois — o que é parte do argumento.

---

## 1. Achados que mudam a prática

1. **IBGE atrás de anti-bot.** `www.ibge.gov.br`, `sidra.ibge.gov.br` e `censo2022.ibge.gov.br` devolvem 403 intermitente (Cloudflare). Em pipeline, use `servicodados.ibge.gov.br` (API v3), `apisidra.ibge.gov.br` (API legada) e `ftp.ibge.gov.br` — os três responderam normalmente.
2. **PMC e PMS foram rebaseadas para 2022=100.** As tabelas 2014=100 estão "série encerrada em dezembro de 2022". Código antigo em notebook ou em resposta de LLM aponta para série morta; use 8880/8881 (PMC) e 5906 (PMS).
3. **CNPJ da Receita mudou de lugar.** O caminho antigo `/dados/cnpj/dados_abertos_cnpj/` devolve 404; os dados estão num repositório Nextcloud (SERPRO+), pastas mensais `Dados/Cadastros/CNPJ/AAAA-MM` (2023-05 a 2026-09). O município vem em **código TOM de 4 dígitos** (São Paulo = 7107), não no código IBGE (3550308).
4. **O crosswalk TOM→IBGE da própria Receita tem buraco.** `municipios.csv` não contém Boa Esperança do Norte (IBGE **5101837**), que já está na API de localidades do IBGE (5.571 municípios). Join ingênuo perde registros sem erro → anti-join obrigatório.
5. **Censo 2022 × Estimativas não são intercambiáveis.** Brasil: 203.080.756 (Censo 2022) × 213.421.037 (Estimativa 2025), +5,1% em três anos, incompatível com crescimento vegetativo; São Paulo (capital): 11.451.999 × 11.904.961 (+4,0%). O denominador precisa ser escolhido e registrado (a causa metodológica não foi verificada nesta sessão; ver notas no FTP das Estimativas).
6. **Série oficial com buraco.** O CPI-U dos EUA de outubro/2025 não existe: a API do BLS devolve `-` com a nota "Data unavailable due to the 2025 lapse in appropriations".
7. **Papers with Code não existe mais como catálogo.** `paperswithcode.com/datasets` redireciona para `huggingface.co/papers/trending`.
8. **Licenças heterogêneas.** BCB, CVM e ANEEL declaram ODbL (compartilhamento pela mesma licença para banco derivado usado publicamente); a Prefeitura de SP mistura CC0, CC-BY e CC Não-Comercial; o repositório da SEADE não declara licença em 81 de 84 conjuntos; a Base dos Dados remete aos termos de cada fonte original.
9. **O próprio verificador alucinou.** Quando a página de API do Kaggle carregou só o título, o sumarizador de páginas devolveu "informação típica" como se fosse conteúdo da página. Foi descartado. É um exemplo concreto do risco tratado em B.7.

---

## A. Catálogo verificado

### A.1 IBGE (produtor oficial — núcleo)

#### A.1.1 SIDRA e API de dados agregados (v3)

- **Órgão:** IBGE (fundação pública federal).
- **Temas:** todas as pesquisas com tabelas agregadas. A API lista 70 pesquisas (Censo, PNAD Contínua, PMC, PMS, IPCA/INPC, PIB dos Municípios, Estimativas, Cempre etc.).
- **Granularidade:** varia por tabela. Nível territorial codificado: `N1` = Brasil, `N3` = UF, `N6` = município (conferidos nas respostas), além de Grande Região, região metropolitana etc. Os nomes saem em `/agregados/{id}/localidades/{nivel}`. A periodicidade vem nos metadados (`periodicidade.frequencia/inicio/fim`).
- **Acesso:** portal SIDRA (interativo); API REST v3 com base `https://servicodados.ibge.gov.br/api/v3` e endpoints documentados `/agregados`, `/agregados/{agregado}/metadados`, `/agregados/{agregado}/periodos`, `/agregados/{agregado}/localidades/{nivel}`, `/agregados/{agregado}/periodos/{periodos}/variaveis/{variavel}?localidades=...&classificacao=...`; API legada `apisidra.ibge.gov.br/values/...`.
- **Licença/termos:** a página de termos do IBGE está bloqueada `[NV]`. O snippet do buscador indica reprodução permitida desde que citada a fonte IBGE (não conferido na página). Como fundação pública federal, o IBGE está sob o art. 4º do Decreto 8.777/2016 (livre utilização).
- **URLs:** https://sidra.ibge.gov.br/ `[PARCIAL — 403 Cloudflare; conteúdo via API]` · https://servicodados.ibge.gov.br/api/docs/agregados?versao=3 `[OK]` · https://servicodados.ibge.gov.br/api/docs `[OK]` · https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%203 `[OK]`

Tabelas conferidas via `/metadados` em 23/09/2026:

| Tabela | Conteúdo | Frequência e cobertura | Níveis | Variáveis/classificações úteis |
|---|---|---|---|---|
| 1737 | IPCA — série histórica (número-índice e variações) | mensal, dez/1979–ago/2026 | N1 | 2266 número-índice (dez/1993=100); 63 var. mensal; 2265 var. 12 meses |
| 7060 | IPCA por grupos, subgrupos, itens e subitens, com pesos | mensal, jan/2020–ago/2026 | N1, N6 (6 municípios), N7 | 63; 69 acum. ano; 2265; 66 peso mensal |
| 1736 | INPC — série histórica | mensal, desde 1979–ago/2026 | N1 | 2289 número-índice (dez/1993=100); 44 var. mensal |
| 7063 | INPC por grupos/subitens | mensal (período: conferir) | conferir | — |
| 8880 | PMC — varejo (2022=100) | mensal, jan/2000–jul/2026 | N1, N3 | 7169 índice; 7170 índice com ajuste sazonal; 11708–11711 variações; classificação 11046: 56733 receita nominal, 56734 volume |
| 8881 | PMC — varejo ampliado (2022=100) | mensal, jan/2003–jul/2026 | N1, N3 | idem 8880 |
| 8882 / 8883 | PMC por atividades (varejo / ampliado) | mensal | conferir | — |
| 8884 / 8757 | PMC — veículos, motos, partes e peças / materiais de construção (2022=100) | mensal | conferir | — |
| 5906 | PMS — serviços (2022=100) | mensal, jan/2011–jul/2026 | N1, N3 | 7167 índice; 7168 com ajuste; 11623–11626 variações |
| 8688 / 8693 / 8694 / 8695 | PMS por atividades / turismo / transportes (2022=100) | mensal | conferir | — |
| 6381 | PNADC mensal — taxa de desocupação (trimestre móvel) + CV | 2012-03–2026-07 | N1 | 4099 taxa; 4103 CV |
| 4093 | PNADC trimestral — força de trabalho por sexo (+ CVs) | 2012T1–2026T2 | N1, N2, N3, N6, N7, N14 | 1641 (mil pessoas); 4087 CV |
| 6468 | PNADC trimestral — taxa de desocupação + CV | 2012T1–2026T2 | idem 4093 | 4099; 4103 |
| 6579 | Estimativas de População | anual, 2001–2026 | N1, N2, N3, N6 | 9324 |
| 9514 | Censo 2022 — população por sexo, idade | 2022 | N1, N2, N3, N6 | 93 |
| 4709 | Censo 2022 — população, variação sobre 2010 compatibilizada, crescimento geométrico | 2022 | N1, N2, N3, N6 | 93; 5936; 10605 |
| 4714 | Censo 2022 — população, área, densidade | 2022 | N1, N2, N3, N6 | 93; 6318 (km²); 614 |
| 9605 | Censo — população por cor ou raça (2010 e 2022) | 2010, 2022 | N1, N2, N3, N6 (+ especiais) | 93 |
| 5938 | PIB dos Municípios (referência 2010) | anual, 2002–2023 | N1, N2, N3, N6, N8, N9 | 37 PIB a preços correntes (mil R$) |

Chamadas reproduzíveis (valores devolvidos em 23/09/2026):

```bash
# -g desliga o globbing de [] no curl; o separador | vai codificado como %7C
curl -g "https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-3/variaveis/63%7C2265?localidades=N1[all]"
# IPCA var. mensal: jun/26 0,16; jul/26 0,07; ago/26 -0,32 | 12 meses: 4,64; 4,44; 4,22

curl -g "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614?localidades=N6[3550308]"
# São Paulo (SP): 11.451.999 hab.; 1.521,202 km²; 7.528,26 hab/km²

curl -g "https://servicodados.ibge.gov.br/api/v3/agregados/8880/periodos/-2/variaveis/7169?localidades=N3[35]&classificacao=11046[56734]"
# PMC, índice de volume de vendas no varejo, SP (2022=100): jun/26 101,59825; jul/26 103,76953

curl "https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%203"
# API legada: mesmos 0,16 / 0,07 / -0,32
```

#### A.1.2 Censo Demográfico 2022

- **Temas:** população, domicílios, idade/sexo, cor ou raça, alfabetização, indígenas, quilombolas, favelas e comunidades urbanas, entorno dos domicílios, religiões; microdados e áreas de ponderação.
- **Granularidade:** Brasil a município (SIDRA); setor censitário (FTP, "Agregados_por_Setores_Censitarios…"); área de ponderação (microdados). Referência temporal única, 2022; a comparação com 2010 usa variáveis "compatibilizadas" (ex.: 5936 na tabela 4709).
- **Acesso:** SIDRA/API (tabelas acima); FTP. Microdados de acesso público e de acesso controlado; o IBGE mantém "Sala de Acesso a Dados Restritos".
- **Versão:** os microdados foram atualizados em 14/09/2026 (inclusão da variável P0115, "Número de ordem da Família") — por isso a safra tem de ser registrada.
- **URLs:** https://censo2022.ibge.gov.br/ `[PARCIAL — 403]` · https://ftp.ibge.gov.br/Censos/Censo_Demografico_2022/ `[OK]` · https://ftp.ibge.gov.br/Censos/Censo_Demografico_2022/Microdados_e_Areas_de_Ponderacao/1_Atualizacoes_20260914.pdf `[OK]`

#### A.1.3 CNEFE 2022 — Cadastro Nacional de Endereços para Fins Estatísticos

- **Uso:** ponte endereço/CEP → setor/município. Pastas: `Agregados_por_CEP/`, `Arquivos_CNEFE/`, `Coordenadas_enderecos/`, `Trajetos_dos_Recenseadores/`. Só a listagem foi aberta; o conteúdo dos arquivos não foi conferido.
- **URL:** https://ftp.ibge.gov.br/Cadastro_Nacional_de_Enderecos_para_Fins_Estatisticos/Censo_Demografico_2022/ `[PARCIAL — listagem OK]`

#### A.1.4 PNAD Contínua

- **Temas:** força de trabalho, rendimento, características da população; módulos anuais.
- **Granularidade (nota técnica IBGE, 2020):** resultados trimestrais para Brasil, Grandes Regiões, UF, municípios das capitais, RMs que contêm capitais e RIDE da Grande Teresina; mensais só para Brasil, e cada "mês" é o trimestre móvel encerrado nele. Amostra em cerca de 3.500 municípios. População do tema trabalho: 14 anos ou mais. Série desde 2012.
- **Acesso:** SIDRA/API; microdados, notas técnicas e metodológicas no FTP.
- **Notas técnicas-chave (FTP, conferidas):** diferenças PNAD/PME × PNADC; diferenças CAGED × PNADC (2020); ponderação, NT 02/2021 (coleta por telefone desde o 2º tri/2020, queda de resposta, restrição temporária de desagregações); cálculo dos deflatores (2015); harmonização de rendimentos (NT 01/2021).
- **URLs:** https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html `[PARCIAL — 403 persistente]` · https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/ `[OK]` · …/Nota_Tecnica/ `[OK]`

#### A.1.5 PMC e PMS

- **Temas:** PMC — receita nominal e volume de vendas do varejo e do varejo ampliado, por atividade. PMS — receita nominal e volume de serviços, por atividade, turismo e transportes.
- **Granularidade:** mensal; Brasil e UF (N3) nas tabelas 8880, 8881 e 5906. Base atual 2022=100.
- **Acesso:** SIDRA/API; página do produto.
- **URLs:** https://www.ibge.gov.br/estatisticas/economicas/comercio/9227-pesquisa-mensal-de-comercio.html `[PARCIAL — 200 na 1ª tentativa, 403 depois]` · https://www.ibge.gov.br/estatisticas/economicas/servicos/9229-pesquisa-mensal-de-servicos.html `[PARCIAL — idem]`

#### A.1.6 IPCA e INPC (SNIPC)

- **IPCA (conferido na página):** população-objetivo de famílias com rendimento de 1 a 40 salários mínimos, residentes nas áreas urbanas das RMs de Belém, Fortaleza, Recife, Salvador, Belo Horizonte, Vitória, Rio de Janeiro, São Paulo, Curitiba e Porto Alegre, além do DF e dos municípios de Goiânia, Campo Grande, Rio Branco, São Luís e Aracaju. Coleta em geral do dia 01 ao 30 do mês de referência. Estruturas de ponderação atualizadas pela POF 2017–2018 (Notas Técnicas 02/2019 e 01/2020).
- **INPC:** faixa de renda distinta da do IPCA (1 a 5 salários mínimos — `[NV]` nesta sessão).
- **Equivalência conferida:** a variação mensal do IPCA na SIDRA (1737/v63) é igual à da série SGS 433 do BCB (0,16; 0,07; -0,32 em jun–ago/2026). O INPC na SIDRA (1736/v44) é igual à SGS 188 (0,14; -0,01; -0,32).
- **URL:** https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html `[OK — 200 na 2ª tentativa]`

#### A.1.7 Estimativas de População

- **Granularidade:** anual, município (SIDRA 6579, 2001–2026).
- **Versões:** o FTP `Estimativas_2025/` traz três versões do mesmo produto (`POP2025_20251031`, `POP2025_20260113`, `POP2025_20260828`), a versão do DOU (`estimativa_dou_2025`) e `Decisoes_judiciais_que_alteraram_coeficientes_do_FPM.pdf`. Registre qual arquivo foi usado.
- **URLs:** https://ftp.ibge.gov.br/Estimativas_de_Populacao/ `[OK]` · https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2025/ `[OK]`

#### A.1.8 Malhas, localidades e códigos de município

- **Malha Municipal:** edições de 2000 a 2025. Retrata a Divisão Político-Administrativa vigente. Alterações territoriais comunicadas depois de 30 de abril entram na malha do ano seguinte.
- **API Localidades:** em 23/09/2026 lista 5.571 municípios, incluindo Boa Esperança do Norte (5101837).
- **API Malhas v3:** GeoJSON por município (ex.: 3550308).
- **Código de município IBGE:** 7 dígitos, com o prefixo da UF (35 = SP; 3550308 = São Paulo).
- **URLs:** https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html `[OK]` · https://servicodados.ibge.gov.br/api/docs/localidades `[OK]` · https://servicodados.ibge.gov.br/api/v1/localidades/municipios `[OK]` · https://servicodados.ibge.gov.br/api/docs/malhas?versao=3 `[OK]` · https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3550308?formato=application/vnd.geo+json `[OK]` · https://www.ibge.gov.br/explica/codigos-dos-municipios.php `[OK]`

### A.2 Outras fontes brasileiras

**dados.gov.br — Portal Brasileiro de Dados Abertos** (CGU)
- **Temas e granularidade:** catálogo federal de metadados com links para os recursos dos órgãos; a granularidade é a de cada conjunto.
- **Acesso:** portal (aplicação JS) e API REST, especificada em OpenAPI 3.1. Endpoints públicos: `GET /dados/api/publico/conjuntos-dados`, `GET /dados/api/publico/conjuntos-dados/{id}`, `GET /dados/api/publico/organizacao`, `GET /dados/api/publico/reusos`. Autenticação por header `chave-api-dados-abertos` (a especificação manda obter a chave em "Minha Conta" com perfil Consumidor).
- **Licença:** a especificação declara o Decreto 8.777/2016.
- **Uso na checagem:** localizar dados. O dado mora no produtor, então registre a URL do produtor.
- **URLs:** https://dados.gov.br/ `[OK]` · https://dados.gov.br/swagger-ui/index.html `[OK]` · https://dados.gov.br/v3/api-docs `[OK]`

**Base dos Dados** (ONG)
- **Temas:** datalake público com tabelas tratadas de fontes brasileiras.
- **Acesso:** BigQuery, no projeto público `basedosdados`. Exemplo da documentação: `SELECT * FROM \`basedosdados.br_bd_diretorios_brasil.municipio\``. Também há download e pacotes Python/R (nomes dos pacotes `[NV]`). É preciso um projeto Google Cloud (sandbox, sem meio de pagamento); cada usuário tem 1 TB/mês de consulta gratuita.
- **Termos:** os direitos de propriedade intelectual dos dados são de terceiros e seguem as políticas de uso de cada fonte. A Base dos Dados não re-licencia.
- **Uso na checagem:** é um intermediário. Registre a fonte primária e a data de atualização da tabela tratada.
- **URLs:** https://basedosdados.org/ `[OK]` · https://basedosdados.org/docs/home `[OK]` · https://basedosdados.org/docs/access_data_bq `[OK]` · https://basedosdados.org/terms `[OK]`

**Ipeadata** (Ipea)
- **Temas:** bases Macroeconômico, Regional e Social; compila IBGE, BCB e outros, além de séries próprias.
- **Acesso:** portal e API OData v4 em `http://www.ipeadata.gov.br/api/odata4/`, com EntitySets `Metadados`, `Valores`, `ValoresStr`, `Temas`, `Territorios` e `Paises`. Exemplo: `…/Metadados('BM12_TJOVER12')` → "Taxa de juros - Over / Selic - acumulada no mês".
- **Licença:** não localizada.
- **Uso na checagem:** como redistribuidor, confira o dado contra a fonte primária.
- **URLs:** http://www.ipeadata.gov.br/Default.aspx `[OK]` · http://www.ipeadata.gov.br/api/odata4/ `[OK]`

**Banco Central do Brasil**
- **SGS (séries temporais):** API `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{código}/dados?formato=json`, com `&dataInicial=dd/mm/aaaa&dataFinal=dd/mm/aaaa` opcionais, ou `…/dados/ultimos/{N}?formato=json`.
  - Códigos conferidos pelo nome no portal de dados abertos do BCB: 432 (Meta Selic), 4390 (Selic acumulada no mês), 24363 (IBC-Br), 20542 (saldo da carteira com recursos livres — total), 21082/21083/21084 (inadimplência da carteira — total/PJ/PF), 21112 (PF, recursos livres), 21145 (PF, recursos direcionados), 1 (câmbio livre, dólar, venda, diário), 10813 (dólar, compra), 3692 (dólar, venda, fim de período anual).
  - Conferidos por igualdade numérica com a SIDRA: 433 (IPCA, variação mensal) e 188 (INPC, variação mensal).
- **Portal de Dados Abertos (CKAN):** 4.261 conjuntos; numa amostra de 100, todos com licença ODbL. Inclui SCR.data, IF.data, PTAX e Mercado Imobiliário (os dois últimos via Olinda).
- **Olinda — Expectativas (Focus), OData:** `ExpectativasMercadoAnuais`, `ExpectativaMercadoMensais`, `ExpectativasMercadoTrimestrais`, `ExpectativasMercadoInflacao12Meses`, `ExpectativasMercadoSelic` e as variantes Top5.
- **Calculadora do Cidadão:** correção de valores por índice, útil para conferir deflações feitas à mão.
- **URLs:** https://www3.bcb.gov.br/sgspub/ `[OK]` · https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/3?formato=json `[OK]` · https://dadosabertos.bcb.gov.br/ `[OK]` · https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ `[OK]` · https://www3.bcb.gov.br/CALCIDADAO/publico/exibirFormCorrecaoValores.do?method=exibirFormCorrecaoValores `[OK]`

**DATASUS (TabNet) e OpenDataSUS** (Ministério da Saúde)
- **TabNet:** tabulador web de informações de saúde.
- **OpenDataSUS:** redireciona para o "Portal de Dados Abertos do SUS", que tem API de Dados Abertos e o Plano de Dados Abertos do MS 2026–2028.
- **Granularidade:** tipicamente município, mas confira por sistema.
- **Licença:** não conferida.
- **URLs:** https://datasus.saude.gov.br/informacoes-de-saude-tabnet/ `[OK]` · https://opendatasus.saude.gov.br/ → https://dadosabertos.saude.gov.br `[OK]`

**INEP — microdados** (MEC)
- **Temas:** ENEM, Censo Escolar, Saeb, Enade e outros.
- **Granularidade:** edições anuais; escola/município conforme o dicionário.
- **LGPD:** os microdados estão sendo "reestruturados para suprimir a possibilidade de identificação de pessoas" em atendimento à LGPD; o controle de privacidade dos censos educacionais foi analisado em TED com a UFMG. Dados protegidos ficam no Sedap (Serviço de Acesso a Dados Protegidos).
- **Licença:** não localizada.
- **URLs:** https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados `[OK]` · …/microdados/enem `[OK]` · …/microdados/censo-escolar `[OK]`

**Portal da Transparência** (CGU)
- **Temas:** despesas, transferências, servidores, contratos, licitações, notas fiscais, sanções, benefícios.
- **Acesso:** consulta, download em lote e API REST. O token chega pelo e-mail cadastrado. Limite de 400 requisições/min das 6h às 23h59 e 700/min das 0h às 5h59.
- **Licença e dados pessoais:** Decreto 8.777 (livre utilização). Contém dados pessoais (servidores, beneficiários), então vale o art. 7º §3º da LGPD.
- **URLs:** https://portaldatransparencia.gov.br/ `[OK]` · https://portaldatransparencia.gov.br/download-de-dados `[OK]` · https://portaldatransparencia.gov.br/api-de-dados `[OK]` · https://api.portaldatransparencia.gov.br/swagger-ui/index.html `[OK]`

**TSE — Portal de Dados Abertos**
- **Temas:** eleitorado, candidatos (inclusive bens), resultados, prestação de contas, pesquisas eleitorais. Isso vem dos títulos em resultados de busca (ex.: conjunto "Candidatos - 2026") e não foi conferido na página.
- **URL:** https://dadosabertos.tse.jus.br/ `[NV — "Access Denied" para curl e WebFetch]`

**MTE — PDET (Novo CAGED, RAIS)**
- **Temas:** CAGED/Novo CAGED (movimentação mensal do emprego celetista; segundo o IBGE, a única fonte mensal de emprego com desagregação municipal); RAIS (vínculos e estabelecimentos, anual); RAIS Mensal (link para 2026).
- **Acesso:**
  - painéis e tabelas;
  - microdados não identificados em TXT delimitado por ";" (UTF-8 no Novo Caged), pelo FTP `ftp://ftp.mtps.gov.br/pdet/microdados/` — endereço citado na página oficial, não testado aqui;
  - dados identificados só mediante solicitação.
- **Quebra de série:** desde jan/2020, o CAGED foi substituído pelo eSocial para parte das empresas (Portaria SEPRT nº 1.127/2019), com imputação de dados de outras fontes. Daí o nome "Novo Caged".
- **URLs:** https://pdet.mte.gov.br/ → https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho `[OK]` · …/estatisticas-trabalho/microdados-rais-e-caged `[OK]` · …/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged `[OK]`

**Receita Federal — CNPJ (dados abertos)**
- **Conteúdo:** Empresas, Estabelecimentos, Sócios, Simples e tabelas de domínio (Cnaes, Motivos, Municipios, Naturezas, Paises, Qualificacoes).
- **Granularidade:** estabelecimento; snapshots mensais `Dados/Cadastros/CNPJ/AAAA-MM/` de 2023-05 a 2026-09. A pasta 2026-09 foi modificada em 14/09/2026; `Estabelecimentos0.zip` tem cerca de 2,2 GB. Município em código TOM de 4 dígitos (`"7107";"SAO PAULO"`, `"1182";"BOA ESPERANCA DO NORTE"`, `"9707";"EXTERIOR"`).
- **Acesso:** repositório Nextcloud "Arquivos da Receita Federal - SERPRO+", link público, navegável no browser ou por WebDAV.
- **Crosswalk TOM↔IBGE da Receita:** arquivo em cp1252, separado por ";", com colunas `CÓDIGO DO MUNICÍPIO - TOM;CÓDIGO DO MUNICÍPIO - IBGE;…`. Cobre 5.570 dos 5.571 municípios (falta **5101837**) mais a linha EXTERIOR.
- **Licença e dados pessoais:** Decreto 8.777. Os sócios pessoa física são dado pessoal (LGPD).
- **URLs:** https://arquivos.receitafederal.gov.br/ → https://arquivos.receitafederal.gov.br/index.php/s/gn672Ad4CF8N6TK `[OK]` · https://www.gov.br/receitafederal/dados/municipios.csv `[OK]` · https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj `[OK — página JS]` · caminho antigo https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/ `[404]`
- **Crosswalk alternativo (Tesouro, lista de municípios do SIAFI com código IBGE):** CSV de 5.589 linhas. No arquivo baixado em 23/09/2026 não aparece 5101837. Licença não especificada no CKAN. URL: https://www.tesourotransparente.gov.br/ckan/dataset/lista-de-municipios-do-siafi `[OK]`

**INMET**
- **Conteúdo:** dados meteorológicos históricos de estações automáticas em arquivos ZIP anuais de 2000 a 2026 (2026 até 31/08, segundo a página); BDMEP.
- **Granularidade:** a estação é um ponto; para chegar ao município é preciso associação espacial.
- **Licença:** não localizada.
- **URLs:** https://portal.inmet.gov.br/dadoshistoricos `[OK]` · https://bdmep.inmet.gov.br/ `[OK]`

**ANP**
- **Conteúdo:** dados abertos do setor e "Série Histórica de Preços de Combustíveis e de GLP" (granularidade e periodicidade: conferir no conjunto).
- **URLs:** https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos `[OK]` · https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/serie-historica-de-precos-de-combustiveis `[OK]`

**ANEEL**
- **Conteúdo:** CKAN com 72 conjuntos (ex.: tarifas de aplicação TE/TUSD), em CSV, PARQUET e PDF.
- **Licença:** ODbL declarada em 69 dos 72.
- **URL:** https://dadosabertos.aneel.gov.br/ `[OK]`

**ANS**
- **Conteúdo:** saúde suplementar (beneficiários por operadora, TISS, painéis).
- **Acesso:** diretório de arquivos (índice com a pasta `FTP/`) e página gov.br, que remete ao Portal Brasileiro de Dados Abertos (Decreto 8.777).
- **URLs:** https://dadosabertos.ans.gov.br/ `[OK]` · https://www.gov.br/ans/pt-br/acesso-a-informacao/perfil-do-setor/dados-abertos-1 `[OK]`

**CVM**
- **Conteúdo:** CKAN com 54 conjuntos (companhias abertas, fundos, ofertas).
- **Licença:** ODbL em todos.
- **Schema drift:** a home publica o log de colunas novas (ex.: mudanças a partir de 20/11/2023 e de 25/03/2024) — exemplo concreto de mudança de esquema.
- **URL:** https://dados.cvm.gov.br/ `[OK]`

**SUSEP — SES**
- **Conteúdo:** Sistema de Estatísticas da SUSEP v4.0 (seguros, capitalização, previdência; por empresa e produto). A base para download está "atualizada até 202607 (gerada em 21/09/2026)".
- **URLs:** https://www2.susep.gov.br/menuestatistica/SES/principal.aspx `[OK]` · https://www.gov.br/susep/pt-br/central-de-conteudos/dados-estatisticos `[OK]` · https://dados.susep.gov.br/ `[404]`

**Fundação SEADE (SP)**
- **Temas:** estatísticas do Estado de SP (demografia, economia, estatísticas vitais, trabalho).
- **Repositório CKAN:** 84 conjuntos; 81 sem licença declarada e 3 com CC Não-Comercial.
- **URLs:** https://www.seade.gov.br/ `[OK]` · https://repositorio.seade.gov.br/ `[OK]` · https://imp.seade.gov.br/ `[NV — erro TLS]`

**Prefeitura de São Paulo**
- **Portal de Dados Abertos (CKAN):** 483 conjuntos, 81 órgãos, 16 grupos; licenças mistas (CC0, CC-BY, CC Não-Comercial) na amostra.
- **Outros produtos:** GeoSampa (mapa digital da cidade); ObservaSampa (indicadores); da Fazenda, "Dados das Transações Imobiliárias com recolhimento de ITBI" (xlsx/ods por ano; arquivos de 2019–2021 corrigidos).
- **URLs:** https://dados.prefeitura.sp.gov.br/ `[OK]` · https://geosampa.prefeitura.sp.gov.br/ `[OK]` · https://observasampa.prefeitura.sp.gov.br/ `[OK]` · https://prefeitura.sp.gov.br/web/fazenda/w/acesso_a_informacao/31501 `[OK]`

**Brasil.IO** (comunitário)
- **Conteúdo:** datasets de dados públicos organizados (ex.: Portal da Transparência).
- **Acesso:** a API exige token (resposta 401 que orienta a gerar a chave em https://brasil.io/auth/tokens-api/).
- **Licença:** não conferida.
- **URLs:** https://brasil.io/ `[OK]` · https://brasil.io/datasets/ `[OK]`

**Índice FipeZap** (Fipe; referência privada)
- **Conteúdo:** variações de preço calculadas sobre anúncios de venda e locação dos portais do Grupo OLX (Zap, Viva Real, OLX). É preço de anúncio, não de transação. Residencial em até 56 cidades (22 capitais); comercial em 10 cidades (salas e conjuntos de até 200 m²). Notas metodológicas de fev/2019.
- **Acesso:** série histórica em XLSX gratuita (59 abas, referência ago/2026).
- **Licença:** não explicitada. Cite a fonte e não presuma direito de redistribuição.
- **URLs:** https://www.fipe.org.br/pt-br/indices/fipezap/ `[OK]` · https://downloads.fipe.org.br/indices/fipezap/fipezap-serieshistoricas.xlsx `[OK; SHA-256 06190141ea86023d471d2c7c3634a6c7855c03498856a621fffac3e918a0ce41 em 23/09/2026]`

### A.3 Fontes globais

**World Bank Open Data / WDI**
- **Conteúdo:** indicadores por país e ano.
- **API v2 (JSON):** `https://api.worldbank.org/v2/country/{país}/indicator/{indicador}?format=json`. Exemplo: BR, NY.GDP.MKTP.CD → 2025 = US$ 2.279.920.092.492, com `lastupdated` 2026-07-13.
- **Licença:** CC BY 4.0, com exceções rotuladas por conjunto.
- **Nota:** o site informa expansão para o Data360.
- **URLs:** https://data.worldbank.org/ `[OK]` · https://api.worldbank.org/v2/country/BR/indicator/NY.GDP.MKTP.CD?format=json `[OK]` · https://datacatalog.worldbank.org/public-licenses `[OK]`

**IMF Data (FMI)**
- **Conteúdo:** WEO (abril/outubro; desde 1980, com projeções de 5 anos), Fiscal Monitor, COFER, CPI, Labor Statistics, entre outros.
- **Acesso:** APIs SDMX 2.1 e 3.0; explorador Swagger em `portal.api.imf.org`, com login.
- **Termos:** https://www.imf.org/external/terms.htm `[NV — 403]`.
- **URLs:** https://data.imf.org/ `[PARCIAL — WebFetch OK, curl 403]` · https://data.imf.org/en/Resource-Pages/IMF-API `[PARCIAL — WebFetch OK]`

**OECD Data Explorer**
- **Acesso:** portal e API SDMX REST em `https://sdmx.oecd.org/public/rest/` (o dataflow `OECD.SDD.STES` devolveu XML).
- **Termos:** `[NV]`.
- **URLs:** https://data-explorer.oecd.org/ `[OK]` · https://sdmx.oecd.org/public/rest/dataflow/OECD.SDD.STES/all/latest `[OK]`

**UNdata (UNSD)**
- **Situação do site:** a raiz agora se chama "UN System Data Commons"; o UNdata clássico segue em `Default.aspx`.
- **API:** SDMX REST em `http://data.un.org/ws/rest/{artifact}/{artifactId}/{parameters}`.
- **Termos:** dados e metadados gratuitos, que podem ser copiados e redistribuídos citando o UNdata.
- **URLs:** https://data.un.org/ `[OK]` · https://data.un.org/Default.aspx `[OK]` · https://data.un.org/Host.aspx?Content=API `[OK]` · https://data.un.org/Host.aspx?Content=UNdataUse `[OK]`

**UN SDG Global Database**
- **Conteúdo:** indicadores dos ODS por país e ano, com portal e API (Swagger).
- **URLs:** https://unstats.un.org/sdgs/dataportal `[OK]` · https://unstats.un.org/sdgapi/swagger/ `[OK]`

**WHO — Global Health Observatory (GHO)**
- **Conteúdo:** indicadores de saúde por país e região.
- **API OData:** `https://ghoapi.azureedge.net/api/`, com `/Dimension`, `/Indicator` e `$filter=contains(IndicatorName,'…')`.
- **Licença:** página "Permissions and licensing" não conferida.
- **URLs:** https://www.who.int/data/gho `[OK]` · https://www.who.int/data/gho/info/gho-odata-api `[OK]` · https://ghoapi.azureedge.net/api/ `[OK]`

**Our World in Data**
- **Conteúdo:** 14.095 gráficos em 126 tópicos; URLs de CSV e metadados JSON.
- **Licença:** CC BY para o conteúdo próprio; dados de terceiros (WHO, ONU, Banco Mundial) seguem a licença do provedor.
- **URLs:** https://ourworldindata.org/ `[OK]` · https://ourworldindata.org/faqs `[OK]`

**FRED (Federal Reserve Bank of St. Louis)**
- **Conteúdo:** agregador de séries.
- **API:** exige chave; a v2 serve para bulk por release.
- **Exemplo:** CPIAUCSL = CPI-U, índice 1982–84=100, com ajuste sazonal, mensal, fonte BLS; ago/2026 = 334,131 (atualizado em 11/09/2026).
- **Termos:** em `/docs/api/terms_of_use.html` `[NV — timeout]`.
- **URLs:** https://fred.stlouisfed.org/series/CPIAUCSL `[OK via WebFetch]` · https://fred.stlouisfed.org/docs/api/fred/ `[OK via WebFetch; curl com timeout]`

**Eurostat**
- **Acesso:** base de dados; web services (Statistics API em JSON-stat, SDMX 2.1/3.0, Catalogue API); bulk download.
- **Reuso:** o conteúdo editorial é CC BY 4.0. Dados e metadados podem ser reutilizados, com ou sem fins comerciais, desde que a fonte seja reconhecida (Decisão da Comissão de 12/12/2011).
- **URLs:** https://ec.europa.eu/eurostat/data/database `[OK]` · https://ec.europa.eu/eurostat/data/web-services `[OK]` · https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access `[OK]` · https://ec.europa.eu/eurostat/help/copyright-notice `[OK]`

**ILOSTAT (OIT)**
- **Acesso:** pacote R oficial `Rilostat` (CRAN, OIT).
- **URLs:** https://ilostat.ilo.org/data/ `[NV — 403 Cloudflare]` · https://cran.r-project.org/package=Rilostat `[OK]`

**FAOSTAT (FAO)**
- **URL:** https://www.fao.org/faostat/en/#data `[PARCIAL — 200, aplicação JS; conteúdo e licença não conferidos]`

**data.gov (EUA)**
- **Conteúdo:** catálogo federal com 559.630 datasets em 23/09/2026; nova versão em catalog.data.gov.
- **URLs:** https://data.gov/ `[OK]` · https://catalog.data.gov/ `[OK]`

**US Census — ACS**
- **Conteúdo:** American Community Survey, estimativas 1-year e 5-year (release do PUMS 5-year 2020–2024).
- **Acesso:** API com chave ("Request an API Key").
- **URLs:** https://www.census.gov/programs-surveys/acs `[OK]` · https://www.census.gov/data/developers.html `[OK]` · https://api.census.gov/data.html `[OK]` · https://data.census.gov/ `[NV — 403]`

**BLS**
- **API pública v2:** `https://api.bls.gov/publicAPI/v2/timeseries/data/{série}`.
- **Exemplo:** CUUR0000SA0 (CPI-U, U.S. city average, all items, sem ajuste sazonal — decodificado do ID; a API não devolve o título). Ago/2026 = 334,980; out/2025 = `-`, "Data unavailable due to the 2025 lapse in appropriations".
- **URLs:** https://www.bls.gov/data/ `[NV — 403 Akamai]` · https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0 `[OK]`

**OpenStreetMap / Overpass / Geofabrik**
- **Conteúdo:** POIs, vias, uso do solo.
- **Licença:** ODbL (OSMF); cópia e adaptação livres creditando "OpenStreetMap e colaboradores", com derivados sob a mesma licença.
- **Overpass:** API read-only. Na instância principal (FOSSGIS), a página indica que menos de 10.000 consultas/dia e menos de 1 GB/dia não perturbam outros usuários.
- **Geofabrik:** `brazil-latest.osm.pbf` com 1,9 GB e dados até 2026-09-22T20:22:59Z.
- **URLs:** https://www.openstreetmap.org/copyright `[OK]` · https://wiki.openstreetmap.org/wiki/Overpass_API `[OK]` · https://overpass-turbo.eu/ `[OK]` · https://download.geofabrik.de/south-america/brazil.html `[OK]`

**Inside Airbnb**
- **Conteúdo:** arquivos listings, calendar e reviews por cidade.
- **Licença:** CC BY 4.0.
- **Cobertura no Brasil:** Rio de Janeiro disponível (24/06/2026); **São Paulo não aparece** na página de downloads em 23/09/2026.
- **URL:** https://insideairbnb.com/get-the-data/ `[OK]`

**Google BigQuery public datasets**
- **Acesso:** projeto `bigquery-public-data` (ex.: `bigquery-public-data.bbc_news.fulltext`). O Google paga o armazenamento; o primeiro 1 TB/mês de consulta não tem custo.
- **URL:** https://cloud.google.com/bigquery/public-data → docs.cloud.google.com `[OK]`

**AWS Open Data Registry**
- **Conteúdo:** catálogo de datasets hospedados na AWS, com tutoriais e o Open Data Sponsorship Program.
- **URL:** https://registry.opendata.aws/ `[OK]`

### A.4 Repositórios e buscadores (ML e pesquisa)

- **Google Dataset Search.** Buscador de metadados. Licença e versão se conferem no repositório de origem. https://datasetsearch.research.google.com/ `[OK]`
- **Kaggle Datasets.** A página cai em reCAPTCHA: `[NV]`. A CLI oficial foi verificada no GitHub: `Kaggle/kaggle-api` redireciona para `Kaggle/kaggle-cli` ("Official Kaggle CLI"), instalação com `pip install kaggle`. A licença é definida por dataset (conferir no card). https://www.kaggle.com/datasets `[NV]` · https://github.com/Kaggle/kaggle-cli `[OK]`
- **UCI ML Repository.** Licença por dataset. Exemplo: Iris, DOI 10.24432/C56C76, CC BY 4.0. https://archive.ics.uci.edu/ `[OK]` · https://archive.ics.uci.edu/dataset/53/iris `[OK]`
- **Hugging Face Datasets.** Filtros por licença, formato e tamanho. https://huggingface.co/datasets `[OK]`
- **OpenML.** API `https://www.openml.org/api/v1/json/data/{id}` (id 61 = iris, licence "Public", ARFF). https://www.openml.org/ `[OK]` · https://docs.openml.org/ `[OK]`
- **Zenodo** (CERN/OpenAIRE). DOI em cada upload; REST API e OAI-PMH. https://zenodo.org/ `[OK]`
- **Harvard Dataverse.** Site com desafio anti-bot (HTTP 202): `[NV]`. O API Guide do Dataverse foi verificado. https://dataverse.harvard.edu/ `[NV]` · https://guides.dataverse.org/en/latest/api/ `[OK]`
- **Papers with Code — datasets.** Descontinuado nesse endereço; redireciona para https://huggingface.co/papers/trending `[OK]`.
- **re3data.** Registro de repositórios de dados de pesquisa, com API. https://www.re3data.org/ `[OK]`
- **data.europa.eu.** Busca por API e SPARQL; tem "licensing assistant". https://data.europa.eu/en `[OK]`
- **Awesome Public Datasets.** Lista curada no GitHub. https://github.com/awesomedata/awesome-public-datasets `[OK]`
- **DataCite Commons.** https://commons.datacite.org/ `[NV — 429]`
- **Figshare.** https://figshare.com/ `[NV — 202]`
- **Mendeley Data.** https://data.mendeley.com/ `[NV — 403]`

---

## B. Metodologia

### B.1 Quadros de qualidade de estatística oficial ("fitness for use")

- **Código de Boas Práticas das Estatísticas Europeias.** Revisto em novembro/2017 pelo ESSC. Tem 16 princípios e 84 indicadores. Os princípios de produto estatístico são: 11 Relevância; 12 Exatidão e confiabilidade; 13 Tempestividade e pontualidade; 14 Coerência e comparabilidade; 15 Acessibilidade e clareza. Fontes: https://ec.europa.eu/eurostat/web/quality/european-quality-standards/european-statistics-code-of-practice `[OK]` · https://ec.europa.eu/eurostat/web/products-eurostat-news/w/edn-20251126-1 `[OK]`
- **ESS Quality Assurance Framework v2.0 (2019).** Coleção de métodos, ferramentas e boas práticas que acompanha o Código. https://ec.europa.eu/eurostat/web/quality/european-quality-standards/quality-assurance-framework `[OK]`
- **IMF DQAF.** Estrutura: 0 pré-requisitos de qualidade; 1 garantias de integridade; 2 solidez metodológica; 3 exatidão e confiabilidade (inclui 3.5, estudos de revisão); 4 "serviceability" (4.1 periodicidade e tempestividade; 4.2 consistência; 4.3 política e prática de revisão); 5 acessibilidade. Versões: julho/2001; julho/2003, genérica, guarda-chuva de sete frameworks específicos; maio/2012 (ex.: contas nacionais). Fontes: https://dsbb.imf.org/content/pdfs/dqrs_nag.pdf `[OK]` · https://unstats.un.org/unsd/ccsa/cdqio-2010/Ses1-DQAF-IMF.pdf `[OK]` · https://dsbb.imf.org/dqrs/DQAF `[PARCIAL — só navegação]`
- **OECD Quality Framework**, STD/QFS(2003)1, de 17/10/2003. Define qualidade como "fitness for use" em termos das necessidades do usuário. Sete dimensões: relevância, exatidão, credibilidade, tempestividade, acessibilidade, interpretabilidade e coerência. Custo-eficiência entra como fator, não como dimensão. Fontes: https://unstats.un.org/unsd/unsystem/Documents/QAF-OECD.pdf `[OK]` · https://unstats.un.org/unsd/ccsa/cdqio-2004/1-OECD.pdf `[OK]`. A versão 2011 (https://one.oecd.org/document/STD/QFS(2011)1/en/pdf) está `[NV — 403]`.
- **Princípios Fundamentais das Estatísticas Oficiais (ONU).** Dez princípios: relevância/imparcialidade/acesso igual; padrões profissionais e ética; accountability e transparência; prevenção de mau uso; fontes; confidencialidade; legislação; coordenação nacional; padrões internacionais; cooperação internacional. Adotados pela Conferência de Estatísticos Europeus em 1991, pela Comissão de Estatística da ONU em 1994 e pela Assembleia Geral (A/RES/68/261) em 29/01/2014. https://unstats.un.org/fpos/ `[OK]`
- **UN NQAF.** Manual de quadros nacionais de garantia de qualidade. https://unstats.un.org/unsd/methodology/dataquality/ `[OK]`

Como as dimensões viram perguntas sobre uma fonte externa:

| Dimensão (CoP / DQAF / OCDE) | Pergunta prática sobre a fonte externa | Evidência a registrar |
|---|---|---|
| Relevância (P11; DQAF 0.3; OCDE) | Mede o mesmo conceito, universo e unidade da métrica interna? | Tabela de correspondência de definições |
| Exatidão e confiabilidade (P12; DQAF 3) | Há erro amostral publicado (CV/IC), cobertura, imputação? | CV, nota metodológica, taxa de resposta |
| Revisões (DQAF 3.5 e 4.3) | O número muda depois? Qual safra estou usando? | Data/versão do arquivo; política de revisão |
| Tempestividade e pontualidade (P13; DQAF 4.1) | Qual a defasagem? Existe calendário? A série está ativa? | Data de referência × data de publicação |
| Coerência e comparabilidade (P14; DQAF 4.2) | Bate com outras fontes? Houve quebra no tempo ou mudança de geografia? | Log de triangulação; lista de quebras |
| Acessibilidade e clareza (P15; DQAF 5; OCDE: interpretabilidade) | Há acesso programático estável? Há dicionário e metadados? | Endpoint, dicionário, formato |
| Integridade e credibilidade (DQAF 1; OCDE) | Quem produz? É fonte primária ou intermediário? | Produtor, cadeia de derivação |
| Solidez metodológica (DQAF 2) | Conceitos e classificações seguem padrão (CNAE, CBO, OIT)? | Classificações usadas |
| Custo-eficiência (OCDE, fator) | Qual o custo de acesso (token, BigQuery, volume)? | Limites de API; custo estimado |

### B.2 Propósitos da comparação

1. **Benchmark.** Posicionar a métrica interna contra uma referência do mercado ou da população, comparando dinâmicas (Δ% a/a, M/M-12), não níveis. Exemplo: vendas de uma rede em SP contra a PMC-SP (8880, N3[35]). Armadilha: comparar nível interno com número-índice.
2. **Representatividade.** Verificar se a distribuição da base interna (sexo, idade, município) reproduz a população (Censo 2022, tabela 9514). Se não reproduz, pós-estratificar: peso $w_h = N_h / n_h$, normalizado. Quando só há marginais, usar raking (`survey::postStratify`, `survey::rake`: https://r-survey.r-forge.r-project.org/survey/html/postStratify.html `[OK]`, https://r-survey.r-forge.r-project.org/survey/html/rake.html `[OK]`). Armadilha: estrato vazio ou com poucos casos, que infla a variância.
3. **Enriquecimento (join).** As chaves são código IBGE de 7 dígitos, CNPJ de 14, CEP (via CNEFE, agregados por CEP) e data (calendário). Regra: anti-join nos dois sentidos, checagem de cardinalidade (1:1, 1:N) e taxa de match registrada. O CNPJ usa código TOM, não IBGE (A.2).
4. **Sanity check de ordem de grandeza.** Clientes num município acima da população? Faturamento municipal perto do PIB municipal (5938, em mil R$)? Razão fora de [0,5; 2] costuma indicar erro de unidade, escala ou escopo.
5. **Contexto.** Sazonalidade (PMC/PMS com ajuste sazonal, variáveis 7170/7168); macro (Focus via Olinda, Selic SGS 432/4390, IPCA); mudança regulatória ou de registro (eSocial em 2020, LGPD); choques (coleta telefônica da PNADC a partir do 2º tri/2020; shutdown dos EUA em out/2025); clima (INMET).

### B.3 Harmonização

#### B.3.1 Conceitos e definições

Antes de comparar números, compare definições: universo, unidade de observação, informante, variável e período de referência. A nota técnica do IBGE sobre CAGED × PNAD Contínua (2020) é o modelo do que documentar:

| | CAGED | PNAD Contínua |
|---|---|---|
| Unidade | vínculo celetista | pessoa |
| Natureza | registro administrativo | amostra probabilística de domicílios |
| Informante | estabelecimento | morador |
| Cobertura | exclui estatutários, autônomos e informais | todos os ocupados |
| Periodicidade e divulgação | mensal, até município | trimestral (mensal só para Brasil, em trimestre móvel) |

Outras diferenças de conceito que aparecem neste catálogo:

- FipeZap é preço de anúncio; o ITBI registra transação.
- PMC publica receita nominal e volume, que não são a mesma coisa.
- IPCA e INPC cobrem faixas de renda distintas.
- Censo é contagem; a Estimativa é um produto derivado.

#### B.3.2 Unidades e escala

Confira a unidade na resposta da API e registre-a: PIB municipal em "Mil Reais" (5938/v37); PNADC em "Mil pessoas" (4093/v1641); taxas em % e variações em pontos percentuais; número-índice com base declarada (2022=100, dez/1993=100).

Rebase: $I'_t = 100 \cdot I_t / \bar I_{\text{base}}$, em que $\bar I_{\text{base}}$ é a média dos meses do ano-base.

#### B.3.3 Moeda e deflação

- Valor real a preços do mês-base $b$: $V^{real}_t = V^{nom}_t \cdot I_b / I_t$, com $I$ = número-índice (IPCA: SIDRA 1737, variável 2266, base dez/1993=100).
- Com série de variações (SGS 433): $I_t = I_{t-1}(1 + v_t/100)$.
- Deflacione mês a mês e só depois agregue. Não deflacione a soma anual por índice médio quando existe dado mensal.
- A PNADC deflaciona rendimentos com índices regionais ponderados a partir do IPCA das RMs/capitais. Em 2015 o IBGE corrigiu o uso indevido de pesos do INPC; o impacto foi de 0,02% ou menos (nota de 09/04/2015, FTP `[OK]`).
- IPCA ou INPC: a escolha depende do público (INPC para renda mais baixa — faixa `[NV]`). Documente.
- EUA: CPIAUCSL (FRED, com ajuste sazonal) em ago/2026 = 334,131; CUUR0000SA0 (BLS, sem ajuste) = 334,980. Não misture as duas. Out/2025 não existe: registre a regra de imputação (ex.: média geométrica de set/2025 e nov/2025) como decisão analítica.
- Câmbio: PTAX (Olinda) ou SGS 1 (diário, venda) e 3692 (fim de período, anual). Defina a convenção (data da transação, média do mês ou fim de período). Deflacionar em US$ e converter, ou converter e deflacionar por IPCA, responde a perguntas diferentes.

```python
# Deflação pelo IPCA via API do IBGE (tabela 1737, variável 2266 = número-índice)
import requests, pandas as pd

r = requests.get(
    "https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-48/variaveis/2266",
    params={"localidades": "N1[all]"}, timeout=60)
serie = r.json()[0]["resultados"][0]["series"][0]["serie"]          # {"AAAAMM": "valor"}
ipca = pd.Series({pd.Period(f"{k[:4]}-{k[4:]}", "M"): v for k, v in serie.items()})
ipca = pd.to_numeric(ipca, errors="coerce")                           # trata "..." / "-"
base = ipca[pd.Period("2026-08", "M")]
# df: colunas 'mes' (Period[M]) e 'fat_nominal'
df["fat_real_ago2026"] = df["fat_nominal"] * base / df["mes"].map(ipca)
```

#### B.3.4 Alinhamento temporal

- **Competência × caixa.** A métrica interna tem de usar o mesmo relógio da fonte (data do fato ou emissão versus data do recebimento). Confira o conceito na nota metodológica da fonte.
- **Mês × trimestre.** A PNADC "mensal" é trimestre móvel. Para comparar, transforme a série interna em média móvel de 3 meses terminada em $t$. Os trimestres da PNADC são civis.
- **Fim de período × média.** No câmbio, SGS 3692 é fim de período; a média do mês é outra série.
- **Prazo e revisão.** O CAGED fecha declarações no dia 07; as fora do prazo atualizam a base por até 12 meses. As Estimativas 2025 têm três versões publicadas. Os arquivos de ITBI-SP de 2019–2021 foram corrigidos. Os microdados do Censo foram atualizados em 14/09/2026. Registre sempre a safra.
- **Calendário.** Controle dias úteis e datas comerciais antes de comparar variações mensais.

#### B.3.5 Geografia

- **Códigos.** IBGE usa 7 dígitos; a Receita/CNPJ usa TOM de 4 dígitos; o Tesouro usa SIAFI. Faça crosswalks explícitos: Receita `municipios.csv`, Tesouro "lista de municípios do SIAFI". São Paulo: TOM/SIAFI 7107 ↔ IBGE 3550308, conferido nos dois.
- **Teste obrigatório.** Anti-join entre a lista oficial (API Localidades) e o crosswalk. Em 23/09/2026 o resultado é `{5101837}` no crosswalk da Receita.

```python
import io, requests, pandas as pd
H = {"User-Agent": "Mozilla/5.0"}
ibge = pd.DataFrame(requests.get(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios", timeout=60).json())[["id", "nome"]]
rf = pd.read_csv(io.BytesIO(requests.get(
    "https://www.gov.br/receitafederal/dados/municipios.csv", headers=H, timeout=60).content),
    sep=";", encoding="cp1252", dtype=str)
faltam = set(ibge["id"].astype(str)) - set(rf["CÓDIGO DO MUNICÍPIO - IBGE"])
print(faltam)   # 23/09/2026: {'5101837'}  (Boa Esperança do Norte, MT)
```

- **Malha muda todo ano.** A Malha Municipal incorpora alterações e as comunicadas depois de 30/04 entram no ano seguinte. Faça o spatial join (estação INMET, POI do OSM, coordenada do CNEFE) com a malha do mesmo ano dos dados.
- **Compatibilização de áreas.** O próprio IBGE publica a variação sobre "2010 compatibilizada" (tabela 4709, variável 5936). Em séries longas com municípios criados ou desmembrados, agregue em áreas estáveis (conceito de áreas mínimas comparáveis; referência específica `[NV]` nesta sessão).
- **CEP** não é unidade estatística estável. Use a ponte do CNEFE (agregados por CEP) e registre a taxa de endereços não geocodificados.

#### B.3.6 Quebras metodológicas conferidas

| Série | Quebra | Tratamento |
|---|---|---|
| PNAD/PME → PNAD Contínua | Implantação desde 2012, com as pesquisas em paralelo; população do tema trabalho passa de 10+ para 14+; semana de referência diferente (PNAD: última semana completa de setembro) | Não encadear níveis; usar PNADC a partir de 2012; comparar só conceitos equivalentes |
| CAGED → Novo CAGED | Jan/2020: eSocial para parte das empresas, com imputação | Marcar quebra; não comparar saldo de 2019 com 2020 sem nota |
| PMC/PMS | Tabelas 2014=100 encerradas em dez/2022; atuais 2022=100 | Usar as tabelas novas; rebasear o interno |
| IPCA | Pesos da POF 2017–2018 (NT 02/2019 e 01/2020) | Afeta comparações por subitem |
| PNADC | Coleta por telefone desde o 2º tri/2020 e restrição temporária de desagregações (NT 02/2021) | Mais cautela com recortes finos em 2020–2021 |
| CPI EUA | Out/2025 indisponível (lapse in appropriations) | Imputação documentada |
| INEP | Microdados reestruturados para a LGPD (variáveis suprimidas) | Rever scripts antigos |
| CVM | Colunas novas (log na home) | Validar esquema a cada carga |
| Receita (CNPJ) | Repositório trocado; caminho antigo em 404 | Registrar URL e safra |

### B.4 Triangulação

**Conceito.** Denzin (*The Research Act*, 1970; 2ª ed. 1978) distingue quatro tipos: de dados, de investigador, de teoria e metodológica (Carter et al., 2014, Oncology Nursing Forum 41(5):545–547, doi:10.1188/14.ONF.545-547 `[OK — metadados via Europe PMC/Crossref]`). A triangulação de dados se desdobra em tempo, espaço e pessoa; a metodológica, em within-method e between-method (CASRAI, https://casrai.org/guides/triangulation-in-research `[OK]`). Para quali × quanti, ver Jick (1979), Administrative Science Quarterly 24(4):602, doi:10.2307/2392366 `[OK — Crossref]`, e Fusch, Fusch & Ness (2018), doi:10.5590/josc.2018.10.1.02 `[OK — Crossref; PDF 403]`.

**Em analytics:**
- **Dados:** a mesma grandeza em fontes independentes (registro administrativo × pesquisa amostral × dado interno).
- **Método:** a mesma pergunta por caminhos diferentes (nível × variação; top-down × bottom-up).
- **Investigador:** revisão por par, cego ao resultado esperado.
- **Teoria:** hipóteses rivais para explicar a divergência.

Exemplo reproduzido nesta sessão: o IPCA de jul/2026 dá 0,07% por três caminhos — API v3 (1737/v63), apisidra e SGS 433. Um contraexemplo esperado é emprego formal CAGED × PNADC, que diverge por conceito (B.3.1). Aí a triangulação serve para explicar a diferença, não para fazer os números baterem.

**Tolerância, definida antes de olhar o resultado:**
1. **Estimativa amostral.** IC 95% ≈ $\hat\theta \pm 1{,}96 \cdot CV \cdot \hat\theta$, usando o CV publicado (ex.: variável 4103 na 6381/6468). Duas fontes independentes: $z = (a-b)/\sqrt{se_a^2 + se_b^2}$, e $|z| > 2$ sinaliza divergência.
2. **Registro administrativo já harmonizado.** Regra de negócio explícita, por exemplo |diferença relativa| ≤ 5% em totais, ≤ 1 p.p. em taxas e sinal da variação igual em ≥ 80% dos meses. É regra prática, não norma: ajuste ao caso e registre.
3. **Ordem de grandeza.** Razão em [0,5; 2] é plausível; fora disso, investigue unidade e escopo antes de qualquer outra coisa.

**Documentação das divergências** (log com uma linha por comparação): métrica · recorte · período · valor interno · valor externo · diferença absoluta e relativa · tolerância · dentro/fora · classe da causa (conceito, cobertura, tempo, geografia, unidade/escala, deflação/moeda, safra/revisão, erro interno, erro externo, desconhecida) · evidência (nota técnica, dicionário, ponte numérica) · ação · responsável.

"Explicada" exige evidência documental ou uma reconciliação numérica que feche a diferença. "Não explicada" fica aberta, com hipótese e próximo teste. Nunca ajuste até bater.

### B.5 Aspectos legais e licenças (Brasil)

- **LAI (Lei 12.527/2011).**
  - Art. 3º: publicidade como preceito geral, sigilo como exceção.
  - Art. 8º §3º: os sítios devem permitir "acesso automatizado por sistemas externos em formatos abertos, estruturados e legíveis por máquina", divulgar os formatos usados e garantir autenticidade e integridade. É o fundamento para cobrar API ou arquivo em lote de órgão público.
  - Art. 31: informações pessoais relativas a intimidade, vida privada, honra e imagem têm acesso restrito por até 100 anos, salvo previsão legal ou consentimento.
  - https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm `[OK]`
- **Decreto 8.777/2016 (Política de Dados Abertos do Executivo federal: administração direta, autárquica e fundacional).**
  - Art. 2º III define dados abertos: disponibilizados "sob licença aberta que permita sua livre utilização, consumo ou cruzamento, limitando-se a creditar a autoria ou a fonte".
  - Art. 3º III exige descrição das bases com informação suficiente sobre ressalvas de qualidade e integridade.
  - Art. 4º (redação do Decreto 9.903/2019): livre utilização pelos Poderes Públicos e pela sociedade; o §2º obriga indicar o detentor de direitos autorais de terceiros.
  - Não alcança municípios, estados nem o Judiciário: Prefeitura de SP, SEADE e TSE seguem regras próprias.
  - https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/decreto/d8777.htm `[OK]`
- **Licenças encontradas no catálogo:**

| Licença | Obrigação principal | Onde apareceu |
|---|---|---|
| CC0 | nenhuma (domínio público) | parte da Prefeitura de SP |
| CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/deed.pt-br `[OK]`) | atribuição e indicação de alterações | Banco Mundial, UCI, Inside Airbnb, OWID (conteúdo próprio), Eurostat (editorial), parte da Prefeitura de SP |
| ODbL 1.0 (https://opendatacommons.org/licenses/odbl/1-0/ `[OK]`) | atribuição; cláusula 4.4: banco derivado usado publicamente deve ser licenciado sob ODbL ou compatível | OSM, BCB, CVM, ANEEL |
| CC Não-Comercial | veda uso comercial — **WARNING** para trabalho de consultoria | parte da Prefeitura de SP, 3 conjuntos da SEADE |
| Sem licença declarada | sem base presumida; buscar fundamento legal (LAI, decreto) ou autorização | 81 de 84 conjuntos da SEADE; Ipeadata, INMET, FipeZap (não localizada) |
| Termos da fonte original | intermediário não re-licencia | Base dos Dados; dados de terceiros no OWID |

- **LGPD (Lei 13.709/2018) e dado público com dado pessoal:**
  - Art. 7º §3º: o tratamento de dados "cujo acesso é público deve considerar a finalidade, a boa-fé e o interesse público que justificaram sua disponibilização".
  - Art. 7º §4º: dispensa de consentimento para dados "tornados manifestamente públicos pelo titular", resguardados direitos e princípios.
  - Art. 7º §6º: a dispensa não desobriga das demais obrigações.
  - Art. 7º §7º: o tratamento posterior para novas finalidades exige "propósitos legítimos e específicos" e preservação dos direitos do titular.
  - Art. 6º: princípios de finalidade, adequação, necessidade, qualidade dos dados etc.
  - Art. 4º II "b": no fim acadêmico, aplicam-se os arts. 7º e 11.
  - Art. 7º IV com art. 5º XVIII: estudos por órgão de pesquisa, com anonimização sempre que possível. Órgão de pesquisa é entidade pública ou privada sem fins lucrativos com pesquisa na missão; empresa não se enquadra.
  - Art. 12: dado anonimizado não é dado pessoal, salvo se reversível "com esforços razoáveis".
  - Art. 13: estudos em saúde pública.
  - https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm `[OK]`
- **ANPD — Guia orientativo "Tratamento de dados pessoais pelo Poder Público", v2.0 (jun/2023).** Reitera o §3º (finalidade, boa-fé, interesse público) e o §7º para dados publicamente disponíveis. https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-poder-publico-anpd-versao-final.pdf/@@download/file `[OK]`
- **Na prática:** sócios PF no CNPJ, servidores no Portal da Transparência e candidatos no TSE são dados pessoais publicamente acessíveis. Traga só as colunas necessárias (minimização), pseudonimize identificadores, publique agregados e registre a base legal e a finalidade no template (C). O INEP já suprimiu variáveis por risco de reidentificação: trate isso como sinal de que cruzamentos finos podem reidentificar.

### B.6 Proveniência

**O que registrar** (ver template C):
- URL canônica e URL exata do recurso, com parâmetros;
- produtor e distribuidor;
- data e hora do acesso;
- safra, versão ou data de referência e data de modificação;
- nome, tamanho e **SHA-256** de cada arquivo;
- encoding, separador, número de linhas;
- licença (com URL) e base legal;
- consulta ou filtros (SQL, parâmetros da API);
- script e commit;
- ambiente (pacotes e versões);
- transformações de harmonização;
- checagens feitas (número reproduzido);
- decisão de aptidão e data de revalidação.

**W3C PROV.** PROV-Overview (Working Group Note de 30/04/2013) define proveniência como "information about entities, activities, and people involved in producing a piece of data or thing". O PROV-Primer (WG Note, 30/04/2013) define Entity, Activity e Agent e as relações `wasGeneratedBy`, `wasDerivedFrom`, `wasAttributedTo` e `wasAssociatedWith`. Fontes: https://www.w3.org/TR/prov-overview/ `[OK via WebFetch; curl 403]` · https://www.w3.org/TR/prov-primer/ `[OK via WebFetch]`.

Mapeamento mínimo:
- o arquivo baixado é `Entity`, com `wasAttributedTo` apontando para o órgão (`Agent`);
- download e harmonização são `Activity` (`used` o arquivo; `wasAssociatedWith` o analista ou script);
- a tabela harmonizada `wasGeneratedBy` a harmonização e `wasDerivedFrom` o arquivo original.

**Documentação complementar:** Datasheets for Datasets (Gebru et al.; CACM, dez/2021), https://arxiv.org/abs/1803.09010 `[OK]`; princípios FAIR (Wilkinson et al., 2016), https://www.nature.com/articles/sdata201618 `[OK]` · https://www.gofair.foundation/fair-principles `[OK]`.

```python
import hashlib, json, datetime, pathlib, platform

def sha256(path, bs=1 << 20):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(bs), b""):
            h.update(chunk)
    return h.hexdigest()

def registrar(path, url, licenca, safra, consulta, out="proveniencia.jsonl"):
    p = pathlib.Path(path)
    rec = {"arquivo": p.name, "bytes": p.stat().st_size, "sha256": sha256(p),
           "url": url, "licenca": licenca, "safra": safra, "consulta": consulta,
           "acessado_em": datetime.datetime.now().astimezone().isoformat(),
           "python": platform.python_version()}
    with open(out, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    return rec
```

Hashes registrados nesta pesquisa (23/09/2026):
- `Municipios.zip` do CNPJ, safra 2026-09: `7b8e27610d4f341aed300560b7e06664319bc9248e7ec115c10a40df8e24db68`
- `municipios.csv` da Receita: `60da8e582c1021c4be21cc9b45c4bf791f98f75a40df242b4b2ff4a4121da89b`
- `tabmun.csv` do Tesouro/SIAFI: `3651c930ca1ddfde0bb7b47130795f332330d4c66b3db70f49f3ca3494e4242d`
- `fipezap-serieshistoricas.xlsx`: `06190141ea86023d471d2c7c3634a6c7855c03498856a621fffac3e918a0ce41`

### B.7 Risco de IA: LLMs inventam fonte, URL, código e número

**Evidência:**
- Walters & Wilder (2023, Scientific Reports) analisaram 636 referências em 84 textos sobre 42 temas. Referências fabricadas: 55% no GPT-3.5 e 18% no GPT-4. Entre as referências reais, erros substantivos em 43% e 24%, respectivamente. https://www.nature.com/articles/s41598-023-41032-5 `[OK]`
- *We Have a Package for You!* (arXiv 2406.10279) gerou 576.000 amostras de código com 16 LLMs. A taxa média de pacotes inexistentes foi de pelo menos 5,2% nos modelos comerciais e 21,7% nos abertos, com 205.474 nomes únicos alucinados. https://arxiv.org/abs/2406.10279 `[OK]`

**Modos de falha que apareceram nesta própria verificação:**
- o sumarizador de páginas preencheu com "informação típica" a página do Kaggle que não carregou;
- URLs que mudaram: Receita/CNPJ (404), PDET (migrou para gov.br), OpenDataSUS (novo domínio), `cloud.google.com` → `docs.cloud.google.com`, repositório `kaggle-api` → `kaggle-cli`, Papers with Code (extinto), raiz do UNdata (rebatizada);
- códigos de tabela desativados: PMC/PMS 2014=100;
- anti-bot que faz fonte legítima parecer inexistente: IBGE, TSE, BLS, IMF.

**Protocolo de verificação (nada do LLM entra sem passar por ele):**
1. **Abrir.** Toda URL sugerida é aberta; confirme domínio e produtor. Bloqueio anti-bot não prova inexistência: procure via API ou FTP oficial.
2. **Localizar o identificador na fonte.** Código de tabela ou série e nome de variável conferidos nos metadados (`/metadados` do IBGE; nome da série no CKAN do BCB), nunca aceitos da resposta do modelo.
3. **Baixar e registrar hash** (B.6).
4. **Ler dicionário e nota metodológica.** Confira unidade, base, universo e quebras.
5. **Reproduzir um número publicado.** Exemplo: IPCA jul/2026 = 0,07% na SIDRA e na SGS 433. Sem reprodução, a fonte não entra.
6. **Conferir a licença na página da fonte.** Não presuma "é público, então é livre".
7. **Pacotes e bibliotecas sugeridos:** existem no PyPI/CRAN, com mantenedor oficial (ex.: `Rilostat` mantido pela OIT; `kaggle` pelo repositório oficial)? Nunca instale um nome só porque o modelo citou.
8. **Registrar** no template, incluindo o que foi descartado e por quê.

---

## Fechamento

### (a) Tabela-resumo do catálogo

| Nome | Escopo | Acesso | URL | Status |
|---|---|---|---|---|
| IBGE SIDRA | Todas as pesquisas agregadas do IBGE | Portal | https://sidra.ibge.gov.br/ | PARCIAL (403) |
| IBGE API de agregados v3 | Idem, programático | API REST | https://servicodados.ibge.gov.br/api/docs/agregados?versao=3 | OK |
| IBGE apisidra (legada) | Idem | API REST | https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%203 | OK |
| IBGE Serviço de Dados (Localidades, Malhas etc.) | Territórios, malhas, CNAE, nomes | API REST | https://servicodados.ibge.gov.br/api/docs | OK |
| Censo 2022 (portal) | População e domicílios, até setor | Portal | https://censo2022.ibge.gov.br/ | PARCIAL (403) |
| Censo 2022 (FTP) | Agregados por setor, microdados | Download em lote | https://ftp.ibge.gov.br/Censos/Censo_Demografico_2022/ | OK |
| CNEFE 2022 | Endereços, CEP, coordenadas | Download em lote | https://ftp.ibge.gov.br/Cadastro_Nacional_de_Enderecos_para_Fins_Estatisticos/Censo_Demografico_2022/ | PARCIAL (listagem) |
| PNAD Contínua | Trabalho e rendimento; BR/UF/capitais/RM | SIDRA/API/FTP | https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/ | OK (página 403) |
| PMC | Varejo, mensal, UF | SIDRA/API | https://www.ibge.gov.br/estatisticas/economicas/comercio/9227-pesquisa-mensal-de-comercio.html | PARCIAL |
| PMS | Serviços, mensal, UF | SIDRA/API | https://www.ibge.gov.br/estatisticas/economicas/servicos/9229-pesquisa-mensal-de-servicos.html | PARCIAL |
| IPCA/INPC | Preços ao consumidor | SIDRA/API | https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html | OK |
| Estimativas de População | População municipal anual | SIDRA/FTP | https://ftp.ibge.gov.br/Estimativas_de_Populacao/ | OK |
| Malha Municipal | Limites municipais anuais | Download/API | https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html | OK |
| Códigos de municípios | Código IBGE de 7 dígitos | Portal/API | https://www.ibge.gov.br/explica/codigos-dos-municipios.php | OK |
| dados.gov.br | Catálogo federal | Portal/API (chave) | https://dados.gov.br/ | OK |
| Base dos Dados | Datalake tratado BR | BigQuery/download | https://basedosdados.org/ | OK |
| Ipeadata | Séries macro/regionais/sociais | Portal/OData | http://www.ipeadata.gov.br/Default.aspx | OK |
| BCB SGS | Séries temporais | Portal/API | https://www3.bcb.gov.br/sgspub/ | OK |
| BCB Dados Abertos | 4.261 conjuntos (ODbL) | CKAN/API | https://dadosabertos.bcb.gov.br/ | OK |
| BCB Olinda (Focus) | Expectativas de mercado | OData | https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ | OK |
| DATASUS TabNet | Saúde (tabulação) | Portal | https://datasus.saude.gov.br/informacoes-de-saude-tabnet/ | OK |
| OpenDataSUS / Dados Abertos SUS | Saúde (arquivos) | Portal/API | https://dadosabertos.saude.gov.br | OK |
| INEP microdados | Educação (ENEM, Censo Escolar) | Download | https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados | OK |
| Portal da Transparência | Gasto federal, servidores | Portal/download/API (token) | https://portaldatransparencia.gov.br/ | OK |
| TSE Dados Abertos | Eleições | Portal (CKAN?) | https://dadosabertos.tse.jus.br/ | NV |
| MTE PDET (CAGED/RAIS) | Emprego formal | Painel/FTP | https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho | OK |
| Receita CNPJ | Cadastro PJ mensal | Download (Nextcloud) | https://arquivos.receitafederal.gov.br/index.php/s/gn672Ad4CF8N6TK | OK |
| Receita crosswalk TOM↔IBGE | Códigos de município | CSV | https://www.gov.br/receitafederal/dados/municipios.csv | OK |
| Tesouro lista SIAFI | Códigos SIAFI↔IBGE | CKAN/CSV | https://www.tesourotransparente.gov.br/ckan/dataset/lista-de-municipios-do-siafi | OK |
| INMET | Clima por estação | Download anual | https://portal.inmet.gov.br/dadoshistoricos | OK |
| ANP | Combustíveis, preços | Download | https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos | OK |
| ANEEL | Energia (ODbL) | CKAN | https://dadosabertos.aneel.gov.br/ | OK |
| ANS | Saúde suplementar | Diretório de arquivos | https://dadosabertos.ans.gov.br/ | OK |
| CVM | Mercado de capitais (ODbL) | CKAN | https://dados.cvm.gov.br/ | OK |
| SUSEP SES | Seguros | Portal/download | https://www2.susep.gov.br/menuestatistica/SES/principal.aspx | OK |
| SEADE | Estado de SP | Portal/CKAN | https://repositorio.seade.gov.br/ | OK |
| SEADE IMP | Municípios paulistas | Portal | https://imp.seade.gov.br/ | NV |
| Prefeitura de SP — Dados Abertos | Município de SP | CKAN | https://dados.prefeitura.sp.gov.br/ | OK |
| GeoSampa | Geo, município de SP | Portal/mapa | https://geosampa.prefeitura.sp.gov.br/ | OK |
| ObservaSampa | Indicadores de SP | Portal | https://observasampa.prefeitura.sp.gov.br/ | OK |
| ITBI-SP (SF) | Transações imobiliárias | xlsx/ods | https://prefeitura.sp.gov.br/web/fazenda/w/acesso_a_informacao/31501 | OK |
| Brasil.IO | Dados públicos tratados | Portal/API (token) | https://brasil.io/ | OK |
| FipeZap | Preço de anúncio de imóvel | XLSX | https://www.fipe.org.br/pt-br/indices/fipezap/ | OK |
| World Bank | Indicadores por país | Portal/API | https://data.worldbank.org/ | OK |
| IMF Data | Macro e finanças por país | Portal/SDMX | https://data.imf.org/ | PARCIAL |
| OECD Data Explorer | Indicadores OCDE | Portal/SDMX | https://data-explorer.oecd.org/ | OK |
| UNdata | Estatísticas da ONU | Portal/SDMX | https://data.un.org/ | OK |
| UN SDG Database | ODS | Portal/API | https://unstats.un.org/sdgs/dataportal | OK |
| WHO GHO | Saúde por país | Portal/OData | https://www.who.int/data/gho | OK |
| Our World in Data | Indicadores globais (CC BY) | Portal/CSV | https://ourworldindata.org/ | OK |
| FRED | Séries econômicas | Portal/API (chave) | https://fred.stlouisfed.org/ | OK (WebFetch) |
| Eurostat | UE/NUTS | Portal/API/bulk | https://ec.europa.eu/eurostat/data/database | OK |
| ILOSTAT | Trabalho por país | Portal/R | https://ilostat.ilo.org/data/ | NV (R: OK) |
| FAOSTAT | Agro/alimentos | Portal | https://www.fao.org/faostat/en/#data | PARCIAL |
| data.gov | Catálogo EUA | Portal | https://data.gov/ | OK |
| US Census ACS | Pesquisa domiciliar EUA | Portal/API (chave) | https://www.census.gov/programs-surveys/acs | OK |
| BLS | Preços e emprego EUA | API | https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0 | OK (site NV) |
| OpenStreetMap | Geo colaborativo (ODbL) | Download/API | https://www.openstreetmap.org/copyright | OK |
| Overpass API | Consulta OSM | API | https://wiki.openstreetmap.org/wiki/Overpass_API | OK |
| Geofabrik | Extratos OSM | Download | https://download.geofabrik.de/south-america/brazil.html | OK |
| Inside Airbnb | Hospedagem (CC BY) | Download | https://insideairbnb.com/get-the-data/ | OK |
| BigQuery public datasets | Datasets públicos | BigQuery | https://cloud.google.com/bigquery/public-data | OK |
| AWS Open Data | Datasets em S3 | Download/S3 | https://registry.opendata.aws/ | OK |
| Google Dataset Search | Buscador | Portal | https://datasetsearch.research.google.com/ | OK |
| Kaggle Datasets | Datasets de comunidade | Portal/CLI | https://www.kaggle.com/datasets | NV (CLI: OK) |
| UCI ML Repository | Datasets de ML | Portal | https://archive.ics.uci.edu/ | OK |
| Hugging Face Datasets | Datasets de ML | Portal/API | https://huggingface.co/datasets | OK |
| OpenML | Datasets e tarefas de ML | Portal/API | https://www.openml.org/ | OK |
| Zenodo | Repositório com DOI | Portal/API | https://zenodo.org/ | OK |
| Harvard Dataverse | Repositório de pesquisa | Portal/API | https://dataverse.harvard.edu/ | NV |
| Papers with Code (datasets) | Descontinuado | Redirect | https://paperswithcode.com/datasets | OK (extinto) |
| re3data | Registro de repositórios | Portal/API | https://www.re3data.org/ | OK |
| data.europa.eu | Portal europeu | Portal/API | https://data.europa.eu/en | OK |
| Awesome Public Datasets | Lista curada | GitHub | https://github.com/awesomedata/awesome-public-datasets | OK |
| DataCite Commons | DOIs de dados | Portal | https://commons.datacite.org/ | NV |
| Figshare | Repositório | Portal | https://figshare.com/ | NV |
| Mendeley Data | Repositório | Portal | https://data.mendeley.com/ | NV |

### (b) Checklist de aptidão ao uso (15 perguntas)

1. **Conceito:** a fonte mede o mesmo universo, unidade e variável da métrica interna? A diferença residual está escrita?
2. **Granularidade:** geografia e tempo cobrem o recorte sem extrapolação (ex.: PNADC mensal só existe para o Brasil)?
3. **Exatidão:** há erro amostral publicado (CV/IC) ou indicação de cobertura, sub-registro e imputação?
4. **Reprodução:** consegui reproduzir ao menos um número publicado a partir do arquivo ou da API?
5. **Revisão:** qual safra ou versão estou usando? O dado é preliminar? Existe política de revisão?
6. **Tempestividade:** a defasagem entre referência e publicação serve à decisão?
7. **Continuidade:** a série está ativa (não "encerrada") e tem calendário de divulgação?
8. **Coerência:** bate com outra fonte do mesmo fenômeno dentro da tolerância definida antes (triangulação)?
9. **Quebras:** houve mudança de metodologia, base, cobertura ou classificação no período analisado?
10. **Geografia:** códigos e malha são do mesmo ano, e o anti-join do crosswalk voltou vazio?
11. **Acesso:** a extração é programática, estável e reproduzível sem passo manual?
12. **Clareza:** existem dicionário de dados e nota metodológica versionados?
13. **Credibilidade:** o produtor está identificado? É fonte primária, ou o intermediário documenta a derivação?
14. **Licença:** o uso pretendido (comercial, consultoria, redistribuição de derivado) é permitido (atenção a NC e ao share-alike da ODbL)?
15. **LGPD:** há dado pessoal? A finalidade é compatível (art. 7º §§3º e 7º)? Dá para minimizar ou anonimizar?

Decisão: 15/15 = apta; falha em 1, 4, 10, 14 ou 15 = inapta até resolver; demais falhas = apta com ressalva escrita.

### (c) Template de registro de fonte externa

```markdown
# Registro de fonte externa — <ID-curto> (<AAAA-MM-DD>)

## 1. Identificação
- Conjunto / tabela / série:
- Produtor (órgão) | Distribuidor/intermediário (se houver):
- URL canônica (página do produto):
- URL exata do recurso (arquivo ou endpoint + parâmetros):
- Tipo de acesso: portal | API | BigQuery | download em lote | FTP

## 2. Versão e tempo
- Acesso em (data/hora, America/Sao_Paulo):
- Safra / edição / data de referência:
- Publicação / última modificação na fonte:
- Política de revisão conhecida / dado preliminar? (s/n):

## 3. Integridade
- Arquivo(s) e tamanho (bytes):
- SHA-256:
- Linhas × colunas lidas | encoding | separador | formato:

## 4. Licença e base legal
- Licença declarada + URL:
- Obrigações (atribuição, NC, share-alike):
- Dado pessoal? (s/n; quais campos) | base legal LGPD | medidas (minimização, pseudonimização, agregação):

## 5. Conteúdo
- Universo | unidade | variáveis usadas (com códigos):
- Dicionário / nota metodológica (URL):
- Granularidade geográfica (tipo de código) e temporal:
- Quebras de série conhecidas:

## 6. Extração reproduzível
- Consulta / filtros (SQL, parâmetros):
- Script + commit:
- Ambiente (linguagem, pacotes e versões):

## 7. Verificação anti-alucinação
- [ ] URL aberta e produtor confirmado
- [ ] Identificadores (tabela/série/variável) conferidos nos metadados da fonte
- [ ] Arquivo baixado e hash registrado
- [ ] Dicionário e nota metodológica lidos
- [ ] Número publicado reproduzido: <qual, onde, valor obtido>

## 8. Harmonização aplicada
- Conceito:
- Unidade / escala / base:
- Moeda e deflator (índice, base, convenção de câmbio):
- Tempo (competência/caixa, média móvel, fim de período):
- Geografia (crosswalk + resultado do anti-join):
- Tratamento de quebras e lacunas:

## 9. Aptidão ao uso
- Propósito: benchmark | representatividade | enriquecimento | sanity check | contexto
- Checklist (b): __/15 | ressalvas:
- Decisão: apta | apta com ressalvas | inapta — responsável — data
- Revalidar em:

## 10. Proveniência (W3C PROV, opcional)
- entity <arquivo> wasAttributedTo agent <órgão>
- activity <download/harmonização> used <arquivo>; wasAssociatedWith <analista/script>
- entity <tabela harmonizada> wasGeneratedBy <harmonização>; wasDerivedFrom <arquivo>
```

Exemplo preenchido, resumido:

```markdown
# Registro de fonte externa — RFB-CNPJ-MUN-202609 (2026-09-23)
- Conjunto: tabela de domínio "Municípios" do CNPJ (dados abertos) | Produtor: Receita Federal | Distribuidor: repositório SERPRO+
- URL canônica: https://arquivos.receitafederal.gov.br/index.php/s/gn672Ad4CF8N6TK  (pasta Dados/Cadastros/CNPJ/2026-09/)
- Recurso: Municipios.zip | Safra: 2026-09 (pasta modificada em 14/09/2026)
- SHA-256: 7b8e27610d4f341aed300560b7e06664319bc9248e7ec115c10a40df8e24db68
- Conteúdo: 1 CSV (F.K03200$Z.D60912.MUNICCSV), 5.572 linhas, latin-1, ";" com aspas; código TOM de 4 dígitos
- Licença: Decreto 8.777/2016 (livre utilização, creditando a fonte) | Dado pessoal: não
- Harmonização: TOM→IBGE via https://www.gov.br/receitafederal/dados/municipios.csv (SHA-256 60da8e58…da89b)
- Verificação: "7107";"SAO PAULO" ↔ 3550308 conferido; anti-join contra a API Localidades = {5101837} → tratar manualmente (Boa Esperança do Norte/MT; TOM 1182)
- Decisão: apta com ressalva (crosswalk incompleto) | Revalidar a cada nova safra mensal
```

### (d) Oito pares "dado interno × fonte externa"

1. **Faturamento mensal de varejo em SP × PMC-SP** (SIDRA 8880, N3[35]; classificação 11046: 56733 receita nominal, 56734 volume; 2022=100). Propósito: benchmark de dinâmica.
   - **Escopo:** mapear o segmento para varejo ou ampliado (8881) ou atividade (8882/8883; conferir níveis).
   - **Nominal × real:** compare receita nominal interna com o índice de receita nominal, ou deflacione a interna e compare com volume. O deflator da PMC não é necessariamente o IPCA cheio (conferir na metodologia).
   - **Base e forma:** rebaseie a série interna para média de 2022 = 100 e compare variações M/M-12 (variável 11709) e 12 meses (11711). Use a variável 7170 (com ajuste sazonal) só contra série interna também dessazonalizada.
   - **Tempo:** alinhe competência e controle calendário (dias úteis, Black Friday).
   - **Base interna:** mesmas lojas (like-for-like).
   - **Tolerância:** em p.p.
2. **Salários de admissão e rotatividade × Novo CAGED (microdados PDET) e RAIS.** Propósito: benchmark e sanity check.
   - **Universo:** só celetistas (CAGED exclui estatutários e informais).
   - **Classificações:** CBO (ocupação) e CNAE (setor) nos mesmos níveis.
   - **Salário:** contratual, não remuneração total; controle horas contratuais.
   - **Tempo:** competência da movimentação; declarações fora do prazo revisam até 12 meses; quebra em jan/2020.
   - **Geografia:** confira no dicionário o formato do código de município.
   - **Deflação:** INPC (1736) ou IPCA (1737), com a escolha documentada.
3. **Preços praticados (cesta própria) × IPCA por subitem** (SIDRA 7060: variáveis 63 e 2265, peso 66; N7, que inclui a RM de São Paulo na abrangência do IPCA). Propósito: benchmark de inflação própria.
   - **Mapeamento:** SKU → subitem IPCA.
   - **Pesos:** POF 2017–2018 × mix próprio; compare também com os pesos do IBGE.
   - **Tempo:** coleta do IPCA do dia 01 ao 30; preço de tabela × efetivo (promoções).
   - **Índice interno:** Laspeyres com pesos fixos, na mesma base.
4. **Clientes ativos por município × Censo 2022 e Estimativas** (4714, 9514, 6579). Propósito: penetração e representatividade.
   - **Geocodificação:** endereço → código IBGE (CEP via CNEFE; registrar a taxa de não geocodificados).
   - **Denominador:** público-alvo por idade (9514); Censo × Estimativa com escolha explícita (SP: 11.451.999 × 11.904.961).
   - **Geografia:** malha do mesmo ano; incluir 5101837.
   - **Ponderação:** pós-estratificação por sexo e idade quando a base interna for usada para inferência.
5. **Inadimplência da carteira PF × BCB SGS 21084** (PF total), 21112 (PF livres), 21145 (PF direcionados); SCR.data para recortes (granularidade: conferir). Propósito: benchmark de risco.
   - **Definição:** critério de dias de atraso e base (saldo × contratos) conferidos nos metadados SGS antes de comparar.
   - **Modalidade:** livres × direcionados.
   - **Tempo:** data-base de fim de mês.
   - **Carteira:** baixas e renegociações; efeito de mix.
   - **Forma:** compare tendência e diferença em p.p., não nível bruto.
6. **Cadastro de clientes e fornecedores PJ × CNPJ Receita** (Estabelecimentos + Simples, safra AAAA-MM). Propósito: enriquecimento e validação cadastral.
   - **Chave:** CNPJ de 14 dígitos normalizado (zeros à esquerda, sem máscara); agrupamento por CNPJ básico (confirmar a estrutura no layout).
   - **Status:** situação cadastral e data do snapshot.
   - **Geografia:** município TOM → IBGE via `municipios.csv`, com anti-join (5101837 ausente; 9707 = exterior).
   - **Atividade:** CNAE principal × secundária.
   - **LGPD:** sócios PF são dado pessoal; minimizar.
7. **Preço/m² de imóveis em SP × FipeZap e ITBI-SP.** Propósito: benchmark de preço.
   - **Referência de mercado:** FipeZap, venda residencial em São Paulo, ago/2026: R$ 12.143/m², +3,63% em 12 meses.
   - **Conceito:** anúncio (FipeZap) × transação (ITBI); tipologia (FipeZap = apartamentos prontos); definição de área (conferir nas notas).
   - **Composição:** mix de bairros (reponderar).
   - **Versão:** ITBI de 2019–2021 corrigido.
   - **Deflação:** real em 12 meses ≈ 1,0363/1,0422 − 1 ≈ −0,6% (IPCA 12 meses em ago/2026 = 4,22%).
8. **Receita de subsidiária nos EUA (US$) × CPI-U + câmbio.** Propósito: comparação real entre países.
   - **Ajuste sazonal:** CPIAUCSL (FRED, com ajuste; ago/2026 = 334,131) × CUUR0000SA0 (BLS, sem ajuste; 334,980). Escolher um e não misturar.
   - **Lacuna:** imputar out/2025 e registrar a regra.
   - **Câmbio:** PTAX (Olinda) ou SGS 1, com convenção de data (transação, média do mês ou fim de período; 3692 para fim de período anual).
   - **Ordem das operações:** "deflacionar em US$ e converter" e "converter e deflacionar por IPCA" respondem a perguntas diferentes; declare qual.

### (e) Protocolo: busca → avaliação → registro → harmonização → comparação

1. **Formular.** Escreva a pergunta de comparação, o propósito (benchmark, representatividade, enriquecimento, sanity check ou contexto) e a definição operacional da métrica interna (universo, unidade, período, geografia).
2. **Buscar de dentro para fora.** Comece no produtor oficial (IBGE, BCB, MTE, Receita, órgão setorial). Use agregadores (dados.gov.br, Base dos Dados, Dataset Search, HF, Kaggle) para localizar e depois volte à fonte primária. Registre a string de busca.
3. **Verificar antes de confiar.** Abra a URL, confirme o produtor e confira identificadores nos metadados da fonte. Se houver anti-bot, use a via oficial alternativa (API ou FTP). Nada vindo do LLM entra sem esse passo (B.7).
4. **Adquirir de forma reproduzível.** Faça a extração por script (API, FTP, SQL), salve o arquivo bruto imutável e calcule o SHA-256.
5. **Reproduzir um número publicado.** Ele prova que você está lendo a tabela certa, na unidade certa. Exemplo: IPCA jul/2026 = 0,07% na SIDRA e na SGS 433.
6. **Avaliar a aptidão.** Aplique o checklist (b) e decida entre apta, apta com ressalva ou inapta, com justificativa.
7. **Registrar.** Preencha o template (c), inclusive licença, base legal LGPD e fontes descartadas.
8. **Harmonizar em camadas explícitas e versionadas:** conceito → unidade/escala/base → moeda e deflação → tempo → geografia (crosswalk + anti-join) → quebras e lacunas. Cada passo vira uma função testável.
9. **Comparar com tolerância prévia.** Defina a métrica de distância (diferença relativa, p.p., razão, $z$, correlação de variações) e a tolerância antes de ver o resultado. Compare dinâmica quando os níveis não forem comparáveis.
10. **Diagnosticar e fechar.** Classifique cada divergência como explicada (com evidência ou ponte numérica) ou não explicada (fica aberta, com hipótese e próximo teste). Publique o log, peça revisão por par e marque a data de revalidação (nova safra, revisão da fonte).

---

## Anexo 1 — O que não foi verificado (e por quê)

- Bloqueio anti-bot ou erro:
  - páginas do SIDRA, do portal do Censo 2022, da PNAD Contínua e dos termos de uso do IBGE (Cloudflare 403);
  - TSE (Akamai);
  - IMF, termos e SDMX detalhado (Akamai; o portal foi lido via WebFetch);
  - OECD Quality Framework 2011 e termos da OCDE (403);
  - ILOSTAT, data.census.gov e Mendeley Data (Cloudflare);
  - site do BLS (Akamai);
  - termos do FRED (timeout);
  - Kaggle (reCAPTCHA);
  - Harvard Dataverse e Figshare (desafio 202);
  - DataCite Commons (429);
  - SEADE IMP (erro TLS);
  - PubMed e PDF da Walden (os metadados vieram do Europe PMC e do Crossref).
- Conteúdo não aberto:
  - arquivos do CNEFE (só a listagem);
  - FTP do PDET (citado na página oficial, não testado);
  - granularidade da série de preços da ANP e do SCR.data;
  - critério de atraso das séries de inadimplência do SGS;
  - faixa de renda do INPC;
  - nomes dos pacotes Python/R da Base dos Dados;
  - licenças de INEP, DATASUS, INMET, Ipeadata, FAOSTAT e WHO.
- Causa não verificada: a diferença de nível entre Censo 2022 e Estimativas 2024–2025. Os números foram conferidos; a explicação metodológica, não.

## Anexo 2 — Referências metodológicas verificadas

- Eurostat — European Statistics Code of Practice: https://ec.europa.eu/eurostat/web/quality/european-quality-standards/european-statistics-code-of-practice
- Eurostat — nota de 26/11/2025 sobre o Princípio 11: https://ec.europa.eu/eurostat/web/products-eurostat-news/w/edn-20251126-1
- ESS QAF v2.0: https://ec.europa.eu/eurostat/web/quality/european-quality-standards/quality-assurance-framework
- IMF DQAF (contas nacionais, mai/2012): https://dsbb.imf.org/content/pdfs/dqrs_nag.pdf
- IMF — "IMF's Data Quality Assessment Framework" (CCSA 2010): https://unstats.un.org/unsd/ccsa/cdqio-2010/Ses1-DQAF-IMF.pdf
- OECD — Quality Framework and Guidelines, STD/QFS(2003)1: https://unstats.un.org/unsd/unsystem/Documents/QAF-OECD.pdf
- ONU — Princípios Fundamentais: https://unstats.un.org/fpos/
- ONU — NQAF: https://unstats.un.org/unsd/methodology/dataquality/
- IBGE — nota técnica CAGED × PNADC: https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Nota_Tecnica/Nota_tecnica_diferencas_metodologicas_entre_o_CAGED_e_a_PNAD_continua.pdf
- IBGE — nota técnica PNAD/PME × PNADC: https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Nota_Tecnica/Nota_Tecnica_Diferencas_Metodologicas_das_pesquisas_PNAD_PME_e_PNAD_Continua.pdf
- IBGE — NT 02/2021, ponderação da PNADC: https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Nota_Tecnica/Nota_Tecnica_02_2021_Sobre_o_processo_de_ponderacao.pdf
- IBGE — deflatores da PNADC (2015): https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Nacional_por_Amostra_de_Domicilios_continua/Nota_Tecnica/2015_04_09_pnadc_calculo_dos_deflatores.pdf
- MTE — "O que é o Novo CAGED": https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged
- Triangulação:
  - Carter et al. (2014): https://doi.org/10.1188/14.ONF.545-547
  - CASRAI: https://casrai.org/guides/triangulation-in-research
  - Jick (1979): https://doi.org/10.2307/2392366
  - Fusch, Fusch & Ness (2018): https://doi.org/10.5590/josc.2018.10.1.02
- Pacote `survey` (R):
  - https://r-survey.r-forge.r-project.org/survey/html/postStratify.html
  - https://r-survey.r-forge.r-project.org/survey/html/rake.html
- Legislação e orientação:
  - LAI: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm
  - Decreto 8.777: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/decreto/d8777.htm
  - LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
  - ANPD, guia v2.0: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-poder-publico-anpd-versao-final.pdf/@@download/file
- Licenças:
  - CC BY 4.0: https://creativecommons.org/licenses/by/4.0/deed.pt-br
  - ODbL 1.0: https://opendatacommons.org/licenses/odbl/1-0/
- Proveniência e documentação:
  - W3C PROV-Overview: https://www.w3.org/TR/prov-overview/
  - W3C PROV-Primer: https://www.w3.org/TR/prov-primer/
  - Datasheets for Datasets: https://arxiv.org/abs/1803.09010
  - FAIR: https://www.nature.com/articles/sdata201618
- Risco de IA:
  - Walters & Wilder (2023): https://www.nature.com/articles/s41598-023-41032-5
  - Package hallucinations (2024): https://arxiv.org/abs/2406.10279
