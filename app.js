const express = require("express");
const pool = require("./config/db");

const app = express();
app.use(express.json());

function validar(nome, preco, quantidade) {
  if (typeof nome !== "string" || nome.trim() === "") {
    return "Nome não pode ser vazio";
  }
  if (typeof preco !== "number" || preco < 0) {
    return "Preço inválido";
  }
  if (!Number.isInteger(quantidade) || quantidade < 0) {
    return "Quantidade inválida";
  }
  return null;
}

app.get("/", (req, res) => {
  res.json({ mensagem: "API de produtos funcionando!" });
});

app.post("/produtos", async (req, res) => {
  const { nome, preco, quantidade } = req.body;

  const problema = validar(nome, preco, quantidade);
  if (problema) {
    return res.status(400).json({ erro: problema });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO Produtos (Nome, Preco, Quantidade) VALUES (?, ?, ?)",
      [nome, preco, quantidade]
    );

    res.status(201).json({
      mensagem: "Produto cadastrado!",
      id: resultado.insertId
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const [produtos] = await pool.query(
      "SELECT Id, Nome, Preco, Quantidade FROM Produtos ORDER BY Id"
    );

    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar produtos" });
  }
});

app.get("/produtos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const [produtos] = await pool.query(
      "SELECT Id, Nome, Preco, Quantidade FROM Produtos WHERE Id = ?",
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produtos[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar produto" });
  }
});

app.put("/produtos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, preco, quantidade } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const problema = validar(nome, preco, quantidade);
  if (problema) {
    return res.status(400).json({ erro: problema });
  }

  try {
    const [resultado] = await pool.query(
      "UPDATE Produtos SET Nome = ?, Preco = ?, Quantidade = ? WHERE Id = ?",
      [nome, preco, quantidade, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto atualizado!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const [resultado] = await pool.query(
      "DELETE FROM Produtos WHERE Id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ mensagem: "Produto excluído!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir produto" });
  }
});

app.listen(3000, () => {
  console.log("Servidor executando na porta 3000");
});
