---
name: "criar-roadmap"
description: "Cria ou revisa um roadmap de estudo do catálogo ani9-roadmaps a partir de um tema: um mapa com tópicos em ordem, subtópicos na granularidade que o assunto pede, e em cada cartão um resumo de um parágrafo e fontes próprias verificadas e tipadas, em models/<chave>.json (formato 3, o do roadmap didático, com objetivos e critérios de avaliação em cada passo). Use quando pedirem para criar, gerar, montar, revisar ou melhorar um roadmap, trilha ou modelo de estudo sobre qualquer assunto."
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
é **um roadmap do catálogo**: um arquivo JSON em `models/<chave>.json` deste
repositório ([ani9-roadmaps](https://github.com/VitoorFranca/ani9-roadmaps),
público, CC BY 4.0), no formato 3 de [`docs/formato.md`](../../../docs/formato.md).

No [ANI-9](https://www.ani9.online), o roadmap aparece em **Roadmaps → Modelos
didáticos**. Quem clica em **Começar** segue o roadmap em etapas: cada tópico
é uma etapa, cada cartão abaixo dele é um passo com resumo, objetivos e
fontes, e a etapa seguinte só abre quando a atual termina. O tutor do ANI-9
avalia cada passo pelos **critérios** escritos no modelo. O catálogo é para
qualquer área do conhecimento, não para um nicho.

## O que é um bom roadmap

Um roadmap é um **mapa do território com as fontes certas em cada ponto**.
Não é uma apostila (não ensina a matéria) nem uma lista de links (organiza e
escolhe). Os roadmaps profissionais mais usados seguem um mesmo método, que
este catálogo adota:

1. **Todo cartão tem conteúdo próprio.** Tópico ou subtópico, em qualquer
   nível: um parágrafo que diz o que é e por que importa, e fontes que tratam
   *daquele* assunto. Um subtópico sem fonte é um beco sem saída.
2. **A granularidade vem do assunto, não de uma cota.** Um tópico pode ter 2
   subtópicos e o seguinte, 12. Quando há muitos, eles se agrupam num
   subtópico com subtópicos próprios (o terceiro nível): as opções de uma
   escolha (PostgreSQL, MySQL…) ou as famílias de um assunto (relacionais,
   documentos, chave-valor…).
3. **O caminho principal é claro, e o resto está marcado.** Entre opções
   equivalentes, uma é `recomendado` e as outras `alternativa`; o que se
   aprende quando precisar é `opcional`. A pessoa sabe o que é obrigatório.
4. **As fontes são poucas, primárias e tipadas.** Em média 2 a 4 por cartão,
   até 8 quando o assunto pede; cada uma diz o que é (oficial, código, artigo,
   curso, vídeo, podcast, livro, exercício) e se é para ler (`teoria`) ou
   fazer (`pratica`). Oficial primeiro.
5. **Relevância de hoje.** O que se usa e se pede hoje na área, não tudo o que
   existe.

Não prometa efeito didático ("você vai memorizar 2× mais"). O roadmap
organiza o estudo; ganho de aprendizagem é hipótese, não fato comprovado.

## Procedimento

1. **Entender o pedido e preparar o repositório.**
   - Identifique tema, público, nível de partida e objetivo. Se faltar algo,
     assuma: de iniciante a profissional júnior, texto em português, fontes em
     português quando forem tão boas quanto, e em inglês quando forem a
     referência. Diga as suposições no relatório.
   - Só pergunte se o tema for ambíguo a ponto de mudar o roadmap inteiro.
   - `git checkout main && git pull --ff-only`; veja `ls models/`. Se já
     existe um roadmap do tema, **revise esse arquivo** em vez de criar outro.

2. **Mapear a área antes de escrever** (WebSearch e WebFetch):
   - guias e currículos oficiais (o guia do exame, se for uma certificação: cubra
     todos os domínios e tarefas dele), documentação oficial e especificações;
   - ementas de universidades e livros-texto de referência;
   - **roadmaps conhecidos da área, inclusive o [roadmap.sh](https://roadmap.sh)**,
     para conferir cobertura e granularidade: que assuntos aparecem em vários
     deles, onde há escolhas entre opções, o que costuma ser opcional.

   **Estude o método, nunca copie o conteúdo.** A licença do roadmap.sh só
   permite uso pessoal: não copie textos, listas de cartões, ordem dos cartões
   nem listas de fontes de lá (nem de outros roadmaps). O que aparece em várias
   fontes é o núcleo; os textos e as fontes são escolhidos e escritos aqui.

3. **Escrever o esboço antes do JSON.** Uma lista indentada de três níveis, só
   com títulos e marcações, como esta:

   ```text
   - Linguagem de programação
     - Escolha uma linguagem
       - Go [recomendado]
       - Python [alternativa]
     - Tipos e estruturas de dados
   - Bancos de dados relacionais
     - SQL
     - Modelagem e normalização
     - Índices
     - Transações e ACID
     - Migrações [opcional]
   ```

   Revise o esboço com estas regras:
   - **Espinha:** tópicos em ordem de aprendizagem, cada um dependendo só dos
     anteriores. Quantos o objetivo pedir (tipicamente 8 a 25). O primeiro é a
     base real, não "Introdução"; o último é um projeto integrador.
   - **Subtópicos:** os assuntos que a pessoa precisa conhecer pelo nome e
     saber usar, na quantidade que o tópico pede (de nenhum a uns 12). Não
     iguale as quantidades entre tópicos; se todos ficaram com 4 ou 5, a cota
     ganhou do assunto.
   - **Terceiro nível:** só para opções de uma escolha ou famílias de um
     assunto. O cartão do meio também tem conteúdo (o que há em comum, como
     escolher).
   - **Marcações:** `recomendado`/`alternativa` em toda escolha entre opções;
     `opcional` no que não trava o caminho. A maioria dos cartões fica sem.
   - **Títulos:** o termo que a área usa, curto (até ~60 caracteres), único no
     roadmap. Nada de "Conceitos básicos", "Avançado", "Extras".
   - **Pré-requisitos fora da sequência:** raros. No formato 3 vão em
     `requires` no cartão que depende, apontando para um passo da mesma etapa
     ou de uma anterior.
   - O que for avançado demais para o objetivo vai no relatório como "próximos
     passos", não no roadmap.

4. **Escrever o resumo de cada cartão**, de todos os níveis: **um parágrafo**,
   de 2 a 3 frases, até 400 caracteres (tipicamente 150 a 300).
   - Diga **o que é**, em linguagem simples, e **por que importa ou quando se
     usa**. Num tópico, pode fechar com o que a pessoa deve conseguir fazer.
   - Escreva cada resumo para o seu assunto. Não repita uma fórmula em todos
     os cartões ("Você domina quando…" em série é sinal de texto de molde).
   - Não ensine a matéria inteira e não repita o título. Num cartão de opção,
     diga o que a distingue das alternativas.

5. **Escolher as fontes de cada cartão.** Siga
   [`references/fontes.md`](references/fontes.md).
   - **Todo cartão:** ao menos 1 fonte própria, que trate daquele assunto
     (a seção, o capítulo, a página certa), não a página inicial do site.
     Tipicamente 2 a 4; até 8 quando há material bom de tipos diferentes.
   - **Todo tópico:** ao menos uma de `teoria` e uma de `pratica`.
   - **`format`** em toda fonte; liste na ordem oficial, código, artigo, curso,
     vídeo, podcast, livro, exercício.
   - **Abra cada link** (WebFetch) e confirme que existe, trata do cartão e é
     gratuito (ou tem parte gratuita útil). **Nunca invente URLs** nem as
     deduza pelo padrão de outras. Os índices `llms.txt` e os sumários dos
     sites de documentação ajudam a achar a página exata.
   - A mesma URL não se repete no roadmap.

6. **Escrever objetivos e critérios de cada passo** (todo cartão abaixo de um
   tópico), a partir das fontes que você abriu:
   - `objectives`: 1 a 3 frases sobre o que a pessoa passa a conseguir fazer,
     começando pelo verbo ("Explicar…", "Configurar…"). Nada de "entender" ou
     "conhecer": use algo que se possa observar.
   - `criteria`: 2 a 4 por passo. Cada um diz o que a pessoa precisa mostrar
     numa conversa por escrito (`text`), de que tipo é (`kind`: explicar,
     aplicar, comparar, depurar, construir) e o que a resposta certa precisa
     trazer (`expect`: os pontos essenciais, concretos; é o gabarito do tutor).
   - Cubra o essencial do passo, não curiosidades. Prefira explicar e aplicar.
     Numa opção de uma escolha, um critério cobre quando escolher aquela opção.
     Num passo de projeto, use ao menos um `construir`.
   - O `expect` só afirma o que as fontes sustentam. Em assunto recente ou
     específico de um produto, confira na fonte antes de escrever.
   - Dê a cada cartão um `id` em slug, estável e único. Marque com
     `"choice": true` o cartão cujos subtópicos são opções, e use `requires`
     (ids) para um pré-requisito fora da sequência.

7. **Gravar** em `models/<chave>.json`: `"version": 3`, `"revision": 1` (some 1
   ao revisar um modelo já publicado, e nunca mude o `id` de um cartão
   publicado), `area` e `level` com os valores de `docs/formato.md`, indentação
   de 2 espaços. A `<chave>` é o tema
   em slug (a-z, 0-9, hífen), como `back-end-node`. Acrescente o roadmap à
   tabela "Roadmaps" do `README.md`.

8. **Validar e conferir as fontes.** Na raiz do repositório:

   ```bash
   node scripts/validate.mjs models/<chave>.json --titles
   ```

   - Corrija **todos os erros** até "Sem erros.". O CI roda a mesma validação
     em cada pull request.
   - Leia a saída `TÍTULO`: para cada fonte, o nome dado e o título real da
     página. Se a página não é sobre o cartão (redirecionou para a inicial,
     virou outra coisa), troque a fonte.
   - Quando um site bloquear a verificação (HTTP 403/429), confirme com
     WebFetch.

9. **Revisar** com [`references/qualidade.md`](references/qualidade.md) e
   ajustar o que falhar.

10. **Publicar, só se a pessoa pedir.** O repositório é público: nada vai para
   o GitHub sem pedido explícito.
   - Branch `roadmap/<chave>`; commit do arquivo e do README, adicionados pelo
     nome; `gh pr create` seguindo o modelo de pull request do repositório.
   - Sem permissão de escrita no repositório, `gh pr create` oferece criar um
     fork: é o caminho normal para contribuir.
   - Espere o CI passar. O merge fica com quem mantém o catálogo. Depois do
     merge, o app recebe o roadmap pela atualização automática do catálogo e
     um deploy.

11. **Relatar**, em poucas linhas: onde o arquivo foi salvo; a espinha de
    tópicos numa linha; quantos cartões, quantas fontes e quantas por tipo; as
    suposições; o que ficou de fora de propósito; o link do pull request, se
    houve.

## Erros comuns

- **Cota no lugar do assunto:** todos os tópicos com 4 ou 5 subtópicos, todos
  com 3 ou 4 fontes.
- **Subtópico sem fonte própria**, ou com a mesma fonte do tópico.
- **Resumos de molde:** a mesma estrutura de frase em todos os cartões.
- Fonte que é a página inicial de um site enorme, em vez da página do assunto.
- Fonte de "prática" que é só leitura. Prática exige que a pessoa faça algo.
- Escolhas sem marcação: cinco bancos de dados lado a lado, sem dizer que basta
  um.
- Links de busca, de login, de vídeo sem autoria clara, com rastreamento ou de
  páginas que mudam toda semana.
- Copiar a estrutura ou os textos de outro roadmap.
