const selectProduto = document.getElementById('produtoId');
const inputQuantidade = document.getElementById('quantidade');
const inputValorTotal = document.getElementById('valorTotal');
const btnSalvar = document.getElementById('btnSalvar');
const btnNovaVenda = document.getElementById('btnNovaVenda');

document.addEventListener("DOMContentLoaded", function() {
    carregarVendas();

    const produtoSelect = new Choices('#produtoId', {
        removeItemButton: true,
        placeholderValue: 'Digite ou selecione...',
        searchEnabled: true,
    });

    fetch('http://localhost:8080/produtos')
        .then(response => response.json())
        .then(produtos => {
            const options = produtos.map(produto => ({
                value: produto.id,
                label: `${produto.nome} - R$ ${produto.preco.toFixed(2)}`
            }));
            produtoSelect.setChoices(options, 'value', 'label', true);
        })
        .catch(error => console.error('Erro ao carregar produtos', error));
});


function carregarVendas() {
    fetch('http://localhost:8080/vendas')
        .then(response => response.json())
        .then(vendas => {
            const tabela = document.getElementById('tabela-vendas');
            tabela.innerHTML = '';

            vendas.forEach(venda => {
                const produto = venda.produto;
                const linha = `
                <tr>
                    <td>${venda.id}</td>
                    <td>${produto ? produto.nome : "Produto não encontrado"}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${venda.valorTotal}</td>
                    <td>
                        <div class="btn-group btn-group-lg">
                            <button type="button" class="btn btn-alterar">Alterar</button>
                            <button type="button" class="btn btn-remover" data-id="${venda.id}">Remover</button>
                        </div>
                    </td>
                </tr>`;
                tabela.innerHTML += linha;
            });

            // 🔥 Remover
            const btnRemover = document.querySelectorAll('.btn-remover');
            btnRemover.forEach(botao => {
                botao.addEventListener('click', () => {
                    const id = botao.getAttribute('data-id');
                    if (confirm('Deseja realmente remover esta venda?')) {
                        removerVenda(id);
                    }
                });
            });

            // 🔥 Alterar
            const btnAlterar = document.querySelectorAll('.btn-alterar');
            btnAlterar.forEach(botao => {
                botao.addEventListener('click', () => {
                    const linha = botao.closest('tr');
                    const idVenda = linha.children[0].textContent.trim();
                    const nomeProduto = linha.children[1].textContent.trim();
                    const quantidade = linha.children[2].textContent.trim();

                    document.getElementById('vendaId').value = idVenda;

                    const optionEncontrada = [...selectProduto.options].find(opt => opt.text.includes(nomeProduto));
                    if (optionEncontrada) {
                        selectProduto.value = optionEncontrada.value;
                    }

                    inputQuantidade.value = quantidade;
                    atualizarValorTotal();

                    const modal = new bootstrap.Modal(document.getElementById('modalCadastro'));
                    modal.show();

                    btnSalvar.textContent = 'Alterar';
                });
            });

        })
        .catch(error => console.error('Erro ao carregar vendas', error));
}

function removerVenda(id) {
    fetch(`http://localhost:8080/vendas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao remover venda');
        }
        alert('Venda removida com sucesso!');
        carregarVendas();
    })
    .catch(error => {
        alert('Erro ao remover venda: ' + error.message);
    });
}

function atualizarValorTotal() {
    const produtoId = selectProduto.value;
    const quantidade = inputQuantidade.value;

    if (produtoId && quantidade) {
        fetch(`http://localhost:8080/vendas/calcular?produtoId=${produtoId}&quantidade=${quantidade}`)
            .then(response => {
                if (!response.ok) throw new Error('Erro no cálculo');
                return response.text();
            })
            .then(valorTotal => {
                const valorNumerico = parseFloat(valorTotal);
                if (!isNaN(valorNumerico)) {
                    inputValorTotal.value = `R$ ${valorNumerico.toFixed(2)}`;
                } else {
                    inputValorTotal.value = '';
                }
            })
            .catch(error => {
                console.error('Erro ao calcular valor total:', error);
                inputValorTotal.value = '';
            });
    } else {
        inputValorTotal.value = '';
    }
}

function limparFormulario () {
    document.getElementById('vendaId').value = '';
    selectProduto.value = '';
    inputQuantidade.value = '';
    inputValorTotal.value = '';
    btnSalvar.textContent = 'Salvar';
}

btnNovaVenda.addEventListener('click', limparFormulario);

selectProduto.addEventListener('change', atualizarValorTotal);
inputQuantidade.addEventListener('input', atualizarValorTotal);

btnSalvar.addEventListener('click', () => {
    const produtoId = selectProduto.value;
    const quantidade = inputQuantidade.value;
    const vendaId = document.getElementById('vendaId').value;

    if (!produtoId || !quantidade || quantidade <= 0) {
        alert('Selecione um produto e informe uma quantidade válida!');
        return;
    }

    const venda = {
        id: vendaId ? parseInt(vendaId) : null,
        produtoId: parseInt(produtoId),
        quantidade: parseInt(quantidade)
    };

    const url = vendaId ? `http://localhost:8080/vendas/${vendaId}` : 'http://localhost:8080/vendas';
    const metodo = vendaId ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venda)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar venda');
        return response.json();
    })
    .then(() => {
        alert(vendaId ? 'Venda alterada com sucesso!' : 'Venda salva com sucesso!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
        modal.hide();

        carregarVendas();
        limparFormulario();

     /*   selectProduto.value = '';
        inputQuantidade.value = '';
        inputValorTotal.value = '';
        document.getElementById('vendaId').value = '';
        btnSalvar.textContent = 'Salvar';*/
    })
    .catch(error => {
        alert('Erro ao salvar venda: ' + error.message);
    });
});



