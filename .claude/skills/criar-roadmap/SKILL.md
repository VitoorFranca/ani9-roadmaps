---
name: "criar-roadmap"
description: "Cria ou revisa uma semente de roadmap didático do catálogo ani9-roadmaps a partir de um tema: o escopo (o destino, os marcos do caminho em ordem e o que fica de fora) e só o primeiro módulo, com resumo, objetivos, critérios de avaliação e fontes próprias verificadas em cada passo, em models/<chave>.json (formato 4). Use quando pedirem para criar, gerar, montar, revisar ou melhorar um roadmap, trilha ou modelo de estudo do catálogo sobre qualquer assunto."
argument-hint: "Tema [público/nível] [objetivo]"
user-invocable: true
disable-model-invocation: false
---

# Criar roadmap

## Entrada

```text
$ARGUMENTS
```

Você recebe um tema e, às vezes, o público, o nível ou o objetivo. O resultado
é **uma semente do catálogo**: um arquivo JSON em `models/<chave>.json` deste
repositório ([ani9-roadmaps](https://github.com/VitoorFranca/ani9-roadmaps),
público, CC BY 4.0), no formato 4 de [`docs/formato.md`](../../../docs/formato.md).

## O que é uma semente

No [ANI-9](https://www.ani9.online), um roadmap didático não é publicado
inteiro: ele cresce com a pessoa.

- Ele tem um **escopo**: o destino (o que a pessoa vai conseguir fazer quando
  acabar), os **marcos** do caminho, em ordem, e o que ficou de fora. É o
  escopo que faz o roadmap ter fim.
- Ele é feito de **módulos**, cada um com os seus passos. Só o **primeiro
  módulo** existe no começo.
- Cada módulo seguinte é feito pelo tutor do ANI-9, um por vez, depois que a
  pessoa termina o atual, e para aquela pessoa.

A semente é o que o catálogo guarda: **o escopo e o primeiro módulo**. Quem
clica em **Começar** (Roadmaps → Roadmaps didáticos) recebe os dois. Você não
escreve os outros módulos: escreve um bom ponto de partida.

O app também permite criar um roadmap do zero com o assistente. O catálogo é
para pontos de partida públicos, que servem a qualquer pessoa.

Não prometa efeito didático ("você vai memorizar 2× mais"). O roadmap
organiza o estudo; ganho de aprendizagem é hipótese, não fato comprovado.

## Procedimento

1. **Entender o pedido e preparar o repositório.**
   - Identifique tema, público, nível de partida e objetivo. Se faltar algo,
     assuma: de iniciante a profissional júnior, texto em português, fontes em
     português quando forem tão boas quanto, e em inglês quando forem a
     referência. Diga as suposições no relatório.
   - `git checkout main && git pull --ff-only`; veja `ls models/`. Se já
     existe uma semente do tema, **revise esse arquivo** em vez de criar outro.

2. **Mapear a área** (WebSearch e WebFetch): guias e currículos oficiais (o
   guia do exame, se for uma certificação), documentação oficial, ementas de
   universidades, livros-texto, e roadmaps conhecidos da área, inclusive o
   [roadmap.sh](https://roadmap.sh), para conferir cobertura e ordem.

   **Estude o método, nunca copie o conteúdo.** A licença do roadmap.sh só
   permite uso pessoal: não copie textos, listas de cartões nem listas de
   fontes de lá, nem de outros roadmaps.

3. **Propor o escopo e confirmar com a pessoa antes de escrever.**
   - **Destino:** uma frase que dê para conferir ("Publicar uma API em Go com
     testes"), não o nome de um assunto.
   - **Marcos:** de 4 a 12, em ordem de aprendizagem. Cada um depende só dos
     anteriores, e o último chega ao destino. Títulos curtos, com o termo que
     a área usa. Nada de "Conceitos básicos" ou "Avançado".
   - **Fora:** o que alguém esperaria encontrar e não está no caminho.

   Mostre o escopo e espere o sim. O escopo é o contrato do roadmap: tudo o
   que vier depois é criado dentro dele.

4. **Esboçar o primeiro módulo**, para o primeiro marco: de 3 a 8 passos em
   ordem de estudo, cerca de uma a duas semanas. Uma lista só com títulos e
   marcações, como esta:

   ```text
   Módulo: Consultas com SELECT
   - Tabelas, linhas e tipos
   - SELECT, WHERE e ORDER BY
   - Escolha um cliente
     - psql [recomendado]
     - DBeaver [alternativa]
   - Funções de texto e de data [opcional]
   ```

   - Cada passo é uma coisa só, que dá para estudar em uma ou duas sessões.
   - Um passo pode agrupar opções de uma escolha (`"choice": true`, com uma
     `recomendado` e as outras `alternativa`) ou partes de um assunto. Esse é
     o último nível.
   - O que não trava o caminho é `opcional`. A maioria dos passos fica sem
     marcação.
   - Pré-requisito fora da sequência vai em `requires`, apontando para outro
     passo do módulo.

5. **Escrever cada passo.**
   - `summary`: um parágrafo, de 2 a 3 frases, até 400 caracteres. Diga o que
     é e por que importa ou quando se usa. Sem fórmula repetida, sem ensinar a
     matéria inteira.
   - `objectives`: de 1 a 3 frases sobre o que a pessoa passa a conseguir
     fazer, começando por um verbo que se possa observar ("Explicar…",
     "Escrever…"). Nada de "entender" ou "conhecer".
   - `criteria`: de 2 a 4. Cada um diz o que a pessoa precisa mostrar numa
     conversa por escrito (`text`), de que tipo é (`kind`: explicar, aplicar,
     comparar, depurar, construir; nunca decorar ou reconhecer) e o que a
     resposta certa precisa trazer (`expect`: os pontos essenciais, concretos;
     é o gabarito do tutor). O `expect` só afirma o que as fontes sustentam.
   - `id`: slug estável e único no arquivo.

6. **Escolher as fontes de cada passo.** Siga
   [`references/fontes.md`](references/fontes.md).
   - Todo passo: ao menos uma fonte própria, que trate daquele assunto (a
     seção ou a página certa, não a inicial do site). Tipicamente de 2 a 4.
   - O módulo: ao menos uma de `teoria` e uma de `pratica`.
   - `format` em toda fonte; oficial primeiro.
   - **Abra cada link** (WebFetch) e confirme que existe, trata do passo e é
     gratuito. **Nunca invente URLs** nem as deduza pelo padrão de outras. A
     mesma URL não se repete no arquivo.

7. **Gravar** em `models/<chave>.json`: `"version": 4`, `"revision": 1` (some 1
   ao revisar uma semente já publicada, e nunca mude o `id` de um cartão
   publicado), `area` e `level` com os valores de `docs/formato.md`, `scope` e
   `module`, com `closes` no primeiro marco. Indentação de 2 espaços. A
   `<chave>` é o tema em slug, como `sql-com-postgresql`. Acrescente o roadmap
   à tabela "Roadmaps" do `README.md`.

8. **Validar e conferir as fontes.** Na raiz do repositório:

   ```bash
   node scripts/validate.mjs models/<chave>.json --titles
   ```

   - Corrija **todos os erros** até "Sem erros.".
   - Leia a saída `TÍTULO`: para cada fonte, o nome dado e o título real da
     página. Se a página não é sobre o passo, troque a fonte.
   - Quando um site bloquear a verificação (HTTP 403/429), confirme com
     WebFetch.

9. **Revisar** com [`references/qualidade.md`](references/qualidade.md).

10. **Publicar, só se a pessoa pedir.** O repositório é público: nada vai
    para o GitHub sem pedido explícito. Branch `roadmap/<chave>`; commit do
    arquivo e do README, adicionados pelo nome; `gh pr create` seguindo o
    modelo de pull request. O merge fica com quem mantém o catálogo.

11. **Relatar**, em poucas linhas: onde o arquivo foi salvo; o destino e os
    marcos; os passos do primeiro módulo; quantas fontes e de que tipos; as
    suposições; o que ficou de fora; o link do pull request, se houve.

## Erros comuns

- **Destino que é um assunto** ("Aprender SQL") em vez de algo que dê para
  conferir.
- **Marcos demais**, ou genéricos: o escopo deixa de mostrar o fim.
- **Escrever mais de um módulo.** A semente tem um; os outros são do tutor.
- **Primeiro módulo de "introdução"**, sem nada para fazer. Ele já leva ao
  primeiro marco.
- **Passo sem fonte própria**, ou com a página inicial de um site enorme.
- **Fonte de "prática" que é só leitura.** Prática exige que a pessoa faça
  algo.
- **Critério de decorar** ("cite os comandos") em vez de explicar ou aplicar.
- **Resumos de molde:** a mesma estrutura de frase em todos os passos.
- Copiar a estrutura ou os textos de outro roadmap.
