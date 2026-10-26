# Formato do modelo: `ani9-roadmap`, versão 2

O modelo é um arquivo JSON em UTF-8, gravado em `models/<chave>.json`. O nome
do arquivo, sem `.json`, é a chave do modelo e só pode ter a-z, 0-9 e hífen.

O validador (`scripts/validate.mjs`) confere tudo o que está aqui, e o ANI-9
valida de novo ao carregar os modelos. A versão 1 ainda é aceita, mas todo
modelo novo ou revisado usa a versão 2.

## Como o modelo vira um mapa

No app, quem clica em **Usar modelo** recebe uma cópia própria, montada assim
no quadro:

- os **tópicos** formam a espinha do mapa, de cima para baixo, ligados em ordem
  por setas contínuas;
- os **subtópicos** de cada tópico ficam numa coluna ao lado dele, alternando
  direita e esquerda (o 1º tópico abre para a direita, o 2º para a esquerda…),
  ligados por setas tracejadas;
- um subtópico pode ter **seus próprios subtópicos** (um nível a mais), numa
  coluna mais para fora: as opções de uma escolha ou as partes de um assunto;
- a **marcação** de um cartão (recomendado, alternativa, opcional) aparece no
  cartão e na legenda do quadro;
- cada item de `links` acrescenta mais uma seta.

**Todo cartão é clicável e tem conteúdo próprio**, seja tópico ou subtópico, em
qualquer nível: um resumo e as fontes daquele assunto.

```json
{
  "format": "ani9-roadmap",
  "version": 2,
  "title": "Back-end com Node.js",
  "summary": "Para quem já programa e quer construir e publicar APIs em Node.js.",
  "area": "tecnologia",
  "level": "intermediario",
  "topics": [
    {
      "title": "HTTP",
      "summary": "O protocolo de pedidos e respostas que toda API web usa. Entender métodos, cabeçalhos e códigos de status é o que permite desenhar rotas previsíveis e depurar o que chega ao servidor.",
      "resources": [
        { "kind": "teoria", "format": "oficial", "title": "MDN: Visão geral do HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview" },
        { "kind": "pratica", "format": "exercicio", "title": "Tutorial do curl", "url": "https://curl.se/docs/tutorial.html" }
      ],
      "subtopics": [
        {
          "title": "Métodos HTTP",
          "summary": "GET, POST, PUT, PATCH e DELETE dizem a intenção do pedido. Saber quais são seguros e idempotentes evita, por exemplo, cobrar duas vezes quando o cliente repete um pedido.",
          "resources": [
            { "kind": "teoria", "format": "oficial", "title": "MDN: Métodos de requisição HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods" }
          ]
        }
      ]
    },
    {
      "title": "Banco de dados",
      "summary": "…",
      "resources": ["…"],
      "subtopics": [
        {
          "title": "Bancos relacionais",
          "summary": "…",
          "resources": ["…"],
          "subtopics": [
            { "title": "PostgreSQL", "marker": "recomendado", "summary": "…", "resources": ["…"] },
            { "title": "MySQL", "marker": "alternativa", "summary": "…", "resources": ["…"] }
          ]
        }
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
| `version` | sim | `2` (a `1` ainda é aceita) |
| `title` | sim | até 120 caracteres; é o nome do modelo na lista |
| `summary` | recomendado | até 400 caracteres: para quem é e aonde leva |
| `area` | sim | tema, para o filtro da lista: um dos valores da tabela abaixo |
| `level` | sim | `"iniciante"`, `"intermediario"`, `"avancado"` ou `"completo"` (do básico ao avançado) |
| `topics` | sim | de 1 a 60 itens, em ordem de aprendizagem |
| `topics[].subtopics` | não | até 30 itens; quantos o assunto pedir |
| `topics[].subtopics[].subtopics` | não | até 30 itens; é o último nível |
| *cartão*`.title` | sim | até 120 caracteres (no quadro, prefira até 60); único no modelo |
| *cartão*`.summary` | sim (v2) | até 400 caracteres, um parágrafo |
| *cartão*`.marker` | não | `"recomendado"`, `"alternativa"` ou `"opcional"` |
| *cartão*`.resources` | sim (v2): ao menos uma | até 12 itens (ideal: até 8) |
| tópico`.resources` | sim | ao menos uma de `teoria` e uma de `pratica` |
| `resources[].kind` | sim | `"teoria"` (ler, assistir) ou `"pratica"` (fazer), sem acento |
| `resources[].format` | sim (v2) | o que a fonte é: veja a tabela abaixo |
| `resources[].title` | sim | até 120 caracteres: nome claro da fonte |
| `resources[].url` | sim | `https://…` completo, até 500 caracteres |
| `links` | não | até 200 itens `{ "from", "to" }`, com títulos de cartões existentes |

*Cartão* é qualquer tópico ou subtópico, em qualquer nível.

## Formato das fontes (`format`)

Aparece como etiqueta ao lado da fonte. No painel do cartão, as fontes são
listadas nesta ordem.

| Valor | Na tela | Quando usar |
|---|---|---|
| `oficial` | Oficial | documentação, especificação, guia ou norma de quem mantém o assunto |
| `codigo` | Código | repositório aberto para ler ou rodar |
| `artigo` | Artigo | texto de referência de terceiros |
| `curso` | Curso | curso gratuito, ou com trilha gratuita útil |
| `video` | Vídeo | aula ou palestra com autoria clara |
| `podcast` | Podcast | episódio específico |
| `livro` | Livro | livro aberto, ou capítulo gratuito |
| `exercicio` | Exercício | algo para fazer: tutorial guiado, lista, laboratório, desafio |

`kind` e `format` dizem coisas diferentes: `kind` é o uso no estudo (ler ou
fazer), `format` é o que a fonte é. Um tutorial oficial em que se escreve
código é `pratica` + `oficial`; um livro é `teoria` + `livro`.

## Marcações (`marker`)

A legenda do quadro, como num roadmap impresso. A maioria dos cartões não tem.

| Valor | Na tela | Quando usar |
|---|---|---|
| `recomendado` | Recomendado | entre opções equivalentes, a escolha sugerida para começar |
| `alternativa` | Alternativa | serve no lugar da recomendada: escolha uma |
| `opcional` | Opcional | aprenda quando precisar ou em qualquer ordem; não trava o caminho |

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

## Mais regras

- O modelo tem no máximo 400 cartões.
- Títulos são únicos no modelo: as ligações (`links`) usam o título. Eles são
  comparados sem diferenciar maiúsculas de minúsculas.
- Ligações para títulos que não existem são erro no validador e são ignoradas
  ao montar o quadro.
- A mesma URL não se repete no modelo: cada cartão aponta para a parte da
  fonte que trata dele (a seção, o capítulo, a página).

## Versão 1

A versão 1 não tem `format`, `marker` nem o terceiro nível, e só exige
resumo e fontes nos tópicos. O app e o validador continuam aceitando, mas o
validador avisa para migrar.
