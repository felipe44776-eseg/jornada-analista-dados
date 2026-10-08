# Teste de ponta a ponta do código do kit, extraído do texto publicado em fluxo/:
# rodar_tudo.py e trecho da partição selada (etapa 04), trecho de saída do modelo (etapa 06),
# comparar_resultados.py (etapa 08) e sorteio.py (AGENTS.md §4), num projeto simulado com scripts falsos de cada etapa.
# uso: python verificacao/teste_kit.py      (esperado: todas as checagens passam; roda numa pasta temporária)
import json, os, pathlib, re, shutil, stat, subprocess, sys, tempfile, textwrap

sys.stdout.reconfigure(encoding="utf-8")
KIT = pathlib.Path(__file__).resolve().parents[1] / "fluxo"
if not KIT.is_dir():  # repositório publicado: o kit fica na raiz
    KIT = KIT.parent
BASE = pathlib.Path(tempfile.gettempdir()) / "kit_dados_teste_kit"

def _rm_ro(func, path, _):
    os.chmod(path, stat.S_IWRITE); func(path)
def limpar(p):
    if p.exists():
        shutil.rmtree(p, onerror=_rm_ro)

def bloco(arquivo, marcador):
    for b in re.findall(r"```python\n(.*?)```", (KIT / arquivo).read_text(encoding="utf-8"), flags=re.S):
        if marcador in b:
            return textwrap.dedent(b)
    sys.exit(f"bloco {marcador} não achado em {arquivo}")

def rodar(proj, args, extra_env=None, sem=()):
    env = dict(os.environ)
    for k in ("COFRE_DIR", *sem):
        env.pop(k, None)
    env.update(extra_env or {})
    r = subprocess.run([sys.executable, *args], cwd=proj, env=env, capture_output=True)
    return r.returncode, (r.stdout + r.stderr).decode("utf-8", errors="replace").strip()

ok_total = []
def checar(nome, cond, detalhe=""):
    ok_total.append(bool(cond))
    print(f"{'PASSA' if cond else 'FALHA'}  {nome}" + (f"\n        [{detalhe}]" if detalhe and not cond else ""))

RODAR = bloco("etapas/04-preparacao.md", "analise/rodar_tudo.py")
COMPARAR = bloco("etapas/08-validacao.md", "analise/comparar_resultados.py")
SORTEIO = bloco("AGENTS.md", "analise/sorteio.py")
TRECHO_04 = bloco("etapas/04-preparacao.md", "trecho final de analise/04_particionar.py")
TRECHO_06 = bloco("etapas/06-modelagem.md", "início de analise/06_modelo.py")

