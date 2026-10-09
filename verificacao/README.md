# Verificação do kit

Ferramentas para conferir o kit depois de qualquer edição nos arquivos do kit. **Não fazem parte do kit**: servem a quem o mantém. Rodam da raiz do projeto, com Python 3.11 e pandas, e usam só pastas temporárias do sistema.

| Script | O que confere | Resultado esperado |
|---|---|---|
| `consistencia.py` | links e referências entre arquivos; contagem de etapas, templates e referências (13 · 18 · 7); termos obsoletos; sintaxe de todo bloco Python do kit | `OK: nenhum problema` |
| `teste_kit.py` | o código **como publicado** no kit, extraído do texto: `rodar_tudo.py`, partição selada, saída do modelo, `comparar_resultados.py` e `sorteio.py`. Roda num projeto simulado: fluxo normal, cofre compactado, modelo congelado, sorteio, reprodução, ciclo 2 e rota sem partição | todas as checagens passam (29) |
| `teste_download.py` | `obter()`, `registrar()` e `checar_deriva()` do catálogo §8, com URLs `file://`, sem rede | todas as checagens passam (8) |

```text
python verificacao/consistencia.py
python verificacao/teste_kit.py
python verificacao/teste_download.py
```

**Quando rodar:**
- depois de mudar qualquer bloco de código do kit: os três;
- depois de mudar texto: `consistencia.py`.

O `teste_kit.py` acha os blocos pelo comentário da primeira linha (ex.: `# analise/rodar_tudo.py`). Se esse comentário mudar no kit, ajuste o marcador em `bloco(...)`.
