# Formato do modelo: `ani9-roadmap`, versão 1

O modelo é um arquivo JSON em UTF-8, gravado em `models/<chave>.json`. O nome
do arquivo, sem `.json`, é a chave do modelo e só pode ter a-z, 0-9 e hífen.

O validador (`scripts/validate.mjs`) confere tudo o que está aqui, e o ANI-9
valida de novo ao carregar os modelos. No app, quem clica em **Usar modelo**
recebe uma cópia própria, montada assim no quadro:

- os tópicos ficam numa coluna, ligados em ordem por setas;
- os subtópicos de cada tópico ficam à direita dele, cada um com uma seta
  vinda do tópico;
- cada item de `links` acrescenta mais uma seta.

```json
{
  "format": "ani9-roadmap",
  "version": 1,
  "title": "Back-end com Node.js",
  "summary": "Para quem já programa e quer construir e publicar APIs em Node.js.",
  "area": "tecnologia",
  "level": "intermediario",
  "topics": [
    {
      "title": "HTTP",
      "summary": "O protocolo de pedidos e respostas da web. Você domina quando lê uma troca de mensagens e sabe dizer o que cada parte faz.",
      "resources": [
        { "kind": "teoria", "title": "MDN: Visão geral do HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview" },
        { "kind": "pratica", "title": "Tutorial do curl", "url": "https://curl.se/docs/tutorial.html" }
      ],
      "subtopics": [
        { "title": "Métodos", "summary": "GET, POST, PUT, PATCH, DELETE e quando cada um é seguro ou idempotente." },
        { "title": "Códigos de status", "summary": "As famílias 2xx, 3xx, 4xx e 5xx." }
      ]
    }
  ],
  "links": [{ "from": "Códigos de status", "to": "Tratamento de erros" }]
}
```

## Campos

| Campo | Obrigatório | Regra |
|---|---|---|
| `format` | sim | sempre `"ani9-roadmap"` |
| `version` | sim | sempre `1` |
| `title` | sim | até 120 caracteres; é o nome do modelo na lista |
| `summary` | recomendado | até 400 caracteres: para quem é e aonde leva |
| `area` | sim | tema, para o filtro da lista: um dos valores da tabela abaixo |
| `level` | sim | nível: `"iniciante"`, `"intermediario"`, `"avancado"` ou `"completo"` (do básico ao avançado) |
| `topics` | sim | de 1 a 60 itens, em ordem de aprendizagem |
| `topics[].title` | sim | até 120 caracteres (no quadro, prefira até 60) |
| `topics[].summary` | sim | até 400 caracteres |
| `topics[].resources` | sim: ao menos uma de teoria e uma de prática | até 12 itens |
| `topics[].subtopics` | não | até 30 itens, cada um com `title`, `summary` e `resources` |
| `resources[].kind` | sim | `"teoria"` ou `"pratica"`, sem acento |
| `resources[].title` | sim | até 120 caracteres: nome claro da fonte |
| `resources[].url` | sim | `https://…` completo, até 500 caracteres |
| `links` | não | até 200 itens `{ "from", "to" }`, com títulos de cartões existentes |

## Temas (`area`)

São temas amplos de propósito: o ANI-9 serve para estudar qualquer assunto,
não um nicho. Escolha o que mais se aproxima; na dúvida, `"outros"`.

| Valor | Tema na tela |
|---|---|
| `exatas` | Exatas e matemática |
| `natureza` | Ciências da natureza |
| `saude` | Saúde |
| `humanidades` | Humanidades |
| `linguas` | Línguas e comunicação |
| `direito` | Direito |
| `negocios` | Negócios e finanças |
| `tecnologia` | Tecnologia |
| `engenharia` | Engenharia |
| `artes` | Artes e design |
| `educacao` | Educação |
| `concursos` | Concursos e vestibulares |
| `outros` | Outros |

Mais regras:

- O modelo tem no máximo 400 cartões.
- Nos `links`, os títulos são comparados sem diferenciar maiúsculas de
  minúsculas. Se dois cartões tiverem o mesmo título, vale o primeiro; por
  isso, evite títulos repetidos.
- Ligações para títulos que não existem são ignoradas ao montar o quadro; o
  validador as aponta como erro.
