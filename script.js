document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('relatorioForm');
    const recebimentosDiv = document.getElementById('recebimentos');
    const adicionarRecebimentoBtn = document.getElementById('adicionarRecebimento');
    const conteudoRelatorioDiv = document.getElementById('conteudoRelatorio');

    adicionarRecebimentoBtn.addEventListener('click', () => {
        const novoRecebimento = document.createElement('div');
        novoRecebimento.classList.add('recebimento');
        novoRecebimento.innerHTML = `
            <label for="mesRecebimento">Mês:</label>
            <input type="month" class="mesRecebimento" name="mesRecebimento[]">
            <label for="valorRecebido">Valor:</label>
            <input type="number" class="valorRecebido" name="valorRecebido[]">
            <button type="button" class="deletarRecebimento">Deletar</button>
        `;
        recebimentosDiv.appendChild(novoRecebimento);
    });

    recebimentosDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('deletarRecebimento')) {
            event.target.parentElement.remove();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const dados = {};
        for (let [chave, valor] of formData.entries()) {
            if (chave.endsWith('[]')) {
                if (!dados[chave]) {
                    dados[chave] = [];
                }
                dados[chave].push(valor);
            } else {
                dados[chave] = valor;
            }
        }

        let relatorioHTML = '<ul>';
        for (let chave in dados) {
            relatorioHTML += `<li>${chave}: ${dados[chave]}</li>`;
        }
        relatorioHTML += '</ul>';

        conteudoRelatorioDiv.innerHTML = relatorioHTML;

        // Simula o preenchimento do PDF
        const pdfConteudo = document.createElement('div');
        pdfConteudo.innerHTML = `
            <p>Leitura Anterior: ${dados.leituraAnterior}</p>
            <p>Leitura Atual: ${dados.leituraAtual}</p>
            <p>Próxima Leitura: ${dados.proximaLeitura}</p>
            <p>Nome do Investidor: ${dados.nomeInvestidor}</p>
            <p>Mês de Referência: ${dados.mesReferencia}</p>
            <p>Valor da Locação: ${dados.valorLocacao}</p>
            <p>Fatura Copel: ${dados.faturaCopel}</p>
            <p>Valor do Crédito em Conta: ${dados.valorCredito}</p>
            <p>Valor do kWh: ${dados.valorKwh}</p>
            <p>Energia Gerada: ${dados.energiaGerada}</p>
            <p>Energia Consumida pelo Próprio Investidor: ${dados.energiaConsumida}</p>
            <p>Energia Enviada para Cooperados: ${dados.energiaCooperados}</p>
            <p>Total Consumido pelos Cooperados: ${dados.totalConsumido}</p>
            <p>Total Acumulado pelos Cooperados (Todos os Períodos): ${dados.totalAcumulado}</p>
            <h2>Histórico de Recebimento (R$)</h2>
            <ul>
                ${dados['mesRecebimento[]'].map((mes, index) => `
                    <li>Mês: ${mes}, Valor: ${dados['valorRecebido[]'][index]}</li>
                `).join('')}
            </ul>
        `;

        // Aqui, você pode usar uma biblioteca de geração de PDF como jsPDF ou html2canvas para criar um PDF com o conteúdo de pdfConteudo.
        // Como exemplo, vou apenas adicionar o conteúdo de pdfConteudo ao conteudoRelatorioDiv.
        conteudoRelatorioDiv.appendChild(pdfConteudo);
    });
});