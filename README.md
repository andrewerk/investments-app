<h1 align="center">
  Stock App
  <br>
</h1>

Boas vindas ao repositório do Stock App! Este projeto é uma API para um aplicativo de compra e venda de ações, desenvolvida no âmbito do processo seletivo da XP para os alunos da Trybe - Turma XP. Com a aplicação rodando, é possível criar um conta na corretora fictícia, depositar ou sacar quantias, negociar ações e verificar seu histórico de transações. O projeto foi desenvolvido em TypeScript, utilizando Node.js, Express e SequelizeORM para a administração do banco de dados.  

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

A documentação completa da API foi feita de acordo com as especificações Open API, e está disponível para visualização por meio da interface do swagger neste [link](https://andrewerk-stock-app.herokuapp.com/docs/). As requisições feitas pela interface estão rodando no banco de dados em nuvem.

Foi feito o deploy do projeto utilizando o heroku para a aplicação e o supabase para hostear o banco de dados. O deploy conta com um pipeline CI/CD, com todo push ao repositório do GitHub sendo verificado por meio de GitHub Actions que rodam os testes unitários e teste de padronização e semântica do ESlint. Após a conclusão com sucesso das actions, o Heroku identifica o novo deploy e refaz o build da aplicação, subindo a nova versão para o ambiente de produção.

Como a conta em que foi realizado o deploy no heroku é gratuita, a aplicação entre em "Sleep mode" após uma hora de inatividade. Assim, o primeiro acesso a documentação ou requisição direta à API pode demorar até 30 segundos para retornar. As requisições subsequentes terão retorno mais rápido

# Características importantes do funcionamento da aplicação

<details>
  <summary>Valores das ações em tempo real</summary><br />

O sistema consome uma API externa, o [Finnhub](https://finnhub.io/), para obter em os valores atualizados das ações. Assim, duas variáveis de ambiente são importantes para essa configuração. A variável API_TOKEN é um token pessoal gratuíto, feito apenas para o contexto desse projeto, e está sendo disponibilizada aqui para permitir o teste da aplicação. No entanto, ressalta-se que disponibilizar esse tipo de informação em um repositório público não é uma boa prática e está sendo feito apenas por ser a única opção de manter o funcionamento apropriado da aplicação.

A outra variável importante é a EXTERNAL_API. no arquivo de exemplo .env ela vai configurada como "true", o que significa que o sistema estará consumindo informações da API externa. Caso ocorra algum problema com a API externa, os endpoints do tipo GET para /stocks não irão retornar o currentValue da ação. Nesse caso, para ser possível testar a aplicação, a variável EXTERNAL_API deverá ser trocada para "false" e o projeto irá utilizar um arquivo de backup para manter o sistema em funcionamento.
</details>

<details>
  <summary>Sobre a quantidade de ativos disponíveis para compra e venda</summary><br />

Como não foi disponibilizada um banco ou API específica para a realização deste projeto, foi feito um metodo simples de randomização da quantidade de ações disponíveis na corretora para a venda. Este método, disponível no arquivo /src/utils/randomQuantity.ts e chamado pela camada de serviços "StockService".

A randomização de quantidade de ativos de uma ação em específica é realizada apenas uma vez depois do banco ser inicializado, no momento em que esta ação é passada como parâmetro para o método getStock pela primeira vez (este método é chamado quando uma ação é pesquisada ou comprada). As próximas vezes em que este método  for chamado com a mesma ação, ele não irá sobrescrever a quantidade de ativos gerada e inserida no banco de dados anteriormente. Ou seja, uma vez que a aplicação é inicializada com o banco resetado e a ação da XP é pesquisada por meio do endpoint /stocks, se for gerado um número aleatório de 100 ativos da XP, essa será a quantidade que poderá ser negociada.
</details>