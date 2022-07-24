<h1 align="center">
  Stock App
  <br>
</h1>

Boas vindas ao repositório do Stock App! Este projeto é uma API para um aplicativo de compra e venda de ações, desenvolvida no âmbito do processo seletivo da XP para os alunos da Trybe - Turma XP. Com a aplicação rodando, é possível criar um conta na corretora fictícia, depositar ou sacar quantias, negociar ações e verificar seu histórico de transações. O projeto foi desenvolvido em TypeScript, utilizando Node.js, Express e SequelizeORM para a administração do banco de dados.  

# Instalação

Os serviços responsáveis pelo funcionamento local do projeto foram orquestrados com docker-compose. Assim, para rodar este projeto localmente:

1. Clone o repositório e entre na pasta do projeto:
  - `cd stock-app`

2. Instale as dependências do projetoÇ

  - `npm install`

3. Rode o comando para subir os conteineres rodando node e o banco de dados por meio do docker-compose. Certifique-se de que não há nenhum serviço rodando na porta 3000 e na porta 5432 (postgres)Ç

  - `docker-compose up --build -d`

4. Sua aplicação estará rodando na porta 3000!


5. Para rodar os testes unitários da aplicação, entre no container para garantir a conexão com o banco:

  - `docker exec -it stock-app /bin/sh`

6. Rode o script para teste ou, se preferir, para cobertura de teste, respectivamente:

- `npm test`
- `npm run test:coverage`


# Deploy e Documentação completa

