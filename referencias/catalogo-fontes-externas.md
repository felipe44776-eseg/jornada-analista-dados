# Catálogo de fontes externas e protocolo de uso

> Usado na etapa 03 (busca e registro) e na 08 (triangulação). Verificado em **2026-09-23**. Relatório completo, com endereços de API, códigos de tabela e hashes conferidos, em `pesquisa/04-fontes-externas.md`.
> Status: **OK** = aberto e conferido · **parcial** = site com bloqueio anti-bot; dado confirmado por API ou FTP oficial · **NV** = não verificado. **Nada aqui dispensa a verificação da etapa 03**: URLs mudam, séries são encerradas, tabelas são rebaseadas.

## 1. Nove achados de 2026 que mudam a prática

1. **O IBGE está atrás de anti-bot.** `sidra.ibge.gov.br` e `censo2022.ibge.gov.br` devolvem 403 intermitente. Em script, use a **API** `servicodados.ibge.gov.br` (v3), a `apisidra.ibge.gov.br` (legada) ou o **FTP** `ftp.ibge.gov.br`.
2. **PMC e PMS foram rebaseadas para 2022=100.** As tabelas 2014=100 estão encerradas desde dez/2022. Código antigo, inclusive o sugerido por IA, aponta para série morta. Use 8880/8881 (PMC) e 5906 (PMS).
3. **O CNPJ da Receita mudou de lugar**: o caminho antigo dá 404. E o município vem em **código TOM de 4 dígitos** (São Paulo = 7107), não no código IBGE (3550308).
4. **O crosswalk TOM → IBGE da Receita tem buraco**: falta o município 5101837 (Boa Esperança do Norte/MT). Um *join* ingênuo perde registros sem dar erro: **anti-join obrigatório**.
5. **Censo 2022 e Estimativas não são intercambiáveis.** Brasil: 203.080.756 (Censo) × 213.421.037 (Estimativa 2025). Escolha o denominador e registre.
6. **Série oficial pode ter buraco.** O CPI-U dos EUA de out/2025 não existe ("lapse in appropriations"). A imputação é uma decisão analítica registrada.
7. **O Papers with Code (datasets) acabou** e redireciona para o Hugging Face.
8. **As licenças variam:**
   - BCB, CVM, ANEEL e OSM usam ODbL: um banco derivado usado publicamente fica sob a mesma licença;
   - parte da Prefeitura de SP e da SEADE usa CC **Não Comercial**, o que é problema para trabalho de consultoria;
   - 81 de 84 conjuntos da SEADE não declaram licença.
9. **O próprio verificador alucinou.** Quando a página do Kaggle não carregou, a ferramenta de leitura de páginas devolveu "informação típica" como se fosse o conteúdo. É a regra 3 na prática: só vale o que foi aberto e conferido.

## 2. Catálogo: Brasil

