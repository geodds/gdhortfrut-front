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
                </tr>`;
                tabela.innerHTML += linha;
            });
        })
        .catch(error => console.error("Erro ao buscar dados: ", error));
});