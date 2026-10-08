# Verificador de consistência do kit: links, referências a arquivos, contagens, termos obsoletos e sintaxe dos blocos Python
# uso: python verificacao/consistencia.py      (esperado: "OK: nenhum problema")
import pathlib, re, sys, textwrap

sys.stdout.reconfigure(encoding="utf-8")
RAIZ = pathlib.Path(__file__).resolve().parents[1]
# dois leiautes: o de desenvolvimento, com o kit em fluxo/, e o do repositório publicado, com o kit na raiz
if (RAIZ / "fluxo").is_dir():
    FLUXO = RAIZ / "fluxo"
    kit = sorted(FLUXO.rglob("*.md"))
else:
    FLUXO = RAIZ
    kit = [RAIZ / "AGENTS.md"] + sorted(p for sub in ("etapas", "templates", "referencias") for p in (RAIZ / sub).rglob("*.md"))
extras = [RAIZ / "README.md", RAIZ / "CLAUDE.md", RAIZ / "apresentacao" / "roteiro.md"]
arquivos = kit + [p for p in extras if p.exists() and p not in kit]
problemas = []

# 1. links markdown relativos
for a in arquivos:
    txt = a.read_text(encoding="utf-8")
    for alvo in re.findall(r"\]\(([^)#\s]+)(?:#[^)]*)?\)", txt):
        if alvo.startswith(("http://", "https://", "mailto:")):
            continue
        if not (a.parent / alvo).resolve().exists():
            problemas.append(f"link quebrado: {a.relative_to(RAIZ)} -> {alvo}")

# 2. referências textuais a arquivos do kit (templates/X.md no CLAUDE.md é exemplo, não referência)
for a in arquivos:
    txt = a.read_text(encoding="utf-8")
    for pasta, nome in re.findall(r"(templates|etapas|referencias)/([A-Za-z0-9_.-]+\.md)", txt):
        if nome != "X.md" and not (FLUXO / pasta / nome).exists():
            problemas.append(f"referência inexistente: {a.relative_to(RAIZ)} -> {pasta}/{nome}")

# 3. contagens
cont = {p: len(list((FLUXO / p).glob("*.md"))) for p in ("etapas", "templates", "referencias")}
esperado = {"etapas": 13, "templates": 18, "referencias": 7}
for p, n in cont.items():
    if n != esperado[p]:
        problemas.append(f"contagem: {p} tem {n}, esperado {esperado[p]}")

# 4. termos obsoletos (o Histórico do CLAUDE.md cita versões antigas de propósito: fica de fora)
obsoletos = {
    r"G5\.\.G7|G5\.\.HEAD|G5\.\.G8": "diff do auditor parte do SHA de trava-registro",
    r"estado do G7": "cópia de auditoria na tag G8-auditoria",
    r"confirma só 51%|≈ 0,51": "com δ = m, o poder da regra é ~50%",
    r"α/m\b": "notação antiga (usar α/k)",
    r"confirmada por ele": "âncora: o humano cola o hash",
    r"etapa 03 §6|§6 da etapa 03|03 §7\): a base|\(§7, comparações": "seções do template 03: comparações §3, harmonização §7",
    r"cada ciclo usa α/2|este ciclo usa α/2|multiplicidade somada": "reserva de α: α' = α/2 substitui α em tudo",
    r"tag `G6`|origin G6|tag `G5` enviada|origin G5\b": "travas usam trava-registro / trava-modelo",
    r"scripts numerados": "o pipeline roda por rodar_tudo.py",
    r"SHA do commit da tag": "SHA da tag (objeto-tag em tag anotada)",
    r"MODELOS_DIR": "a 06 decide sozinha onde grava (modelos/ ou modelos_regerado/)",
    r"idealmente com proteção de tags|de preferência com proteção": "remoto só vale com proteção de tags testada no G0",
}
for a in arquivos:
    if a.name == "CLAUDE.md":
        continue
    txt = a.read_text(encoding="utf-8")
    for padrao, motivo in obsoletos.items():
        for m in re.finditer(padrao, txt):
            linha = txt.count("\n", 0, m.start()) + 1
            problemas.append(f"obsoleto: {a.relative_to(RAIZ)}:{linha} '{m.group(0)}' ({motivo})")

# 5. blocos Python compilam (os de dentro de listas vêm indentados)
for a in kit:
    for i, bloco in enumerate(re.findall(r"```python\n(.*?)```", a.read_text(encoding="utf-8"), flags=re.S), 1):
        try:
            compile(textwrap.dedent(bloco), f"{a.name}#py{i}", "exec")
        except SyntaxError as e:
            problemas.append(f"sintaxe: {a.relative_to(RAIZ)} bloco {i}: {e}")

print(f"{len(arquivos)} arquivos verificados · contagens {cont}")
print("\n".join(problemas) if problemas else "OK: nenhum problema")
sys.exit(1 if problemas else 0)