| Fonte | Temas | Acesso | URL | Status |
|---|---|---|---|---|
| **IBGE: API de agregados v3** | todas as pesquisas agregadas: Censo, PNAD Contínua, PMC, PMS, IPCA/INPC, PIB dos Municípios, Estimativas | API REST | https://servicodados.ibge.gov.br/api/docs/agregados?versao=3 | OK |
| IBGE: SIDRA (portal) | idem, interativo | portal | https://sidra.ibge.gov.br/ | parcial |
| IBGE: API legada | idem | API REST | https://apisidra.ibge.gov.br/ | OK |
| IBGE: Localidades e Malhas | códigos de município (7 dígitos), malhas GeoJSON | API | https://servicodados.ibge.gov.br/api/docs | OK |
| IBGE: FTP | Censo 2022 (setores, microdados), PNAD Contínua (microdados e notas técnicas), Estimativas, CNEFE | download | https://ftp.ibge.gov.br/ | OK |
| **dados.gov.br** | catálogo federal (metadados + links para os produtores) | portal, API (chave) | https://dados.gov.br/ | OK |
| **Base dos Dados** | *datalake* com tabelas brasileiras tratadas | BigQuery (1 TB/mês grátis), download | https://basedosdados.org/ | OK |
| **Ipeadata** | séries macro, regionais e sociais | portal, OData | http://www.ipeadata.gov.br/ | OK |
| **Banco Central: SGS** | séries temporais (Selic, IPCA, inadimplência, câmbio, crédito) | API JSON | https://www3.bcb.gov.br/sgspub/ | OK |
| Banco Central: Dados Abertos e Olinda | 4.261 conjuntos (ODbL); expectativas do Focus; PTAX | CKAN, OData | https://dadosabertos.bcb.gov.br/ | OK |
| **DATASUS / Dados Abertos do SUS** | saúde (TabNet; arquivos e API) | portal, API | https://datasus.saude.gov.br/informacoes-de-saude-tabnet/ · https://dadosabertos.saude.gov.br | OK |
| **INEP** | microdados de ENEM, Censo Escolar, Saeb (reestruturados por causa da LGPD) | download | https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados | OK |
| **MTE: Novo CAGED e RAIS** | emprego formal (mensal e anual; município) | painel, microdados | https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/acoes-e-programas/programas-projetos-acoes-obras-e-atividades/estatisticas-trabalho | OK |
| **Receita Federal: CNPJ** | cadastro de empresas, estabelecimentos, sócios, Simples (snapshots mensais) | download | https://arquivos.receitafederal.gov.br/index.php/s/gn672Ad4CF8N6TK | OK |
| Receita: crosswalk TOM ↔ IBGE | códigos de município | CSV | https://www.gov.br/receitafederal/dados/municipios.csv | OK |
| **Portal da Transparência** | gasto federal, servidores, contratos, benefícios | portal, API (token) | https://portaldatransparencia.gov.br/ | OK |
| TSE: Dados Abertos | eleições, candidatos, prestação de contas | portal | https://dadosabertos.tse.jus.br/ | NV |
| INMET | clima por estação (ZIP anuais desde 2000) | download | https://portal.inmet.gov.br/dadoshistoricos | OK |
| ANP · ANEEL · ANS · CVM | combustíveis · energia · saúde suplementar · mercado de capitais | download, CKAN | https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos · https://dadosabertos.aneel.gov.br/ · https://dadosabertos.ans.gov.br/ · https://dados.cvm.gov.br/ | OK |
| SUSEP: SES | seguros, previdência, capitalização | portal, download | https://www2.susep.gov.br/menuestatistica/SES/principal.aspx | OK |
| **Fundação SEADE** | estatísticas do Estado de SP | portal, CKAN | https://repositorio.seade.gov.br/ | OK |
| **Prefeitura de SP** | 483 conjuntos; GeoSampa; ObservaSampa; transações com ITBI | CKAN, mapa, xlsx | https://dados.prefeitura.sp.gov.br/ · https://geosampa.prefeitura.sp.gov.br/ | OK |
| Brasil.IO | dados públicos tratados | portal, API (token) | https://brasil.io/ | OK |
| FipeZap | preço **de anúncio** de imóveis (venda e locação) | XLSX | https://www.fipe.org.br/pt-br/indices/fipezap/ | OK |

## 3. Catálogo: global e repositórios

