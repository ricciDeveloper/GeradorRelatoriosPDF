// Dados do histórico de recebimento
let historicoData = {
    labels: [],
    valores: []
};

// Inicializar gráfico na interface de entrada (apenas historicoChart)
const historicoChart = new Chart(document.getElementById('historicoChart'), {
    type: 'bar',
    data: {
        labels: historicoData.labels,
        datasets: [{
            label: 'Histórico (R$)',
            data: historicoData.valores,
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
    const valor = parseFloat(document.getElementById('valor-historico').value) || 0;

    if (mes && valor) {
        if (historicoData.labels.length < 11) {
            historicoData.labels.push(mes);
            historicoData.valores.push(valor);

            // Atualizar o gráfico
            historicoChart.update();

            // Limpar os campos
            document.getElementById('mes-historico').value = '';
            document.getElementById('valor-historico').value = '';
        } else {
            alert('Limite de 11 entradas atingido.');
        }
    } else {
        alert('Por favor, preencha todos os campos (Mês e Valor).');
    }
}

// Função para deletar a última entrada do histórico
function deleteHistorico() {
    if (historicoData.labels.length > 0) {
        historicoData.labels.pop();
        historicoData.valores.pop();

        // Atualizar o gráfico
        historicoChart.update();
    }
}

// Função para formatar o mês de referência (ex.: "2025-03" -> "Março 2025")
function formatarMesReferencia(valor) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    if (valor) {
        const [ano, mes] = valor.split('-');
        return `${meses[parseInt(mes) - 1]} ${ano}`;
    }
    return '';
}

// Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
function formatarData(valor) {
    if (valor) {
        const [ano, mes, dia] = valor.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    return '';
}

// Função para gerar o PDF
function generatePDF() {
    // Capturar os valores dos campos de entrada
    const leituraAnterior = document.getElementById('leitura-anterior').value;
    const leituraAtual = document.getElementById('leitura-atual').value;
    const proximaLeitura = document.getElementById('proxima-leitura').value;
    const nomeInvestidor = document.getElementById('nome-investidor').value || 'Investidor'; // Valor padrão se vazio
    const mesReferencia = formatarMesReferencia(document.getElementById('mes-referencia').value);
    const valorLocacao = document.getElementById('valor-locacao').value || '';
    const faturaCopel = document.getElementById('fatura-copel').value || '';
    const valorCredito = document.getElementById('valor-credito').value || '';
    const valorKwh = document.getElementById('valor-kwh').value || '';
    const energiaGerada = document.getElementById('energia-gerada').value || '';
    const energiaConsumida = document.getElementById('energia-consumida').value || '';
    const energiaEnviada = document.getElementById('energia-enviada').value || '';
    const totalConsumido = document.getElementById('total-consumido').value || '';
    const totalAcumulado = document.getElementById('total-acumulado').value || '';

    // Preencher o template do PDF com os valores, formatando as datas
    document.getElementById('pdf-leitura-anterior').textContent = formatarData(leituraAnterior);
    document.getElementById('pdf-leitura-atual').textContent = formatarData(leituraAtual);
    document.getElementById('pdf-proxima-leitura').textContent = formatarData(proximaLeitura);
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

    // Tornar o template visível temporariamente
    const element = document.getElementById('pdf-template');
    element.style.display = 'block';

    // Garantir que a logo seja carregada
    const logoImg = document.querySelector('#pdf-template .logo img');
    logoImg.src = './Assets/logo.jpeg'; // Certifique-se de que o caminho está correto

    // Inicializar gráfico no template do PDF (apenas o histórico)
    let pdfHistoricoChart;
    try {
        pdfHistoricoChart = new Chart(document.getElementById('pdf-historicoChart'), {
            type: 'bar',
            data: {
                labels: historicoData.labels,
                datasets: [{
                    label: 'Histórico (R$)',
                    data: historicoData.valores,
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
    } catch (error) {
        console.error('Erro ao inicializar o gráfico no PDF:', error);
    }

    // Inserir o QR Code (usando uma imagem estática)
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = './Assets/1.png'; // Substitua pelo caminho correto da sua imagem de QR Code
    qrCodeImg.style.width = '100px';
    qrCodeImg.style.height = '100px';
    qrCodeContainer.appendChild(qrCodeImg);

    // Aguardar renderização antes de gerar o PDF
    setTimeout(() => {
        try {
            html2canvas(element, { 
                scale: 2,
                useCORS: true, // Para carregar imagens externas, se necessário
                logging: true // Para depuração
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // Ajustar para caber em uma página ou dividir em várias
                if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                    // Se o conteúdo for muito longo, ajustamos a escala para caber na página
                    const scaleFactor = pdf.internal.pageSize.getHeight() / pdfHeight;
                    const scaledWidth = pdfWidth * scaleFactor;
                    const scaledHeight = pdfHeight * scaleFactor;
                    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                }

                // Usar o nome do investidor como nome do arquivo
                const nomeArquivo = `${nomeInvestidor.replace(/\s+/g, '_')}_relatorio.pdf`;
                pdf.save(nomeArquivo);

                // Ocultar o template e limpar o gráfico
                element.style.display = 'none';
                if (pdfHistoricoChart) {
                    pdfHistoricoChart.destroy();
                }
            }).catch(error => {
                console.error('Erro ao gerar o PDF com html2canvas:', error);
                element.style.display = 'none';
            });
        } catch (error) {
            console.error('Erro geral ao gerar o PDF:', error);
            element.style.display = 'none';
        }
    }, 2000); // Aumentado para 2000ms para garantir renderização
}