---
etapa: "04"
nome: "Preparação e partição"
fase: "2 · Reunir"
portao: "G4"
papel_ia: "Engenheiro(a) de dados"
entradas:
  - saidas/00-kickoff.md
  - saidas/01-brief.md
  - saidas/02-dados-internos.md
  - saidas/03-fontes-externas.md
saidas:
  - saidas/04-preparacao.md
  - analise/04_*.py · analise/rodar_tudo.py (comando único)
  - resultados/04_*.json
  - dados/processados/exploracao.*
  - <cofre>/confirmacao.*, <cofre>/base_integrada.* e, se houver, <cofre>/reserva.* (fora do projeto)
  - dados/quarentena/
  - saidas/05-registro-hipoteses.travado.md (só no caso "sem partição")
template: templates/04-preparacao.md
origem: "CRISP-DM: Select, Clean, Construct, Integrate, Format data · KDD: Preprocessing, Transformation · SEMMA: Modify (e Sample) · OSEMN: Scrub · R4DS: Tidy, Transform · Tidy data (Wickham, 2014) · Sandve et al. (2013) · holdout selado (Nosek et al., 2018)"
---

# Etapa 04 — Preparação e partição

> **Missão:** produzir por script, de forma reproduzível, uma base limpa, integrada e harmonizada, e **separar e guardar fora do alcance os dados de confirmação antes de explorar**.

## Por que esta etapa existe

- É a *Data Preparation* do CRISP-DM (selecionar, limpar, construir, integrar, formatar), o *Preprocessing/Transformation* do KDD, o *Modify* do SEMMA e o *Scrub* do OSEMN.
- **Reprodutibilidade:** todo resultado precisa ser regenerável do dado bruto por código, sem edição manual (Sandve et al., 2013).
- **A partição é a base prática do rigor.** Nosek et al. (2018) descrevem a lógica: uma parte da base serve à exploração e a outra "is sealed until exploration is complete". Selar e pré-registrar antes de abrir "converts postdictions … to predictions". Sem separação **física**, a IA ou você acabam "dando uma olhadinha", e o teste da etapa 07 perde o valor.

## Papel da IA

Escrever o pipeline, aplicar as regras com contagem, integrar e harmonizar, escrever os testes de dados, propor o método de partição e gravar a confirmação **no cofre**. A IA não lê o cofre.

## Ordem que evita vazamento

```text
brutos ──► limpeza por regra (linha a linha) ──► integração + harmonização ──► PARTIÇÃO
                                                                               │
          exploracao.*  ◄── fica no projeto ─────────────────────────────────┤
          confirmacao.* e base_integrada.*  ──► COFRE (fora do projeto) ─────┘

transformações que "aprendem" do dado (imputação pela média, padronização, faixas por quantil):
ajustadas SÓ na exploração; aplicadas na confirmação só na etapa 07
```

## Como escolher a partição

| Estrutura do dado | Método | Por quê |
|---|---|---|
| Linhas independentes | aleatória, estratificada por uma variável **que não seja o desfecho** de hipótese sobre o nível | preserva a composição |
| Mesma entidade em várias linhas (cliente, paciente, imóvel) | **agrupada**: a entidade inteira fica de um lado | evita vazamento entre as partes |
| Série temporal, ou decisão sobre o futuro | **temporal**: o período final vira confirmação | simula o uso real |
| Dependência espacial | **por blocos geográficos** | vizinhos se parecem |
| Amostra complexa (peso, estrato, conglomerado) | **por conglomerado (UPA) dentro do estrato**, com pesos reescalados, ou sem partição | partir por linha quebra o desenho amostral |
| Existe base independente comparável | **fonte independente** | confirmação externa |
| Pergunta descritiva sobre a base inteira, ou *n* pequeno demais | **sem partição** | ver `AGENTS.md` §2, Adaptações |

**Atribuição fixa e estável.** Não use o `hash()` do Python: para texto, ele muda a cada processo; para inteiro, devolve o próprio número. Use SHA-256 com um **sal** fixado no kickoff:

```python
import hashlib
def vai_para_confirmacao(id_entidade, sal, fracao=0.30):
    h = int(hashlib.sha256(f"{sal}:{id_entidade}".encode()).hexdigest(), 16)
    return (h % 10_000) < round(fracao * 10_000)
```

- **Estratificada:** dentro de cada estrato, ordene as entidades por esse hash e mande a fração inicial para a confirmação.
- **Temporal ou espacial:** a regra de corte (data, blocos) é documentada e fixa.

Rodar o pipeline de novo produz exatamente a mesma partição.

