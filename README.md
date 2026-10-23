# CRUD de Produtos

API de produtos feita com Node.js, Express e MySQL.

## Como rodar

1. Instale as dependências:

   npm install

2. Abra o MySQL Workbench e execute o arquivo `database/script.sql` para criar o banco e a tabela.

3. Copie o arquivo `.env.example` para `.env` e ajuste os dados de conexão (usuário e senha do MySQL, se tiver).

4. Inicie o servidor:

   node app.js

5. Abra http://localhost:3000 no navegador.

## Rotas

- POST /produtos - cadastra um produto
- GET /produtos - lista todos os produtos
- GET /produtos/:id - busca um produto pelo ID
- PUT /produtos/:id - atualiza um produto
- DELETE /produtos/:id - exclui um produto

Exemplo de corpo para POST e PUT:

    {
      "nome": "Teclado mecânico",
      "preco": 149.90,
      "quantidade": 20
    }
