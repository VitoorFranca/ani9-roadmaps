# Roadmaps do ANI-9

Catálogo aberto de roadmaps de estudo: o caminho de um assunto em ordem de
aprendizagem, com tópicos, subtópicos, um resumo direto de cada passo e fontes
de **teoria** e de **prática**.

No [ANI-9](https://www.ani9.online), estes roadmaps aparecem em
**Roadmaps → Modelos do ANI-9**. Quem clica em **Usar modelo** recebe uma cópia
própria para estudar, marcar o progresso e editar à vontade. Os arquivos também
servem fora do app: são JSON simples e legíveis.

## Roadmaps

| Roadmap | Tema | Nível | Arquivo |
|---|---|---|---|
| Back-end com Go | Tecnologia | Do básico ao avançado | [`models/back-end-go.json`](models/back-end-go.json) |
| Claude Certified Architect – Foundations (CCAR-F) | Tecnologia | Do básico ao avançado | [`models/claude-certified-architect-foundations.json`](models/claude-certified-architect-foundations.json) |

O catálogo é para **qualquer área do conhecimento**, não para um nicho. Os
temas vão de exatas, ciências da natureza, saúde e humanidades a línguas,
direito, negócios, engenharia, artes, educação e concursos. Sugestões de
roadmaps são bem-vindas.

## Estrutura

```
models/              um arquivo por roadmap (models/<chave>.json)
docs/formato.md      o formato "ani9-roadmap", campo a campo
scripts/validate.mjs validador: formato, limites, teoria + prática, links
CONTRIBUTING.md      como contribuir e o que é um bom roadmap
.claude/skills/      skill criar-roadmap para o Claude Code
```

## Validar

Só é preciso Node 20 ou mais novo, sem instalar nada:

```bash
node scripts/validate.mjs                        # todos os modelos
node scripts/validate.mjs models/back-end-go.json --check-links
```

O CI valida todo pull request e, uma vez por semana, abre cada link do
catálogo. Quando algum link quebra, ele abre uma issue.

## Como o ANI-9 usa este repositório

O app inclui este repositório numa **versão fixa**, como submódulo. Uma mudança
aqui só chega ao app quando a versão é atualizada lá e o app é publicado.
Assim, nenhum modelo entra no ar sem passar pelos testes do app.

## Criar um roadmap com o Claude Code

O repositório traz a skill [`criar-roadmap`](.claude/skills/criar-roadmap/SKILL.md).
Com o [Claude Code](https://code.claude.com) aberto na raiz do repositório, rode:

```
/criar-roadmap <tema> [público/nível] [objetivo]
```

A skill pesquisa o assunto, desenha o caminho, escreve os resumos, abre e
confere cada fonte, grava `models/<chave>.json` e roda o validador. Ela só abre
um pull request se você pedir. O resultado segue as mesmas regras do
[CONTRIBUTING.md](CONTRIBUTING.md) e passa pela mesma revisão de qualquer
contribuição.

## Contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

- **Roadmaps** (`models/`, `docs/`): [CC BY 4.0](LICENSE). Pode copiar,
  adaptar e usar, inclusive comercialmente, desde que cite a fonte
  ("Roadmaps do ANI-9").
- **Scripts** (`scripts/`): [MIT](scripts/LICENSE).

As fontes indicadas pertencem aos seus autores. Os roadmaps só apontam para
elas.
