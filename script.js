// Dados do histórico de recebimento
let historicoData = {
    labels: [],
    values: []
};

// Inicializar gráficos na interface de entrada
const recebimentoChart = new Chart(document.getElementById('recebimentoChart'), {
    type: 'bar',
    data: {
        labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5'],
        datasets: [{
            label: 'Recebimento (R$)',
            data: [2000, 1600, 1200, 800, 400],
            backgroundColor: '#28A745',
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const historicoChart = new Chart(document.getElementById('historicoChart'), {
    type: 'bar',
    data: {
        labels: historicoData.labels,
        datasets: [{
            label: 'Histórico (R$)',
            data: historicoData.values,
            backgroundColor: '#28A745',
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Função para adicionar entrada ao histórico
function addHistorico() {
    const mes = document.getElementById('mes-historico').value;
    const ano = document.getElementById('ano-historico').value;
    const valor = parseFloat(document.getElementById('valor-historico').value) || 0;

    if (mes && ano && valor) {
        if (historicoData.labels.length < 11) {
            historicoData.labels.push(`${mes}/${ano}`);
            historicoData.values.push(valor);

            // Atualizar o gráfico
            historicoChart.data.labels = historicoData.labels;
            historicoChart.data.datasets[0].data = historicoData.values;
            historicoChart.update();

            // Limpar os campos
            document.getElementById('mes-historico').value = '';
            document.getElementById('ano-historico').value = '';
            document.getElementById('valor-historico').value = '';
        } else {
            alert('Limite de 11 entradas atingido.');
        }
    } else {
        alert('Por favor, preencha todos os campos (Mês, Ano e Valor).');
    }
}

// Função para deletar a última entrada do histórico
function deleteHistorico() {
    if (historicoData.labels.length > 0) {
        historicoData.labels.pop();
        historicoData.values.pop();

        // Atualizar o gráfico
        historicoChart.data.labels = historicoData.labels;
        historicoChart.data.datasets[0].data = historicoData.values;
        historicoChart.update();
    }
}

// Função para gerar o PDF
function generatePDF() {
    // Capturar os valores dos campos de entrada
    const leituraAnterior = document.getElementById('leitura-anterior').value;
    const leituraAtual = document.getElementById('leitura-atual').value;
    const proximaLeitura = document.getElementById('proxima-leitura').value;
    const nomeInvestidor = document.getElementById('nome-investidor').value;
    const mesReferencia = document.getElementById('mes-referencia').value;
    const valorLocacao = document.getElementById('valor-locacao').value;
    const faturaCopel = document.getElementById('fatura-copel').value;
    const valorCredito = document.getElementById('valor-credito').value;
    const valorKwh = document.getElementById('valor-kwh').value;
    const energiaGerada = document.getElementById('energia-gerada').value;
    const energiaConsumida = document.getElementById('energia-consumida').value;
    const energiaEnviada = document.getElementById('energia-enviada').value;
    const totalConsumido = document.getElementById('total-consumido').value;
    const totalAcumulado = document.getElementById('total-acumulado').value;

    // Preencher o template do PDF com os valores
    document.getElementById('pdf-leitura-anterior').textContent = leituraAnterior;
    document.getElementById('pdf-leitura-atual').textContent = leituraAtual;
    document.getElementById('pdf-proxima-leitura').textContent = proximaLeitura;
    document.getElementById('pdf-nome-investidor').textContent = nomeInvestidor;
    document.getElementById('pdf-mes-referencia').textContent = mesReferencia;
    document.getElementById('pdf-valor-locacao').textContent = valorLocacao;
    document.getElementById('pdf-fatura-copel').textContent = faturaCopel;
    document.getElementById('pdf-valor-credito').textContent = valorCredito;
    document.getElementById('pdf-valor-kwh').textContent = valorKwh;
    document.getElementById('pdf-energia-gerada').textContent = energiaGerada;
    document.getElementById('pdf-energia-consumida').textContent = energiaConsumida;
    document.getElementById('pdf-energia-enviada').textContent = energiaEnviada;
    document.getElementById('pdf-total-consumido').textContent = totalConsumido;
    document.getElementById('pdf-total-acumulado').textContent = totalAcumulado;

    // Inicializar gráficos no template do PDF
    const pdfRecebimentoChart = new Chart(document.getElementById('pdf-recebimentoChart'), {
        type: 'bar',
        data: {
            labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5'],
            datasets: [{
                label: 'Recebimento (R$)',
                data: [2000, 1600, 1200, 800, 400],
                backgroundColor: '#28A745',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const pdfHistoricoChart = new Chart(document.getElementById('pdf-historicoChart'), {
        type: 'bar',
        data: {
            labels: historicoData.labels,
            datasets: [{
                label: 'Histórico (R$)',
                data: historicoData.values,
                backgroundColor: '#28A745',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Gerar QR Code
    QRCode.toCanvas(document.getElementById('qrcode'), 'https://canalverdeenergia.com.br', {
        width: 100,
        height: 100
    }, function (error) {
        if (error) console.error(error);
    });

    // Gerar o PDF
    const element = document.getElementById('pdf-template');
    element.style.display = 'block'; // Tornar visível temporariamente para captura

    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('relatorio-investidor.pdf');

        element.style.display = 'none'; // Ocultar novamente após captura
    });
}