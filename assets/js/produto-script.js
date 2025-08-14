document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.getElementById('tabela-produtos');
    const btnNovoProduto = document.getElementById('btnNovoProduto');
    const btnSalvar = document.getElementById('btnSalvar');
    const modal = new bootstrap.Modal(document.getElementById('modalCadastro'));
    
    const produtoId = document.getElementById('produtoId');
    const nomeProduto = document.getElementById('nomeProduto');
    const descricaoProduto = document.getElementById('descricaoProduto');
    const precoProduto = document.getElementById('precoProduto');

    //carrega produtos na tabela
    function carregarProdutos() {
        tabela.innerHTML = '';
        fetch('http://localhost:8080/produtos')
            .then(r => r.json())
            .then(produtos => {
                produtos.forEach(p => {
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
                        <td>${p.id}</td>
                        <td>${p.nome}</td>
                        <td>${p.descricao}</td>
                        <td>R$ ${p.preco.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-warning btnAlterar" data-id="${p.id}">Alterar</button>
                        </td>
                    `;
                    tabela.appendChild(linha);
                });

                document.querySelectorAll('.btnAlterar').forEach(btn => {
                    btn.addEventListener('click', () => editarProduto(btn.dataset.id));
                });

                document.querySelectorAll('.btnRemover').forEach(btn => {
                    btn.addEventListener('click', () => removerProduto(btn.dataset.id));
                });
            })
            .catch(e => console.error('Erro ao carregar produtos:', e));
    }

    //cadastra produto
    btnNovoProduto.addEventListener('click', () => {
        produtoId.value = '';
        nomeProduto.value = '';
        descricaoProduto.value = '';
        precoProduto.value = '';
        modal.show();
    });

    //salva produto
    btnSalvar.addEventListener('click', () => {
        const produto = {
            nome: nomeProduto.value,
            descricao: descricaoProduto.value,
            preco: parseFloat(precoProduto.value)
        };

        const metodo = produtoId.value ? 'PUT' : 'POST';
        const url = produtoId.value
            ? `http://localhost:8080/produtos/${produtoId.value}`
            : `http://localhost:8080/produtos`;

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        })
            .then(() => {
                modal.hide();
                carregarProdutos();
            })
            .catch(e => console.error('Erro ao salvar produto:', e));
    });

    //edita produto
    function editarProduto(id) {
        fetch(`http://localhost:8080/produtos/${id}`)
            .then(r => r.json())
            .then(p => {
                produtoId.value = p.id;
                nomeProduto.value = p.nome;
                descricaoProduto.value = p.descricao;
                precoProduto.value = p.preco;
                modal.show();
            });
    }
    carregarProdutos();
});
