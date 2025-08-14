document.addEventListener("DOMContentLoaded", function() {

    const tabela = document.getElementById('tabela-clientes');
    const btnNovoCliente = document.getElementById('btnNovoCliente');
    const modal = new bootstrap.Modal(document.getElementById('modalCadastro'));
    const form = document.getElementById('formCadastro');
    const btnSalvar = document.getElementById('btnSalvar');

    const inputId = document.getElementById('clienteId');
    const inputNome = document.getElementById('nomeCliente');
    const inputCpf = document.getElementById('cpfCliente');
    const inputTelefone = document.getElementById('telefone');

    //carrega clientes na tabela
    function carregarClientes() {
        fetch("http://localhost:8080/clientes")
            .then(response => response.json())
            .then(dados => {
                tabela.innerHTML = '';
                dados.forEach(cliente => {
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.telefone}</td>
                        <td>
                            <div class="btn-group btn-group-lg" role="group">
                                <button type="button" class="btn btn-warning btnAlterar" data-id="${cliente.id}">Alterar</button>
                            </div>
                        </td>
                    `;
                    tabela.appendChild(linha);
                });

                //eventos dos botoes de alterar e excluir
                document.querySelectorAll('.btnAlterar').forEach(btn => {
                    btn.addEventListener('click', () => abrirModalAlterar(btn.dataset.id));
                });
            })
            .catch(error => console.error("Erro ao buscar dados: ", error));
    }

    //abre modal para novo cliente
    btnNovoCliente.addEventListener('click', () => {
        form.reset();
        inputId.value = '';
        modal.show();
    });

    //abre modal para alterar cliente
    function abrirModalAlterar(id) {
        fetch(`http://localhost:8080/clientes/${id}`)
            .then(response => response.json())
            .then(cliente => {
                inputId.value = cliente.id;
                inputNome.value = cliente.nome;
                inputCpf.value = cliente.cpf;
                inputTelefone.value = cliente.telefone;
                modal.show();
            });
    }

    //aalvar ou atualizar cliente
    btnSalvar.addEventListener('click', () => {
        const cliente = {
            nome: inputNome.value,
            cpf: inputCpf.value,
            telefone: inputTelefone.value
        };

        if (inputId.value) {
            //atualizar cliente
            fetch(`http://localhost:8080/clientes/${inputId.value}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(cliente)
            })
            .then(() => {
                modal.hide();
                carregarClientes();
            });
        } else {
            //cadastrar cliente
            fetch("http://localhost:8080/clientes", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(cliente)
            })
            .then(() => {
                modal.hide();
                carregarClientes();
            });
        }
    });

    //carrega clientes ao iniciar
    carregarClientes();
});