A documentação completa da API foi feita de acordo com as especificações Open API, e está disponível para visualização por meio da interface do swagger neste [link](https://andrewerk-stock-app.herokuapp.com/docs/). As requisições feitas pela interface estão rodando no banco de dados em nuvem.

Foi feito o deploy do projeto utilizando o heroku para a aplicação e o supabase para hostear o banco de dados. O deploy conta com um pipeline CI/CD, com todo push ao repositório do GitHub sendo verificado por meio de GitHub Actions que rodam os testes unitários e teste de padronização e semântica do ESlint. Após a conclusão com sucesso das actions, o Heroku identifica o novo deploy e refaz o build da aplicação, subindo a nova versão para o ambiente de produção.

Como a conta em que foi realizado o deploy no heroku é gratuita, a aplicação entre em "Sleep mode" após uma hora de inatividade. Assim, o primeiro acesso a documentação ou requisição direta à API pode demorar até 30 segundos para retornar. As requisições subsequentes terão retorno mais rápido

# Características importantes do funcionamento da aplicação

<details>
  <summary>Valores das ações em tempo real</summary><br />

O sistema consome uma API externa, o [Finnhub](https://finnhub.io/), para obter em os valores atualizados das ações. Assim, duas variáveis de ambiente são importantes para essa configuração. A variável API_TOKEN é um token pessoal gratuíto, feito apenas para o contexto desse projeto, e está sendo disponibilizada aqui para permitir o teste da aplicação. No entanto, ressalta-se que disponibilizar esse tipo de informação em um repositório público não é uma boa prática e está sendo feito apenas por ser a única opção de manter o funcionamento apropriado da aplicação.

A outra variável importante é a EXTERNAL_API. no arquivo de exemplo .env ela vai configurada como "true", o que significa que o sistema estará consumindo informações da API externa. Caso ocorra algum problema com a API externa, os endpoints do tipo GET para /stocks não irão retornar o currentValue da ação. Nesse caso, para ser possível testar a aplicação, a variável EXTERNAL_API deverá ser trocada para "false" e o projeto irá utilizar um arquivo de backup para manter o sistema em funcionamento. Nesse caso, as únicas ações que poderão ser pesquisadas ou compradas são as que constam no arquivo "/utils/mainStocks".
</details>

<details>
  <summary>Sobre a quantidade de ativos disponíveis para compra e venda</summary><br />

Como não foi disponibilizada um banco ou API específica para a realização deste projeto, foi feito um metodo simples de randomização da quantidade de ações disponíveis na corretora para a venda. Este método, disponível no arquivo /src/utils/randomQuantity.ts e chamado pela camada de serviços "StockService".

A randomização de quantidade de ativos de uma ação em específica é realizada apenas uma vez depois do banco ser inicializado, no momento em que esta ação é passada como parâmetro para o método getStock pela primeira vez (este método é chamado quando uma ação é pesquisada ou comprada). As próximas vezes em que este método  for chamado com a mesma ação, ele não irá sobrescrever a quantidade de ativos gerada e inserida no banco de dados anteriormente. Ou seja, uma vez que a aplicação é inicializada com o banco resetado e a ação da XP é pesquisada por meio do endpoint /stocks, se for gerado um número aleatório de 100 ativos da XP, essa será a quantidade que poderá ser negociada.
</details>

<details>
  <summary>Arquitetura da aplicação</summary><br />

A API foi construída utilizando a arquitetura MSC - Model, Service e Controller. 

A camada de controller é reponsável por receber a requisição dos routers, extrair as informações que vem com a requisição (parâmetros e corpo da requisição), chamar os métodos da camada de service com os parâmetros recebidos, e retornar a resposta aos routers.

A camada de service é resposável por solicitar as informações do banco de dados e pela validação e aplicação das regras de negócio. Por exemplo, um cliente não pode comprar uma ação se não tiver dinheiro em conta suficiente ou se a corretora não tiver ações disponíveis. Assim, a camada de service irá gerar uma exceção que será retornada na requisição com o motivo de ter sido gerada. A camda de service também é responsável por solicitar informações para a API externa utilizada (arquivo stockApiService)

Por fim, a camada de Model é responsável pela administração do banco de dados. Para este projeto, foi utilizado o Sequelize, ORM de Node.js para o gerenciamento de bancos de dados relacionais, como o Postgres e o SQL. A configuração deste projeto utiliza o postgres, que pode ser hosteado gratuitamente pelo [Supabase](https://supabase.com/) em nuvem.

Em cada camada existem arquivos responsáveis pelo "eixo" do sistema: users, login, conta(account), carteira de investimentos(investmentPortfoli0), histórico de transações(trade) e ações (stocks).

O Projeto também possui middlewares, que avaliam as requisições antes de chegar nos controladores. Os middlewares têm a função de:  validar o corpo das requisições e gerar exceções, caso necessário; manipulação de erros e exceções, tanto geradas propositalmente quanto do sistema; validação do token enviado na requisição.


</details>

<details>
  <summary>Validação de Token JWT e hash das senhas</summary><br />

O projeto utiliza, para autorizar requisições, o Token JWT. A biblioteca permite que seja gerado um token, que envia em seu payload informações pré selecionadas. Nesse caso, o payload do corpo carrega o id da pessoa usuária e o email. Esse token é expirado 50 minutos após ser gerado, durante login ou quando um usuário é criado no sistema. Todas as rotas, exceto a de login e criar usuário, necessitam que seja enviado um token para ser autorizada e também para passar ao backend as informações de qual pessoa usuária está realizando a requisição.

Além do token JWT, a senha cadastrada pela pessoa usuária passar por um algorítmo de Hash antes de ser armazenada no banco de dados. Esse algorítmo, proveniente da biblioteca bcrypt, é aplicado no UserModel e verificado quando a pessoa usuária faz login na camada de loginService.
</details>

<details>
  <summary>Uso da aplicação</summary><br />

Com o intuito de melhorar a usabilidade do sistema e facilitar as requisições de um possível frontend à aplicação, algumas alterações foram feitas na estrutura do corpo das requisições. 
O desafio solicitava inicialmente que fosse enviado no corpo das requisições do tipo post o código do usuário, na compra e venda de ações. Ao invés de enviar essa informação pelo body da requisição, essa informação está sendo enviada no payload do token. Assim, a informação é enviada criptografada e melhora o uso da aplicação.
Outra alteração foi a do código do ativo. Essa informação consta no sistema como Symbol, e equivale o símbolo oficial da ação. Por exemplo, o símbolo de ações da Apple é "AAPL". Assim, as ações são identificadas no banco de dados e requisições por este símbolo, para facilitar a pesquisa da pessoa usuária com um termo padronizado mundialmente e não exclusivo do sistema. Como consequência, o código do ativo solicitado inicilamente como um integer é uma string neste sistema.

</details>

<details>
  <summary>Carteira de investimentos e Histórico de negociações</summary><br />


O funcionamento da carteira de investimentos dos usuários está baseada nos arquivos do tipo InvestmentPortfolio. Para cada ação que uma pessoa usuária tiver, independente do numero de ativos, haverá um "id". Por exemplo, na carteira de investimentos de uma pessoa usuária pode ter ações da Aaple, com 50 ativos e "id" igual a 1, e ações da XP, com 50 ativos e "id" 2, enquanto outra pessoa usuária pode ter 40 ativos da Aaple e o "id" igual a 3. Ou seja, este id identifica a combinação pessoa usuária + ação específica. É importante não confundir esse "id" com o código do ativo mencionado na especificação do desafio, uma vez que este é substituido pela variável "symbol". 

Toda negociação de ativos fica registrada no banco de dados, identificado por um id da transação. Este registro mantém a quantidade negociada, o valor da ação no momento da negociação, o tipo de negociação (compra ou venda), data, e o "portfolioId" (identificação da ação na carteira de investimentos da pessoa usuária) 

</details>
