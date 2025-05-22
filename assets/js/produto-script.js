document.addEventListener("DOMContentLoaded", function() {

    fetch('http://localhost:8080/produtos')
        .then(response => response.json())
        .then(produtos => {
            const tabela = document.getElementById('tabela-produtos');

            produtos.forEach(produto => {
            const linha = `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>R$ ${produto.preco}</td>
                </tr>`;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => console.error('Erro ao carregar produtos: ', error));
});
