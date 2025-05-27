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
                    <td>
                        <div class="btn-group btn-group-lg" role="group" aria-label="Basic outlined example">
                            <button type="button" class="btn">Alterar</button>
                            <button type="button" class="btn">Remover</button>
                        </div>
                    </td>
                </tr>`;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => console.error('Erro ao carregar produtos: ', error));
});