| Fonte | Temas | Acesso | URL | Status |
|---|---|---|---|---|
| **World Bank Open Data** | indicadores por país (CC BY 4.0) | portal, API v2 | https://data.worldbank.org/ | OK |
| IMF Data | macro e finanças; WEO | portal, SDMX | https://data.imf.org/ | parcial |
| OECD Data Explorer | indicadores OCDE | portal, SDMX | https://data-explorer.oecd.org/ | OK |
| UNdata · UN SDG | estatísticas da ONU · ODS | portal, SDMX, API | https://data.un.org/ · https://unstats.un.org/sdgs/dataportal | OK |
| WHO GHO | saúde por país | portal, OData | https://www.who.int/data/gho | OK |
| **Our World in Data** | indicadores globais (CC BY; terceiros seguem a licença original) | portal, CSV | https://ourworldindata.org/ | OK |
| FRED | séries econômicas (agregador) | portal, API (chave) | https://fred.stlouisfed.org/ | OK |
| Eurostat | UE | portal, API, bulk | https://ec.europa.eu/eurostat/data/database | OK |
| ILOSTAT · FAOSTAT | trabalho · agro | portal, pacote R | https://ilostat.ilo.org/data/ · https://www.fao.org/faostat/en/#data | NV · parcial |
| data.gov · US Census (ACS) · BLS | EUA | portal, API | https://data.gov/ · https://www.census.gov/programs-surveys/acs · https://api.bls.gov/publicAPI/v2/timeseries/data/ | OK |
| OpenStreetMap / Overpass / Geofabrik | geo colaborativo (ODbL) | download, API | https://www.openstreetmap.org/copyright · https://download.geofabrik.de/south-america/brazil.html | OK |
| Inside Airbnb | hospedagem (CC BY; São Paulo não disponível em set/2026) | download | https://insideairbnb.com/get-the-data/ | OK |
| BigQuery public datasets · AWS Open Data | datasets hospedados | BigQuery, S3 | https://cloud.google.com/bigquery/public-data · https://registry.opendata.aws/ | OK |
| **Google Dataset Search** | buscador de metadados | portal | https://datasetsearch.research.google.com/ | OK |
| Kaggle Datasets | comunidade (licença por dataset) | portal, CLI `kaggle` | https://www.kaggle.com/datasets | NV (CLI OK) |
| UCI ML Repository · OpenML · Hugging Face | datasets de ML | portal, API | https://archive.ics.uci.edu/ · https://www.openml.org/ · https://huggingface.co/datasets | OK |
| Zenodo · Harvard Dataverse · re3data | repositórios de pesquisa (DOI) | portal, API | https://zenodo.org/ · https://dataverse.harvard.edu/ · https://www.re3data.org/ | OK · NV · OK |

**Regra de busca:** comece no **produtor oficial**. Use os agregadores (dados.gov.br, Base dos Dados, Dataset Search, Kaggle, Hugging Face) para **localizar** e depois volte à fonte primária. Registre de qual das duas o dado veio.

## 4. Aptidão ao uso: 15 perguntas

Baseadas no Código de Boas Práticas das Estatísticas Europeias, no DQAF do FMI e no *Quality Framework* da OCDE ("fitness for use").

| # | Pergunta |
|---|---|
| 1 | **Conceito:** mede o mesmo universo, unidade e variável da métrica interna? A diferença residual está escrita? |
| 2 | **Granularidade:** geografia e tempo cobrem o recorte sem extrapolar? |
| 3 | **Exatidão:** há erro amostral publicado (CV, IC) ou indicação de cobertura e imputação? |
| 4 | **Reprodução:** reproduzi ao menos um número publicado a partir do arquivo ou da API? |
| 5 | **Revisão:** qual safra ou versão estou usando? É preliminar? Há política de revisão? |
| 6 | **Tempestividade:** a defasagem entre referência e publicação serve à decisão? |
| 7 | **Continuidade:** a série está ativa (não "encerrada") e tem calendário? |
| 8 | **Coerência:** bate com outra fonte do mesmo fenômeno, dentro de tolerância definida antes? |
| 9 | **Quebras:** mudou metodologia, base, cobertura ou classificação no período? |
| 10 | **Geografia:** códigos e malha são do mesmo ano? O anti-join do crosswalk voltou vazio? |
| 11 | **Acesso:** a extração é por script, estável e sem passo manual? |
| 12 | **Clareza:** há dicionário de dados e nota metodológica versionados? |
| 13 | **Credibilidade:** o produtor está identificado? É fonte primária, ou o intermediário documenta a derivação? |
| 14 | **Licença:** o uso pretendido é permitido? Atenção à cláusula Não Comercial e ao compartilhamento pela mesma licença da ODbL. |
| 15 | **LGPD:** há dado pessoal? A finalidade é compatível (art. 7º, §§3º e 7º)? Dá para minimizar? |

**Decisão:** 15 de 15 = apta. Falhar em 1, 4, 10, 14 ou 15 = **inapta até resolver**. Outras falhas = apta com ressalva escrita.

## 5. Harmonização, em camadas

Cada camada vira uma função testável, na ordem:

