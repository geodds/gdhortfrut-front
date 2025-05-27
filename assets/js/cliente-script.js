document.addEventListener("DOMContentLoaded", function() {

    fetch("http://localhost:8080/clientes")
        .then(response => response.json())
        .then(dados => {
            const tabela = document.getElementById('tabela-clientes');

            tabela.innerHTML = '';

            dados.forEach(cliente => {
                const linha = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.telefone}</td>
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
        .catch(error => console.error("Erro ao buscar dados: ", error));
});