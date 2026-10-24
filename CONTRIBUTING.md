# Como contribuir

Contribuições são bem-vindas: um roadmap novo, uma fonte melhor, um link
quebrado, um resumo mais claro. O catálogo vale para **qualquer área do
conhecimento**, como saúde, línguas, direito, exatas, artes ou tecnologia, e
não para um nicho.

## Caminhos

- **Corrigir algo pequeno** (link quebrado, erro de digitação, fonte melhor):
  edite o arquivo em `models/` e abra um pull request.
- **Propor um roadmap novo:** abra antes uma issue com o modelo "Sugerir
  roadmap", para combinar o escopo e evitar trabalho duplicado. Depois, envie
  o arquivo em `models/<chave>.json`.
- **Só avisar de um problema:** abra uma issue com o modelo "Link quebrado ou
  fonte ruim".

## Antes de abrir o pull request

```bash
node scripts/validate.mjs models/<chave>.json --check-links
```

O comando precisa terminar com "Sem erros.". Leia também os avisos. O CI roda
a mesma validação em todo pull request. Só é preciso Node 20 ou mais novo, sem
instalar nada.

O formato completo está em [`docs/formato.md`](docs/formato.md).

## O que é um bom roadmap aqui

- **Robusto:** cobre o que um profissional ou estudante avançado da área
  espera que a pessoa saiba, na ordem em que se aprende.
- **Útil:** cada tópico diz o que é e o que a pessoa precisa conseguir fazer.
- **Direto:** aponta o caminho e as fontes, sem resumir a matéria inteira.
- **Completo:** todo tópico tem fonte de **teoria** e de **prática**, e o
  caminho termina num projeto ou exercício que junta tudo.
- **Honesto:** não promete resultado ("aprenda em 30 dias", "memorize 2×
  mais"). O roadmap organiza o estudo; o ganho de aprendizagem depende de
  quem estuda.

### Caminho

- [ ] De 6 a 14 tópicos, em ordem: cada um depende só dos anteriores.
- [ ] Nenhum tópico genérico ("Conceitos básicos", "Avançado", "Extras").
- [ ] De 2 a 6 subtópicos por tópico, só quando ajudam.
- [ ] O último tópico é um projeto ou exercício integrador.
- [ ] Os `links` extras são poucos e cada um é uma dependência real.

### Texto

- [ ] Cada resumo de tópico diz o que é e traz um "Você domina quando…" que dá
      para verificar.
- [ ] Os títulos são curtos (até cerca de 60 caracteres) e usam o termo que a
      área usa.
- [ ] Português correto, sem jargão desnecessário.

### Fontes

**Teoria (para entender):** documentação oficial ou especificação, material
universitário aberto, livros abertos de autoria reconhecida, artigos de
referência com data e autoria.

**Prática (para fazer):** exercícios ou laboratórios interativos, tutoriais
guiados, desafios com correção, listas de exercícios com gabarito, estudos de
caso, simuladores, questões de provas oficiais.

- [ ] Toda URL foi aberta e trata do tópico. Nunca invente nem deduza URLs.
- [ ] As fontes de prática exigem que a pessoa faça algo.
- [ ] Fontes gratuitas. Uma fonte paga só entra se for a referência
      indiscutível, e o título avisa "(pago)".
- [ ] Links estáveis, sem rastreamento (`utm_`, `ref=`), sem encurtadores e
      sem páginas de busca ou de login.
- [ ] Título da fonte no formato `Site ou autor: assunto`.
- [ ] De 2 a 4 fontes por tópico.

## Direitos

Os modelos só **apontam** para as fontes, não copiam o conteúdo delas.
Não copie a estrutura nem o texto de outros roadmaps: use-os só para conferir
se falta algo. Alguns, como o roadmap.sh, proíbem reutilização.

Ao contribuir, você concorda em licenciar sua contribuição sob a
[CC BY 4.0](LICENSE). Os scripts ficam sob a [licença MIT](scripts/LICENSE).