S = {  # scripts simulados de cada etapa
"02_perfil.py": '''import json, pathlib
n = len(pathlib.Path("dados/brutos/base.csv").read_text(encoding="utf-8").strip().splitlines()) - 1
pathlib.Path("resultados/02_perfil.json").write_text(json.dumps({"_script": "analise/02_perfil.py", "D01.linhas": n}), encoding="utf-8")
''',
"03_baixar_externos.py": '''import json, pathlib
pathlib.Path("resultados/03_externos.json").write_text(json.dumps({"_script": "analise/03_baixar_externos.py", "F01.prova": 10.04}), encoding="utf-8")
''',
"04_limpar.py": '''import pathlib
pathlib.Path("dados/processados/limpo.csv").write_text(pathlib.Path("dados/brutos/base.csv").read_text(encoding="utf-8").replace(";", ","), encoding="utf-8")
''',
"04_integrar.py": '''import pathlib, sys
p = pathlib.Path("dados/processados/limpo.csv")
if not p.exists():
    sys.exit("04_integrar: limpo.csv não existe (rodou fora de ordem)")
pathlib.Path("dados/processados/integrada.csv").write_text(p.read_text(encoding="utf-8"), encoding="utf-8")
''',
"04_particionar.py": '''import hashlib, pathlib
import pandas as pd
base_integrada = pd.read_csv("dados/processados/integrada.csv")
pathlib.Path("dados/processados/integrada.csv").unlink()
def parte(i):
    h = int(hashlib.sha256(f"sal:{i}".encode()).hexdigest(), 16) % 100
    return "confirmacao" if h < 30 else ("reserva" if h < 40 else "exploracao")
rotulo = base_integrada["id"].map(parte)
exploracao, confirmacao, reserva = (base_integrada[rotulo == r] for r in ("exploracao", "confirmacao", "reserva"))
''' + TRECHO_04,
"05_eda.py": '''import json, pathlib
import pandas as pd
v = pd.read_csv("dados/processados/exploracao.csv")["valor"]
pathlib.Path("resultados/05_eda.json").write_text(json.dumps({"_script": "analise/05_eda.py", "O01.media": round(float(v.mean()), 6)}), encoding="utf-8")
''',
"05_poder.py": '''import json, pathlib
pathlib.Path("resultados/05_poder.json").write_text(json.dumps({"_script": "analise/05_poder.py", "H01.poder": 0.92}), encoding="utf-8")
''',
"06_modelo.py": TRECHO_06 + '''import json, os, random
x = random.random() if os.environ.get("TREINO_NAO_DETERMINISTICO") else 42
(SAIDA_MODELO / "M01.bin").write_text(f"modelo-{x}", encoding="utf-8")
(RAIZ / "resultados/06_modelo.json").write_text(json.dumps({"_script": "analise/06_modelo.py", "M01.auc_validacao": 0.81}), encoding="utf-8")
''',
"07_testes.py": '''import hashlib, json, pathlib
import pandas as pd
conf = pd.read_csv("dados/processados/confirmacao.csv")
m = pathlib.Path("modelos/M01.bin")
pathlib.Path("resultados/07_testes.json").write_text(json.dumps({"_script": "analise/07_testes.py",
    "H01.efeito": round(float(conf["valor"].mean()), 6), "H01.n": len(conf),
    "M01.sha256": hashlib.sha256(m.read_bytes()).hexdigest(),
    "H01.viu_reserva": pathlib.Path("dados/processados/reserva.csv").exists()}), encoding="utf-8")
''',
"08_robustez.py": '''import json, pathlib
pathlib.Path("resultados/08_robustez.json").write_text(json.dumps({"_script": "analise/08_robustez.py", "H01.S1.efeito": 0.5}), encoding="utf-8")
''',
"08_triangulacao.py": '''import json, pathlib
pathlib.Path("resultados/08_triangulacao.json").write_text(json.dumps({"_script": "analise/08_triangulacao.py", "H01.tri.detalhe": {"ext": 0.3, "int": float("nan")}}), encoding="utf-8")
''',
}

def montar(proj, scripts, rodar_tudo=RODAR):
    for d in ("analise", "saidas", "dados/brutos"):
        (proj / d).mkdir(parents=True, exist_ok=True)
    (proj / "analise/rodar_tudo.py").write_text(rodar_tudo, encoding="utf-8")
    (proj / "analise/comparar_resultados.py").write_text(COMPARAR, encoding="utf-8")
    (proj / "analise/sorteio.py").write_text(SORTEIO, encoding="utf-8")
    (proj / "dados/brutos/base.csv").write_text("id;valor\n" + "".join(f"{i};{(i * 37) % 101}\n" for i in range(1, 401)), encoding="utf-8")
    for nome, codigo in scripts.items():
        (proj / "analise" / nome).write_text(codigo, encoding="utf-8")

limpar(BASE)
P = BASE / "proj"
montar(P, S)
cofre = BASE / "cofre_real"; cofre.mkdir(parents=True)
env_cofre = {"COFRE_DIR": str(cofre)}

print("== A. Projeto principal ==")
rc, out = rodar(P, ["analise/rodar_tudo.py", "--ate", "04"], env_cofre)
checar("--ate 04 sela a partição: cofre com confirmação e reserva; registro com hash", rc == 0 and (cofre / "confirmacao.csv").exists()
       and (cofre / "reserva.csv").exists() and "particao.hash_confirmacao" in (P / "resultados/04_particao.json").read_text(encoding="utf-8"), out[-400:])
