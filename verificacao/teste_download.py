# Testa obter(), registrar() e checar_deriva() do catálogo §8, no texto publicado, com URLs file:// (sem rede)
# uso: python verificacao/teste_download.py      (esperado: todas as checagens passam; roda numa pasta temporária)
import os, pathlib, re, shutil, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")
KIT = pathlib.Path(__file__).resolve().parents[1] / "fluxo"
if not KIT.is_dir():  # repositório publicado: o kit fica na raiz
    KIT = KIT.parent
W = pathlib.Path(tempfile.gettempdir()) / "kit_dados_teste_download"
shutil.rmtree(W, ignore_errors=True)
(W / "fonte").mkdir(parents=True)
os.chdir(W)
codigo = next(b for b in re.findall(r"```python\n(.*?)```", (KIT / "referencias/catalogo-fontes-externas.md").read_text(encoding="utf-8"), flags=re.S) if "def obter" in b)
ns = {}
exec(codigo, ns)
obter, registrar, sha256, checar_deriva = ns["obter"], ns["registrar"], ns["sha256"], ns["checar_deriva"]

ok = []
def checar(nome, cond):
    ok.append(bool(cond)); print(f"{'PASSA' if cond else 'FALHA'}  {nome}")

fa, fb = W / "fonte/F01.csv", W / "fonte/F02.csv"
fa.write_text("uf;valor\nSP;100\n", encoding="utf-8"); fb.write_text("uf;valor\nRJ;50\n", encoding="utf-8")
pathlib.Path("dados/externos").mkdir(parents=True)
for f in (fa, fb):
    registrar(obter(f.as_uri(), f"dados/externos/{f.name}"), f.as_uri(), "CC BY", "2026", "tudo")
h = {f.name: sha256(f"dados/externos/{f.name}") for f in (fa, fb)}
checar("1º download registra no manifesto", len(open("dados/externos/manifesto.jsonl", encoding="utf-8").readlines()) == 2)

fa.write_text("uf;valor\nSP;101\n", encoding="utf-8"); fb.write_text("uf;valor\nRJ;51\n", encoding="utf-8")   # deriva nas duas fontes
for f in (fa, fb):
    obter(f.as_uri(), f"dados/externos/{f.name}", h[f.name])
checar("reprodução: arquivo com o hash do manifesto não é baixado de novo", all(sha256(f"dados/externos/{n}") == v for n, v in h.items()))

div = checar_deriva(pasta="deriva")
checar("checar_deriva lista as DUAS divergências, sem parar na primeira", len(div) == 2)
checar("a cópia guardada continua intacta", all(sha256(f"dados/externos/{n}") == v for n, v in h.items()))
checar("o novo fica como .parcial na pasta de deriva", (W / "deriva/F01.csv.parcial").exists() and not (W / "deriva/F01.csv").exists())

try:
    obter(fa.as_uri(), "dados/externos/F01.csv", h["F01.csv"], rebaixar=True)
    checar("rebaixar=True no lugar, com hash divergente, interrompe", False)
except SystemExit:
    checar("rebaixar=True no lugar, com hash divergente, interrompe sem sobrescrever", sha256("dados/externos/F01.csv") == h["F01.csv"])

(W / "fonte/F03.csv").write_text("uf;valor\nMG;70\n", encoding="utf-8")
pathlib.Path("dados/externos/F03.csv.parcial").write_text("uf;valor\nMG;", encoding="utf-8")   # download interrompido antes
p = obter((W / "fonte/F03.csv").as_uri(), "dados/externos/F03.csv")
checar("download interrompido não vira arquivo final truncado", p.read_text(encoding="utf-8").endswith("MG;70\n"))

(W / "fonte/F02.csv").unlink()                                                    # fonte fora do ar
div = checar_deriva(pasta="deriva2")
checar("fonte fora do ar entra na lista, sem derrubar a checagem", len(div) == 2 and any("F02" in d for d in div))

os.chdir(tempfile.gettempdir())
shutil.rmtree(W, ignore_errors=True)
print(f"\n{sum(ok)} de {len(ok)} checagens passaram")
sys.exit(0 if all(ok) else 1)