1. **Conceito:** universo, unidade, informante e período de referência. Exemplo clássico: o CAGED conta vínculo celetista por registro administrativo; a PNAD Contínua conta pessoa por amostra domiciliar. Os números **não** devem bater, e a comparação serve para explicar a diferença.
2. **Unidade, escala e base:** "mil reais", "mil pessoas", % × p.p., número-índice com base declarada (2022=100, dez/1993=100). Rebase: `I' = 100 · I / média(I no ano-base)`.
3. **Moeda e deflação:** valor real = nominal × `I_base / I_t`, **mês a mês**, antes de agregar. IPCA: SIDRA 1737, variável 2266 (número-índice). Escolha e registre IPCA ou INPC. Câmbio: defina a convenção (data da transação, média do mês ou fim de período).
4. **Tempo:** competência × caixa; a PNAD Contínua "mensal" é trimestre móvel (compare com a média móvel de 3 meses da série interna); datas de fechamento e revisões (o CAGED revisa até 12 meses).
5. **Geografia:** código IBGE de 7 dígitos; crosswalk explícito (TOM, SIAFI); **anti-join nos dois sentidos**; malha do mesmo ano dos dados; CEP via CNEFE, registrando a taxa de não geocodificados.
6. **Quebras e lacunas:** PNAD → PNAD Contínua (2012); CAGED → Novo CAGED (jan/2020); PMC e PMS rebaseadas (2022=100); coleta telefônica da PNAD Contínua em 2020–2021; buraco no CPI dos EUA em out/2025.

```python
# Deflação pelo IPCA via API do IBGE (tabela 1737, variável 2266 = número-índice)
import requests, pandas as pd
r = requests.get("https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-48/variaveis/2266",
                 params={"localidades": "N1[all]"}, timeout=60)
serie = r.json()[0]["resultados"][0]["series"][0]["serie"]            # {"AAAAMM": "valor"}
ipca = pd.to_numeric(pd.Series({pd.Period(f"{k[:4]}-{k[4:]}", "M"): v for k, v in serie.items()}),
                     errors="coerce")                                   # "..." e "-" viram NaN: trate!
base = ipca[pd.Period("2026-08", "M")]
df["valor_real"] = df["valor_nominal"] * base / df["mes"].map(ipca)   # df['mes'] em Period[M]
```

```python
# Anti-join: municípios oficiais do IBGE que faltam no crosswalk da Receita
import io, requests, pandas as pd
ibge = pd.DataFrame(requests.get("https://servicodados.ibge.gov.br/api/v1/localidades/municipios",
                                 timeout=60).json())[["id", "nome"]]
rf = pd.read_csv(io.BytesIO(requests.get("https://www.gov.br/receitafederal/dados/municipios.csv",
                 headers={"User-Agent": "Mozilla/5.0"}, timeout=60).content),
                 sep=";", encoding="cp1252", dtype=str)
print(set(ibge["id"].astype(str)) - set(rf["CÓDIGO DO MUNICÍPIO - IBGE"]))   # 2026-09-23: {'5101837'}
```

## 6. Comparação e tolerância (definidas antes de ver o resultado)

| Situação | Regra |
|---|---|
| **Duas estimativas com erro-padrão** (ex.: PNAD Contínua publica o CV) | `z = (a − b) / √(ep_a² + ep_b²)`; \|z\| > 2 sinaliza divergência. No kit: tolerância = `2·√(ep_a² + ep_b²)` + **margem substantiva declarada pelo dono** |
| **Registro administrativo já harmonizado** | regra de negócio explícita, ex.: diferença relativa ≤ 5% em totais, ≤ 1 p.p. em taxas, mesmo sinal da variação em ≥ 80% dos meses. É prática, não norma: ajuste e **registre antes** |
| **Ordem de grandeza** | razão interno/externo fora de [0,5; 2] → investigue unidade, escala e escopo antes de qualquer outra coisa |
| **Níveis não comparáveis** (índice × valor) | compare a **dinâmica** (variação sobre o mesmo mês do ano anterior, variação em 12 meses), não o nível |