checar("sem confirmação dentro do projeto", not any((P / "dados/processados").glob("confirmacao.*")))
for f in list(cofre.glob("*.csv")):
    f.unlink()
(cofre / "cofre.zip").write_bytes(b"compactado com senha")
rc, out = rodar(P, ["analise/rodar_tudo.py", "--ate", "05"])
checar("selada: roda sem COFRE_DIR e não recria a confirmação em texto aberto", rc == 0 and not any(cofre.glob("*.csv")) and (P / "dados/processados/exploracao.csv").exists(), out[-400:])
original = (P / "dados/brutos/base.csv").read_text(encoding="utf-8")
(P / "dados/brutos/base.csv").write_text(original + "401;5\n", encoding="utf-8")
rc, out = rodar(P, ["analise/rodar_tudo.py", "--ate", "04"])
checar("dado mudou depois de selar: a partição acusa e para", rc != 0 and "mudou depois de selada" in out, out[-400:])
(P / "dados/brutos/base.csv").write_text(original, encoding="utf-8")
rc, out = rodar(P, ["analise/rodar_tudo.py", "--ate", "6"])
checar("--ate 6 para antes da 07; antes do congelamento a 06 grava em modelos/", rc == 0 and "07_testes" not in out and (P / "modelos/M01.bin").exists(), out[-400:])
(P / "saidas/06-ficha-modelo.travado.md").write_text("ficha travada\n", encoding="utf-8")
os.chmod(P / "modelos/M01.bin", stat.S_IREAD)
congelado = (P / "modelos/M01.bin").read_bytes()
rc, out = rodar(P, ["analise/06_modelo.py"], {"TREINO_NAO_DETERMINISTICO": "1"})
checar("06 reexecutada direto (sorteio): grava em modelos_regerado/, congelado intacto", rc == 0 and (P / "modelos_regerado/M01.bin").exists()
       and (P / "modelos/M01.bin").read_bytes() == congelado, out[-400:])
rc, out = rodar(P, ["analise/rodar_tudo.py"])
checar("sem devolução do cofre: PARADA antes da 07", rc != 0 and "PARADA" in out, out[-400:])
aux = BASE / "cofre_aux"; aux.mkdir()
tmp = BASE / "aux_proj"; montar(tmp, S)
rodar(tmp, ["analise/rodar_tudo.py", "--ate", "04"], {"COFRE_DIR": str(aux)})
shutil.copy2(aux / "confirmacao.csv", P / "dados/processados/confirmacao.csv")          # devolução pelo humano
rc, out = rodar(P, ["analise/rodar_tudo.py"])
checar("com a devolução: pipeline completo até a 08, sem COFRE_DIR", rc == 0 and "08_triangulacao" in out, out[-400:])
ref_antes = (P / "resultados/07_testes.json").read_text(encoding="utf-8")
rc, out = rodar(P, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(BASE / "tmp_erro")})
checar("--reproducao na pasta original (sem resultados_ref/): aborta antes de rodar", rc != 0 and "resultados_ref" in out
       and (P / "resultados/07_testes.json").read_text(encoding="utf-8") == ref_antes and "→ analise" not in out, out[-400:])

