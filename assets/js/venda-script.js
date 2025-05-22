 document.addEventListener("DOMContentLoaded", function() {

    fetch('http://localhost:8080/vendas')
        .then(response => response.json())
        .then(vendas => {
            const tabela = document.getElementById('tabela-vendas');

            vendas.forEach(venda => {
            const produto = venda.produto;
            const linha = `
                <tr>
                    <td>${venda.id}</td>
                    <td>${produto ? produto.nome : "Produto nao encontrado"}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${venda.valorTotal}</td>
                </tr>`;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => console.error('Erro ao carregar produtos', error));
});