**Proporção:** padrão de 70% exploração e 30% confirmação. Antes de fixar, calcule o **poder preliminar da regra** para as hipóteses a priori, com estes ingredientes:
- as variâncias do perfil univariado da etapa 02;
- o **efeito plausível δ declarado no brief** (pelo dono ou pela literatura), maior que o efeito mínimo m;
- α/k, ou α'/k = (α/2)/k se a partição criar uma reserva para um ciclo 2;
- o *n* efetivo = *n* / DEFF, quando há amostra complexa ou dado agrupado.

Calculado no próprio m, o poder da regra fica em no máximo cerca de 50%, qualquer que seja o *n*. Se o poder ficar baixo, aumente a confirmação ou reduza hipóteses, e **nunca mexa em m nem em δ** (ver `referencias/guia-testes-estatisticos.md` §5).

**Reserva (opcional):** se já se prevê um segundo ciclo de hipóteses, separe também uma reserva (ex.: 15%), gravada como `reserva.*` no cofre e aberta só num novo G5. Ela só leva uma hipótese do ciclo 2 a E1 se o G5 do ciclo 1 reservar α (`AGENTS.md` §4).

## Roteiro PEVD

### P — Planejar
1. A partir do §6 da etapa 02 (ações de qualidade) e do §7 da etapa 03 (harmonização), liste as regras e as transformações.
2. Declare as expectativas: linhas após cada regra, taxa de correspondência de cada junção, tamanho de cada parte.

### E — Executar
1. **Limpeza por regra** (R01, R02…), com motivo, contagem e destino: corrigida, sinalizada ou quarentena.
   - Nenhuma linha some em silêncio.
   - Regra que não pegou nenhuma linha **continua no código**: prova que a condição foi verificada.
   - Valor fora de todas as regras **interrompe** o pipeline com mensagem, sem virar `NaN` escondido.
2. **Variáveis derivadas**, com definição e unidade.
3. **Integração e harmonização:** registre a contagem antes e depois de cada junção e a taxa de correspondência; aplique deflação, unidades e geografia conforme o plano da 03.
4. **Testes de dados** (pandera, Great Expectations ou `assert`): chave única, domínios, totais que batem antes e depois das junções. **Relatório de falha mascara colunas pessoais** (o pandera mostra os valores que falharam).
5. **Partição** pelo método da tabela, com atribuição fixa (SHA-256 + sal).
   - O script grava `exploracao.*` no projeto e `confirmacao.*`, `base_integrada.*` e, se houver, `reserva.*` **no cofre**, cujo caminho vem da variável de ambiente `COFRE_DIR`, fora do projeto. Nas reproduções (etapas 08 e 12), `COFRE_DIR` aponta para uma pasta temporária.
   - O **próprio script de partição** registra, no momento em que cria as partes, as contagens, o hash de conteúdo da confirmação e a distribuição das variáveis de estratificação em `resultados/04_particao.json`. Depois disso, ninguém abre a confirmação até a etapa 07.
   - **A partição se sela uma vez.** Se `resultados/04_particao.json` já existe, o script não grava mais no cofre: recalcula as partes em memória, confere contagens e hash contra o registro e grava só `exploracao.*` (trecho abaixo). Assim, rodar o pipeline de novo não recria a confirmação em texto aberto ao lado de um cofre compactado, nem exige o cofre conectado. Para refazer a partição **antes do G4**, apague esse JSON e o conteúdo do cofre, com DEC; depois do G4, isso é incidente.
   - Peça ao humano que confira o cofre e, se quiser, o compacte com senha.

   ```python
   # trecho final de analise/04_particionar.py (exploracao, confirmacao, base_integrada e reserva já calculados)
   import json, os, pathlib, sys
   import pandas as pd

   def hash_conteudo(df, chave):                           # AGENTS.md §6: não depende do formato do arquivo
       return str(pd.util.hash_pandas_object(df.sort_values(chave), index=False).sum())

   registro = pathlib.Path("resultados/04_particao.json")
   atual = {"particao.n_exploracao": len(exploracao), "particao.n_confirmacao": len(confirmacao),
            "particao.hash_confirmacao": hash_conteudo(confirmacao, "id")}
   if registro.exists():                                   # já selada: confere em memória, não toca no cofre
       antes = json.loads(registro.read_text(encoding="utf-8"))
       if any(antes.get(k) != v for k, v in atual.items()):
           sys.exit("ERRO: a partição mudou depois de selada. Não regrave o cofre: registre um incidente.")
   else:                                                   # primeira execução, ou reprodução numa cópia sem resultados/
       if not os.environ.get("COFRE_DIR"):
           sys.exit("ERRO: defina COFRE_DIR (pasta fora do projeto) para selar a partição.")
       cofre = pathlib.Path(os.environ["COFRE_DIR"])
       confirmacao.to_csv(cofre / "confirmacao.csv", index=False)       # ou Parquet
       base_integrada.to_csv(cofre / "base_integrada.csv", index=False)
       if reserva is not None:
           reserva.to_csv(cofre / "reserva.csv", index=False)
       registro.write_text(json.dumps({"_script": "analise/04_particionar.py", **atual}), encoding="utf-8")
   exploracao.to_csv("dados/processados/exploracao.csv", index=False)
   ```
