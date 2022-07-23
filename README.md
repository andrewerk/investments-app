<h1 align="center">
  Stock App
  <br>
</h1>

Boas vindas ao repositório do Stock App! Este projeto é uma API para um aplicativo de compra e venda de ações, desenvolvida no âmbito do processo seletivo da XP para os alunos da Trybe - Turma XP. Com a aplicação rodando, é possível criar um conta na corretora fictícia, depositar ou sacar quantias, negociar ações e verificar seu histórico de transações.

# Instalação

Os serviços responsáveis pelo funcionamento local do projeto foram orquestrados com docker-compose. Assim, para rodar este projeto localmente:

1. Clone o repositório e entre na pasta do projeto:
  - `cd stock-app`

2. Instale as dependências do projeto

  - `npm install`

3. Rode o comando para subir os conteineres rodando node e o banco de dados por meio do docker-compose

  - `docker-compose up --build -d`

4. Sua aplicação estará rodando na porta 3000!


# Deploy e Documentação completa

A documentação completa da API foi feita de acordo com as especificações de Open API, e está disponível para visualização por meio da interface do swagger neste [link](https://andrewerk-stock-app.herokuapp.com/docs/). As requisições feitas pela interface estão rodando no banco de dados em nuvem.

Foi feito o deploy do projeto utilizando o heroku para a aplicação e o supabase para hostear o banco de dados. O deploy conta com um pipeline CI/CD, com todo push ao repositório do GitHub sendo verificado por meio de GitHub Actions que rodam os testes unitários e teste de padronização e semântica do ESlint. Após a conclusão com sucesso das actions, o Heroku identifica o novo deploy e refaz o build da aplicação, subindo a nova versão em produção. 

<details>
  <summary>Compra e venda de ações</summary><br />

</details>