print("== B. Sorteio ==")
(P / "saidas/00-status.md").write_text("| Etapa atual | 07 |\n", encoding="utf-8")
(P / "saidas/02-dados-internos.md").write_text("linhas [→ `D01.linhas`]\n", encoding="utf-8")
(P / "saidas/04-preparacao.md").write_text("| [→ `particao.n_exploracao`] · [→ `particao.n_confirmacao`] | [→ `resultados/04_poder.json`] |\n", encoding="utf-8")
(P / "saidas/07-resultados-testes.md").write_text("- H01 [→ `H01.efeito`] · [→ `H01.n`, A02] · [→ V01c] · [→ ___] · [→ chave]\n", encoding="utf-8")
(P / "saidas/08-validacao.md").write_text("S1 [→ `H01.S1.efeito`]\n", encoding="utf-8")
da07 = {"H01.efeito", "H01.n"}
primeiras = {rodar(P, ["analise/sorteio.py", str(s)])[1].splitlines()[0].split()[0] for s in range(100)}
checar("100 sementes: a 1ª chave é sempre da etapa atual", primeiras <= da07, str(primeiras))
rc1, o1 = rodar(P, ["analise/sorteio.py", "42"]); rc2, o2 = rodar(P, ["analise/sorteio.py", "42"])
checar("mesma semente, mesmo sorteio; 2 chaves diferentes", rc1 == 0 and o1 == o2 and o1.count("reexecute") == 2, o1)
rc, out = rodar(P, ["analise/sorteio.py", "42"], sem=("PYTHONIOENCODING", "PYTHONUTF8"))
checar("saída por pipe sem PYTHONIOENCODING não quebra no '→'", rc == 0 and "reexecute" in out, out[-300:])
(P / "saidas/00-status.md").write_text("| Etapa atual | 07+08 |\n", encoding="utf-8")
ok = all(rodar(P, ["analise/sorteio.py", str(s)])[1].splitlines()[0].split()[0] in da07 | {"H01.S1.efeito"} for s in range(30))
checar("modo essencial (07+08): a 1ª chave vem do grupo", ok)
(P / "saidas/00-status.md").write_text("| Etapa atual | 01 |\n", encoding="utf-8")
rc, out = rodar(P, ["analise/sorteio.py", "3"])
checar("etapa sem chave: avisa e sorteia 2 do projeto", rc == 0 and "não cita chave" in out and out.count("reexecute") == 2, out)
(P / "saidas/00-status.md").write_text("| Etapa atual | 07 |\n", encoding="utf-8")
(P / "saidas/07-resultados-testes.md").write_text("- H01 [→ `H01.efeito`] · [→ H09.efeito]\n", encoding="utf-8")
rc, out = rodar(P, ["analise/sorteio.py", "1"])
checar("chave citada inexistente: erro", rc != 0 and "H09.efeito" in out, out)
(P / "saidas/07-resultados-testes.md").write_text("- H01 [→ `H01.efeito`] · [→ `H01.n`]\n", encoding="utf-8")
(P / "resultados/99_dup.json").write_text(json.dumps({"_script": "x.py", "H01.efeito": 1}), encoding="utf-8")
rc, out = rodar(P, ["analise/sorteio.py", "1"])
checar("chave repetida em dois JSON: erro", rc != 0 and "repetida" in out, out)
(P / "resultados/99_dup.json").unlink()
guardados = {f: f.read_text(encoding="utf-8") for f in (P / "saidas").glob("0[2-8]-*.md")}
for f in guardados:
    f.write_text("sem citações\n", encoding="utf-8")
(P / "saidas/07-resultados-testes.md").write_text("[→ `H01.efeito`]\n", encoding="utf-8")
rc, out = rodar(P, ["analise/sorteio.py", "5"])
checar("menos de 2 chaves citadas: 'Sem sorteio', sem erro", rc == 0 and "Sem sorteio" in out, out)
for f, txt in guardados.items():
    f.write_text(txt, encoding="utf-8")

print("== C. Reprodução numa cópia ==")
def copia(nome, extra=None):
    R = BASE / nome
    shutil.copytree(P, R, ignore=shutil.ignore_patterns("processados", "resultados", "modelos_regerado"))
    shutil.copytree(P / "resultados", R / "resultados_ref")
    for arq, txt in (extra or {}).items():
        (R / arq).write_text(txt, encoding="utf-8")
    return R