**Registro de cada divergência:** métrica · recorte · período · valor interno · valor externo · diferença · tolerância · dentro ou fora · **classe da causa** (conceito, cobertura, tempo, geografia, unidade/escala, deflação/moeda, safra/revisão, erro interno, erro externo, desconhecida) · evidência · ação.

"Explicada" exige **evidência documental** (nota técnica, dicionário) **ou reconciliação numérica que feche a diferença**. Sem isso, fica "não explicada", com hipótese e próximo teste. **Nunca ajuste até bater.**

## 7. Licenças e LGPD

| Licença | Obrigação | Onde apareceu |
|---|---|---|
| CC0 | nenhuma | parte da Prefeitura de SP |
| CC BY 4.0 | atribuição e indicação de alterações | Banco Mundial, UCI, Inside Airbnb, OWID (conteúdo próprio), parte da Prefeitura de SP |
| ODbL 1.0 | atribuição; banco derivado usado publicamente fica sob ODbL | OSM, Banco Central, CVM, ANEEL |
| CC Não Comercial | **veda uso comercial** | parte da Prefeitura de SP, 3 conjuntos da SEADE |
| Sem licença declarada | não presuma: busque a base legal (LAI, Decreto 8.777) ou autorização | maioria da SEADE; Ipeadata, INMET, FipeZap |
| Termos da fonte original | intermediário não re-licencia | Base dos Dados; dados de terceiros no OWID |

- **Dado aberto federal:** o Decreto 8.777/2016 garante livre utilização, creditando a fonte. Não alcança estados, municípios nem o Judiciário. A LAI (art. 8º, §3º) exige formatos abertos e legíveis por máquina.
- **Dado público com dado pessoal** (sócios PF no CNPJ, servidores, candidatos): a LGPD vale.
  - O tratamento considera "a finalidade, a boa-fé e o interesse público que justificaram sua disponibilização" (art. 7º, §3º).
  - Nova finalidade exige propósito legítimo e específico (§7º).
  - Na prática: minimize, pseudonimize e publique só agregados.

## 8. Proveniência: o que registrar e como

URL canônica e URL exata (com parâmetros) · produtor e distribuidor · data e hora de acesso · safra ou versão · nome, tamanho e **SHA-256** · encoding e separador · licença e base legal · consulta ou filtros · script e commit · harmonizações · número reproduzido · decisão de aptidão e data de revalidação.

```python
import hashlib, json, datetime, pathlib, urllib.request
def sha256(caminho, bloco=1 << 20):
    h = hashlib.sha256()
    with open(caminho, "rb") as f:
        for parte in iter(lambda: f.read(bloco), b""):
            h.update(parte)
    return h.hexdigest()

def obter(url, caminho, sha_esperado=None, rebaixar=False):
    """Baixa só se preciso. Arquivo presente com o hash do manifesto: só confere. Hash divergente: interrompe."""
    p = pathlib.Path(caminho)
    if p.exists() and not rebaixar:
        if sha_esperado and sha256(p) != sha_esperado:
            raise SystemExit(f"ERRO: {p.name} não tem o hash do manifesto; trocar de versão é decisão registrada")
        return p
    p.parent.mkdir(parents=True, exist_ok=True)
    parcial = p.with_name(p.name + ".parcial")
    urllib.request.urlretrieve(url, parcial)                # o arquivo final só aparece com o download completo
    if sha_esperado and sha256(parcial) != sha_esperado:
        raise SystemExit(f"ERRO: {p.name} baixado com hash diferente do manifesto (deriva da fonte?); "
                         f"nada foi sobrescrito, o novo ficou em {parcial.name}")
    parcial.replace(p)
    return p

def checar_deriva(pasta="deriva", manifesto="dados/externos/manifesto.jsonl"):
    """Etapa 12: baixa cada fonte de novo numa pasta separada e lista TODAS as divergências."""
    ultimo = {}
    for linha in open(manifesto, encoding="utf-8"):
        reg = json.loads(linha)
        ultimo[reg["arquivo"]] = reg                         # vale o último registro de cada arquivo
    divergentes = []
    for nome, reg in sorted(ultimo.items()):
        try:
            obter(reg["url"], pathlib.Path(pasta) / nome, reg["sha256"], rebaixar=True)
        except (SystemExit, OSError) as e:                   # hash diferente ou fonte fora do ar
            divergentes.append(f"{nome}: {e}")
    print("\n".join(divergentes) or "sem deriva: todos os hashes iguais aos do manifesto")
    return divergentes

def registrar(caminho, url, licenca, safra, consulta, saida="dados/externos/manifesto.jsonl"):
    p = pathlib.Path(caminho)
    reg = {"arquivo": p.name, "bytes": p.stat().st_size, "sha256": sha256(p), "url": url,
           "licenca": licenca, "safra": safra, "consulta": consulta,
           "acessado_em": datetime.datetime.now().astimezone().isoformat()}
    with open(saida, "a", encoding="utf-8") as f:
        f.write(json.dumps(reg, ensure_ascii=False) + "\n")
    return reg
```

