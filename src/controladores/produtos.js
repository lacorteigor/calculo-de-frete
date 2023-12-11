const produtos = require('../bancodedados/produtos');
const { getStateFromZipcode } = require('utils-playground');

const listarProdutos = async (req, res) => {
    return res.json(produtos);
};

const buscarProdutoId = async (req, res) => {
    const { idProduto } = req.params;
    const produtoEncontrado = produtos.find((produto) => {
        return produto.id === Number(idProduto);
    });

    if (!produtoEncontrado) {
        return res.status(404).json({ mensagem: `O produto com id ${idProduto} não foi encontrado!` });
    } else {
        return res.json(produtoEncontrado);
    }
};

const calcularFrete = async (req, res) => {
    const { idProduto, cep } = req.params;
    const produto = produtos.find((produto) => {
        return produto.id === Number(idProduto);
    });
    if (!produto) {
        return res.status(404).json({ mensagem: `O produto com id ${idProduto} não foi encontrado!` });
    }

    const estado = await getStateFromZipcode(cep);
    const { valor } = produto;
    let frete = 0;
    if (estado === 'RJ' || estado === 'SP') {
        frete = valor * 0.15;
    } else if (estado === 'BA' || estado === 'SE' || estado === 'AL' || estado === 'PE' || estado === 'PB') {
        frete = valor * 0.10;
    } else {
        frete = valor * 0.12;
    }
    return res.json({
        produto,
        estado,
        frete
    });
};

module.exports = {
    listarProdutos,
    buscarProdutoId,
    calcularFrete
};