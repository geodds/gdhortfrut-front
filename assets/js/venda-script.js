const selectProduto = document.getElementById('produtoId');
const selectCliente = document.getElementById('clienteVenda');
const inputQuantidade = document.getElementById('quantidade');
const inputValorTotal = document.getElementById('valorTotal');
const btnSalvar = document.getElementById('btnSalvar');
const btnNovaVenda = document.getElementById('btnNovaVenda');

let produtoSelect;

document.addEventListener("DOMContentLoaded", function() {
    carregarVendas();
    carregarClientes();

    produtoSelect = new Choices('#produtoId', {
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

//funcao que carrega todos os clientes no select do modal
function carregarClientes() {
    fetch('http://localhost:8080/clientes')
        .then(response => response.json())
        .then(clientes => {
            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nome;
                selectCliente.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar clientes', error));
}

//carrega vendas na tabela
function carregarVendas() {
    fetch('http://localhost:8080/vendas')
        .then(response => response.json())
        .then(vendas => {
            const tabela = document.getElementById('tabela-vendas');
            tabela.innerHTML = '';

            vendas.forEach(venda => {
                const produto = venda.produto;
                const cliente = venda.cliente;
                const linha = `
                <tr>
                    <td>${venda.id}</td>
                    <td data-cliente-id="${cliente ? cliente.id : ''}">${cliente ? cliente.nome : 'Cliente não encontrado'}</td>
                    <td data-produto-id="${produto ? produto.id : ''}">${produto ? produto.nome : 'Produto não encontrado'}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${venda.valorTotal.toFixed(2)}</td>
                    <td>
                        <div class="btn-group btn-group-lg">
                            <button type="button" class="btn btn-alterar">Alterar</button>
                            <button type="button" class="btn btn-remover" data-id="${venda.id}">Remover</button>
                        </div>
                    </td>
                </tr>`;
                tabela.innerHTML += linha;
            });

            //btn remover
            document.querySelectorAll('.btn-remover').forEach(botao => {
                botao.addEventListener('click', () => {
                    const id = botao.getAttribute('data-id');
                    if (confirm('Deseja realmente remover esta venda?')) {
                        removerVenda(id);
                    }
                });
            });

            //btn alterar
            document.querySelectorAll('.btn-alterar').forEach(botao => {
                botao.addEventListener('click', () => {
                    const linha = botao.closest('tr');
                    const idVenda = linha.children[0].textContent.trim();
                    const idCliente = linha.children[1].dataset.clienteId;
                    const idProduto = linha.children[2].dataset.produtoId;
                    const quantidade = linha.children[3].textContent.trim();

                    document.getElementById('vendaId').value = idVenda;
                    selectCliente.value = idCliente;
                    produtoSelect.setChoiceByValue(String(idProduto));
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

//funcao para remover venda
function removerVenda(id) {
    fetch(`http://localhost:8080/vendas/${id}`, { method: 'DELETE' })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao remover venda');
        alert('Venda removida com sucesso!');
        carregarVendas();
    })
    .catch(error => alert('Erro ao remover venda: ' + error.message));
}

//atualizar valor total
function atualizarValorTotal() {
    const produtoId = selectProduto.value;
    const quantidade = inputQuantidade.value;

    if (produtoId && quantidade) {
        fetch(`http://localhost:8080/vendas/calcular?produtoId=${produtoId}&quantidade=${quantidade}`)
            .then(response => response.text())
            .then(valorTotal => {
                const valorNumerico = parseFloat(valorTotal);
                inputValorTotal.value = !isNaN(valorNumerico) ? `R$ ${valorNumerico.toFixed(2)}` : '';
            })
            .catch(() => inputValorTotal.value = '');
    } else {
        inputValorTotal.value = '';
    }
}

function limparFormulario () {
    document.getElementById('vendaId').value = '';
    selectCliente.value = '';
    produtoSelect.removeActiveItems();
    inputQuantidade.value = '';
    inputValorTotal.value = '';
    btnSalvar.textContent = 'Salvar';
}

btnNovaVenda.addEventListener('click', limparFormulario);
selectProduto.addEventListener('change', atualizarValorTotal);
inputQuantidade.addEventListener('input', atualizarValorTotal);

//salvar ou alterar venda
btnSalvar.addEventListener('click', () => {
    const vendaId = document.getElementById('vendaId').value;
    const produtoId = selectProduto.value;
    const clienteId = selectCliente.value;
    const quantidade = inputQuantidade.value;

    if (!produtoId || !clienteId || !quantidade || quantidade <= 0) {
        alert('Selecione um cliente, um produto e informe uma quantidade valida!');
        return;
    }

    const venda = {
        id: vendaId ? parseInt(vendaId) : null,
        produtoId: parseInt(produtoId),
        clienteId: parseInt(clienteId),
        quantidade: parseInt(quantidade)
    };

    const url = vendaId ? `http://localhost:8080/vendas/${vendaId}` : 'http://localhost:8080/vendas';
    const metodo = vendaId ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
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
    })
    .catch(error => alert('Erro ao salvar venda: ' + error.message));
});