6. **Sem partição** (descritiva ou *n* pequeno): registre as hipóteses a priori **por completo** no template do registro e trave-as agora, antes de qualquer exploração, pelo procedimento de travamento da etapa 05, com a tag `trava-registro`. No `rodar_tudo.py`, ponha `COM_PARTICAO = False`: não há cofre, e a 07 roda na base inteira.
7. **Convenções:** fixe a regra de arredondamento e as unidades. Elas valem até o deck.
8. **Comando único:** `analise/rodar_tudo.py` (seção abaixo). Aqui ele roda até a 04 (`--ate 04`). Nas etapas seguintes, todo script novo entra na lista `ORDEM` no mesmo passo em que é criado.
9. Números para `resultados/04_*.json`: linhas por regra, taxas de junção, tamanhos das partes, poder preliminar.

### V — Verificar
- Rode `python analise/rodar_tudo.py --ate 04` do zero duas vezes. O **hash de conteúdo** de `exploracao.*` é igual nas duas? (Hash de bytes de Parquet muda com a versão da biblioteca.)
- Contabilidade de linhas: brutas = na análise + em quarentena (± agregações documentadas).
- O conjunto de confirmação foi lido por algo além do script de partição? Se sim, registre como incidente no log.
- Rode o checklist do portão (§9 do artefato).

### D — Decidir: portão G4
Peça `Aprovo G4` e o commit com tag `G4`. Em dois casos o G4 também exige a **âncora externa** (`AGENTS.md` §5) e a DEC `âncora`:
- **no modo essencial**, porque o G4 é ★ (cobre 02+03+04): âncora da tag `G4`;
- **sem partição**, em qualquer modo, porque o registro foi travado aqui (passo 6): âncora da tag `trava-registro`, no mesmo commit de `G4`.

A partir daqui, a confirmação fica no cofre até a etapa 07.

## Comando único: `analise/rodar_tudo.py`

Roda o pipeline na ordem da lista `ORDEM`, que é a ordem de execução, **não** a alfabética (com os nomes do template, `04_integrar.py` viria antes de `04_limpar.py`). A mesma chamada, com `--reproducao`, faz as reproduções das etapas 08 e 12 e a da auditoria, **só numa cópia com `resultados_ref/`**. Três convenções que ela pressupõe:
- `04_particionar.py` se sela uma vez (trecho no passo 5): depois disso, não grava mais no cofre, e o `COFRE_DIR` só é exigido na reprodução;
- `06_modelo.py` decide sozinho onde grava: `modelos/` antes do congelamento, `modelos_regerado/` depois (trecho na etapa 06). Assim, nem este script nem o humano que reexecuta a 06 no sorteio regravam o congelado;
- `07_testes.py` lê sempre `modelos/`, o congelado.