R = copia("repro1")
tmp1 = BASE / "cofre_tmp1"
rc, out = rodar(R, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(tmp1)})
checar("reprodução: 0 diferenças, modelo regerado idêntico", rc == 0 and "0 diferença(s)" in out and "idêntico ao congelado" in out, out[-600:])
checar("reprodução do ciclo 1: a reserva não aparece nos processados", not (R / "dados/processados/reserva.csv").exists())
checar("reprodução: o cofre temporário é apagado no fim", not tmp1.exists())
R2 = copia("repro2", {"saidas/05-registro-hipoteses-c2.travado.md": "registro do ciclo 2\n"})
rc, out = rodar(R2, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(BASE / "cofre_tmp2")})
checar("com a trava do ciclo 2, a reserva é devolvida (e só então)", (R2 / "dados/processados/reserva.csv").exists() and "H01.viu_reserva" in out, out[-600:])
R3 = copia("repro3")
rc, out = rodar(R3, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(cofre)})
checar("COFRE_DIR não vazio (o cofre real): recusa", rc != 0 and "não está vazio" in out, out[-300:])
rc, out = rodar(R3, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(BASE / "cofre_tmp3"), "TREINO_NAO_DETERMINISTICO": "1"})
checar("treino não determinístico: DIFERENTE informado, 07 usa o congelado, 0 diferenças", rc == 0 and "DIFERENTE" in out and "0 diferença(s)" in out, out[-600:])
R4 = copia("repro4")
(R4 / "analise/07_testes.py").write_text(S["07_testes.py"].replace('conf["valor"].mean()', 'conf["valor"].mean() + 0.01'), encoding="utf-8")
rc, out = rodar(R4, ["analise/rodar_tudo.py", "--reproducao"], {"COFRE_DIR": str(BASE / "cofre_tmp4")})
checar("script alterado: DIFERE e código 1; cofre temporário apagado mesmo assim", rc == 1 and "DIFERE" in out and not (BASE / "cofre_tmp4").exists(), out[-600:])
checar("NaN = NaN e dict aninhado: sem falso DIFERE", "DIFERE  08_triangulacao.json" not in out, out[-600:])
shutil.move(str(R4 / "resultados_ref"), str(R4 / "ref_renomeada"))
rc, out = rodar(R4, ["analise/comparar_resultados.py"])
checar("comparar sem resultados_ref/: erro, nunca '0 diferenças'", rc != 0 and "nenhum JSON" in out, out[-300:])
shutil.move(str(R4 / "ref_renomeada"), str(R4 / "resultados_ref"))
rc, out = rodar(BASE, [str(R4 / "analise/comparar_resultados.py")])
checar("comparar rodado de outra pasta usa a raiz do projeto", "DIFERE" in out and "nenhum JSON" not in out, out[-300:])

print("== D. Rota sem partição ==")
SP = {k: v for k, v in S.items() if k != "04_particionar.py"}
SP["07_testes.py"] = S["07_testes.py"].replace("dados/processados/confirmacao.csv", "dados/processados/limpo.csv")
SP["05_eda.py"] = S["05_eda.py"].replace("exploracao.csv", "limpo.csv")
rodar_sp = RODAR.replace("COM_PARTICAO = True", "COM_PARTICAO = False").replace('"04_integrar.py", "04_particionar.py",', '"04_integrar.py",')
Q = BASE / "sem_particao"
montar(Q, SP, rodar_sp)
(Q / "saidas/06-ficha-modelo.travado.md").write_text("ficha\n", encoding="utf-8")
(Q / "modelos").mkdir(); (Q / "modelos/M01.bin").write_text("modelo-42", encoding="utf-8")
rc, out = rodar(Q, ["analise/rodar_tudo.py"])
checar("sem partição: roda até a 08 sem cofre e sem COFRE_DIR", rc == 0 and "08_triangulacao" in out, out[-400:])
shutil.copytree(Q / "resultados", Q / "resultados_ref")
limpar(Q / "resultados"); limpar(Q / "dados/processados")
rc, out = rodar(Q, ["analise/rodar_tudo.py", "--reproducao"])
checar("sem partição: reprodução roda sem COFRE_DIR e bate", rc == 0 and "0 diferença(s)" in out, out[-600:])

limpar(BASE)
print(f"\n{sum(ok_total)} de {len(ok_total)} checagens passaram")
sys.exit(0 if all(ok_total) else 1)