No primeiro download, `sha_esperado` fica vazio e `registrar` grava o hash. Nas execuções seguintes, passe o hash do manifesto: é isso que faz a reprodução das etapas 08 e 12 funcionar sem rede e sem deriva. Download interrompido deixa só o `.parcial`, nunca um arquivo final truncado. A checagem de deriva da etapa 12 é `checar_deriva()`: baixa tudo **numa pasta separada**, sem tocar na cópia guardada, e lista todas as divergências em vez de parar na primeira.

## 9. Protocolo anti-alucinação (nada sugerido pela IA entra sem passar por ele)

1. **Abrir** a URL e confirmar domínio e produtor. Bloqueio anti-bot **não prova inexistência**: procure a API ou o FTP oficial.
2. **Localizar o identificador na própria fonte**: código de tabela, de série e de variável conferidos nos metadados, nunca aceitos da resposta do modelo.
3. **Baixar e registrar o hash.**
4. **Ler** o dicionário e a nota metodológica: unidade, base, universo, quebras.
5. **Reproduzir um número publicado.** Sem reprodução, a fonte não entra.
6. **Conferir a licença** na página da fonte. "É público" não quer dizer "é livre".
7. **Pacotes e bibliotecas** sugeridos: conferir que existem no PyPI ou no CRAN, com mantenedor oficial, antes de instalar.
8. **Registrar**, inclusive o que foi descartado e por quê.

## 10. Oito pares "dado interno × fonte externa"

| Dado interno | Fonte externa | Propósito | Harmonização-chave |
|---|---|---|---|
| Faturamento mensal de varejo em SP | PMC-SP (SIDRA 8880, 2022=100) | benchmark de dinâmica | receita nominal × volume; rebase para 2022=100; comparar variação sobre o mesmo mês do ano anterior; mesmas lojas |
| Salários de admissão e rotatividade | Novo CAGED e RAIS (PDET) | benchmark, ordem de grandeza | só celetistas; CBO e CNAE no mesmo nível; quebra em jan/2020; deflator INPC ou IPCA |
| Preços de uma cesta própria | IPCA por subitem (SIDRA 7060) | inflação própria × oficial | SKU → subitem; pesos da POF × mix próprio; preço de tabela × efetivo |
| Clientes ativos por município | Censo 2022 e Estimativas (4714, 9514, 6579) | penetração, representatividade | geocodificação; denominador explícito (Censo × Estimativa); pós-estratificação |
| Inadimplência da carteira PF | Banco Central, SGS 21084, 21112, 21145 | benchmark de risco | critério de atraso nos metadados; livres × direcionados; comparar tendência em p.p. |
| Cadastro de clientes PJ | CNPJ da Receita (snapshot mensal) | enriquecimento, validação | CNPJ normalizado (14 dígitos); TOM → IBGE com anti-join; LGPD para sócios PF |
| Preço por m² de imóveis em SP | FipeZap e transações com ITBI (Prefeitura) | benchmark de preço | anúncio × transação; tipologia; mix de bairros; deflação |
| Receita de subsidiária nos EUA (US$) | CPI-U (BLS/FRED) + câmbio (PTAX) | comparação real entre países | com × sem ajuste sazonal (não misturar); lacuna de out/2025; ordem converter/deflacionar declarada |