```python
# analise/rodar_tudo.py — comando único do pipeline, na ordem da lista ORDEM (não na alfabética)
# uso: python analise/rodar_tudo.py [--ate NN] [--reproducao]
#   --ate NN      roda só até a etapa NN (ex.: --ate 06 enquanto a confirmação está no cofre)
#   --reproducao  etapas 08 e 12 e auditoria, numa cópia com resultados_ref/: exige COFRE_DIR novo e vazio,
#                 simula a devolução do cofre antes da 07, apaga o cofre temporário e compara com resultados_ref/
import hashlib, os, pathlib, shutil, subprocess, sys

for s in (sys.stdout, sys.stderr):
    s.reconfigure(encoding="utf-8")                            # acentos e setas intactos mesmo com a saída capturada
RAIZ = pathlib.Path(__file__).resolve().parents[1]
COM_PARTICAO = True   # False na rota sem partição (etapa 04, passo 6): não há cofre, e a 07 roda na base inteira
ORDEM = [  # a IA acrescenta cada script novo aqui, no mesmo passo em que o cria
    "02_perfil.py", "03_baixar_externos.py",
    "04_limpar.py", "04_integrar.py", "04_particionar.py",
    "05_eda.py", "05_poder.py", "06_modelo.py",
    "07_testes.py", "08_robustez.py", "08_triangulacao.py",
]
args = sys.argv[1:]
ate = f"{int(args[args.index('--ate') + 1]):02d}" if "--ate" in args else "99"
reproducao = "--reproducao" in args
amb = dict(os.environ, PYTHONIOENCODING="utf-8")
cofre = None
if reproducao:
    if not any((RAIZ / "resultados_ref").glob("*.json")):
        sys.exit("ERRO: --reproducao só roda numa cópia com resultados_ref/. Nada foi executado.")
    if COM_PARTICAO:
        if not amb.get("COFRE_DIR"):
            sys.exit("ERRO: defina COFRE_DIR com uma pasta temporária nova.")
        cofre = pathlib.Path(amb["COFRE_DIR"])
        if cofre.exists() and any(cofre.iterdir()):
            sys.exit(f"ERRO: {cofre} não está vazio. Numa reprodução, COFRE_DIR é uma pasta temporária nova, nunca o cofre real.")
        cofre.mkdir(parents=True, exist_ok=True)
for pasta in ("resultados", "figuras", "dados/processados"):
    (RAIZ / pasta).mkdir(parents=True, exist_ok=True)

processados = RAIZ / "dados" / "processados"
ciclo2 = (RAIZ / "saidas" / "05-registro-hipoteses-c2.travado.md").exists()
try:
    for script in ORDEM:
        if script[:2] > ate:
            break
        if not (RAIZ / "analise" / script).exists():
            sys.exit(f"ERRO: analise/{script} está na ORDEM e não existe. Corrija a ORDEM.")
        if script.startswith("07") and COM_PARTICAO:
            if cofre:                                              # reprodução: devolução do cofre, simulada
                for f in [*cofre.glob("confirmacao.*"), *(cofre.glob("reserva.*") if ciclo2 else [])]:
                    shutil.copy2(f, processados / f.name)          # a reserva só volta depois da trava do ciclo 2
            if not any(processados.glob("confirmacao.*")):
                sys.exit("PARADA: a confirmação ainda está no cofre. Rode com --ate 06 ou peça a devolução ao humano.")
        print(f"→ analise/{script}", flush=True)
        if subprocess.run([sys.executable, str(RAIZ / "analise" / script)], cwd=RAIZ, env=amb).returncode:
            sys.exit(f"ERRO: analise/{script} falhou; o pipeline parou aqui.")
finally:
    if cofre and cofre.exists():
        shutil.rmtree(cofre)                                       # o cofre temporário não fica para trás, nem em erro

if reproducao:
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    for novo in sorted((RAIZ / "modelos_regerado").glob("*")):
        congelado = RAIZ / "modelos" / novo.name
        igual = congelado.exists() and sha(novo) == sha(congelado)
        print(f"modelo {novo.name}: o regerado é {'idêntico ao' if igual else 'DIFERENTE do'} congelado (informativo: a 07 usa o congelado)")
    sys.exit(subprocess.run([sys.executable, str(RAIZ / "analise" / "comparar_resultados.py")], cwd=RAIZ, env=amb).returncode)
```

## Armadilhas

| Armadilha | Salvaguarda |
|---|---|
| Limpeza "no olho" numa planilha | só por script, com regra e contagem |
| Excluir outlier porque "atrapalha" | sinalizar, não excluir; a influência dele é testada nas sensibilidades registradas |
| Junção que multiplica linhas (chave duplicada) | contagem antes e depois + teste de unicidade |
| Imputação calculada na base inteira (vazamento) | transformações que aprendem do dado só na exploração |
| Partição aleatória com entidade repetida | partição agrupada |
| Estratificar pelo desfecho e depois "confirmar" o nível do desfecho | estratificação por outra variável, ou sem partição |
| `base_integrada` esquecida no projeto (contém a confirmação) | gravada no cofre, junto com a confirmação |
| "Só uma olhadinha" no confirmatório | cofre fora do projeto; leitura fora de hora registrada como incidente |
| Número muda a cada execução | semente, versões e atribuição fixa por ID |
| Pipeline rodado em ordem alfabética (`04_integrar` antes de `04_limpar`) | `rodar_tudo.py`, com a ordem explícita na `ORDEM` |
| Rodar o pipeline de novo recria a confirmação em texto aberto ao lado do cofre compactado | partição selada uma vez: depois, só confere em memória |

## Prompts prontos

```text
Proponha o método de partição exploração/confirmação para este dado. Diga
qual é a estrutura de dependência (entidades repetidas? tempo? espaço? desenho
amostral?) e por que o método evita vazamento. A atribuição deve ser fixa:
SHA-256 de "<sal>:<id>" (nunca o hash() do Python). O script grava a confirmação
e a base integrada no cofre (caminho em COFRE_DIR), registra as contagens em
resultados/04_particao.json e não imprime mais nada sobre a confirmação.
```

```text
Escreva o pipeline da etapa 04 como funções pequenas, com um schema pandera
validando a saída de cada passo e relatórios de falha que mascaram colunas
pessoais. Cada regra grava as linhas afetadas em dados/quarentena/ com a
coluna "motivo" e escreve a contagem em resultados/04_limpeza.json.
```

## Volte para trás quando

- Aparecem problemas de qualidade não previstos → **02**.
- A harmonização planejada se mostra impossível → **03**: outra fonte ou comparação rebaixada.
