// Dados do histórico de recebimento
let historicoData = {
    labels: [],
    valores: []
};

// Função para abreviar os meses (ex.: "Janeiro" -> "JAN")
function abreviarMes(mes) {
    const mesesAbreviados = {
        'Janeiro': 'JAN',
        'Fevereiro': 'FEV',
        'Março': 'MAR',
        'Abril': 'ABR',
        'Maio': 'MAI',
        'Junho': 'JUN',
        'Julho': 'JUL',
        'Agosto': 'AGO',
        'Setembro': 'SET',
        'Outubro': 'OUT',
        'Novembro': 'NOV',
        'Dezembro': 'DEZ'
    };
    return mesesAbreviados[mes] || mes.toUpperCase().slice(0, 3);
}

// Função auxiliar para converter número do mês em nome completo
function numeroParaMes(numeroMes) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[parseInt(numeroMes) - 1] || numeroMes;
}

// Inicializar gráfico na interface de entrada (historicoChart)
const historicoChart = new Chart(document.getElementById('historicoChart'), {
    type: 'bar',
    data: {
        labels: historicoData.labels.map(abreviarMes),
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

// Inicializar gráfico na prévia do PDF (pdf-historicoChart)
let pdfHistoricoChart = new Chart(document.getElementById('pdf-historicoChart'), {
    type: 'bar',
    data: {
        labels: historicoData.labels.map(abreviarMes),
        datasets: [{
            label: 'Histórico (R$)',
            data: historicoData.valores,
            backgroundColor: '#28A745',
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 8
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 8
                    }
                }
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
        if (historicoData.labels.length < 11) { // Limite de 11 entradas históricas
            historicoData.labels.push(mes);
            historicoData.valores.push(valor);

            // Atualizar gráficos e prévia
            updateChartsAndPreview();
            
            // Limpar os campos
            document.getElementById('mes-historico').value = '';
            document.getElementById('valor-historico').value = '';
        } else {
            alert('Limite de 11 entradas históricas atingido.');
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

        // Atualizar gráficos e prévia
        updateChartsAndPreview();
    }
}

// Função auxiliar para atualizar gráficos e prévia
function updateChartsAndPreview() {
    const mesReferenciaInput = document.getElementById('mes-referencia').value.split('-'); // Ex: ["2025", "03"]
    const mesReferencia = mesReferenciaInput.length > 1 ? numeroParaMes(mesReferenciaInput[1]) : 'Atual';
    const valorCredito = parseFloat(document.getElementById('valor-credito').value) || 0;

    // Preparar dados completos (11 históricos + mês vigente)
    const fullLabels = [...historicoData.labels, mesReferencia];
    const fullValores = [...historicoData.valores, valorCredito];

    // Atualizar gráfico da interface
    historicoChart.data.labels = fullLabels.map(abreviarMes);
    historicoChart.data.datasets[0].data = fullValores;
    historicoChart.update();

    // Atualizar gráfico da prévia
    pdfHistoricoChart.data.labels = fullLabels.map(abreviarMes);
    pdfHistoricoChart.data.datasets[0].data = fullValores;
    pdfHistoricoChart.update();

    // Atualizar a prévia
    updatePreview();
}

// Função para formatar o mês de referência (ex.: "2025-03" -> "Março 2025")
function formatarMesReferencia(valor) {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    if (valor) {
        const [ano, mes] = valor.split('-');
        return `${meses[parseInt(mes) - 1]}/${ano}`;
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

// Função para formatar valores monetários (ex.: 0.50 -> "0,50")
function formatarValorMonetario(valor) {
    if (!valor && valor !== 0) return ''; // Retorna vazio se valor for undefined ou null
    const numero = parseFloat(valor);
    if (isNaN(numero)) return ''; // Retorna vazio se não for um número válido
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função para atualizar a prévia em tempo real
function updatePreview() {
    const nomeInvestidor = document.getElementById('nome-investidor').value || 'Investidor Não Informado';
    const leituraAnterior = document.getElementById('leitura-anterior').value;
    const leituraAtual = document.getElementById('leitura-atual').value;
    const proximaLeitura = document.getElementById('proxima-leitura').value;
    const mesReferencia = formatarMesReferencia(document.getElementById('mes-referencia').value);
    const valorCredito = document.getElementById('valor-credito').value || '';
    const valorLocacao = document.getElementById('valor-locacao').value || '';
    const faturaCopel = document.getElementById('fatura-copel').value || '';
    const valorKwh = document.getElementById('valor-kwh').value || '';
    const energiaGerada = document.getElementById('energia-gerada').value || '';
    const energiaConsumida = document.getElementById('energia-consumida').value || '';
    const energiaEnviada = document.getElementById('energia-enviada').value || '';
    const totalConsumido = document.getElementById('total-consumido').value || '';
    const totalAcumulado = document.getElementById('total-acumulado').value || '';
    const retornoAcumulado = document.getElementById('retorno-acumulado').value || '';

    // Preencher o template do PDF
    document.getElementById('pdf-nome-investidor').textContent = nomeInvestidor;
    document.getElementById('pdf-leitura-anterior').textContent = formatarData(leituraAnterior);
    document.getElementById('pdf-leitura-atual').textContent = formatarData(leituraAtual);
    document.getElementById('pdf-proxima-leitura').textContent = formatarData(proximaLeitura);
    document.getElementById('pdf-mes-referencia').textContent = mesReferencia;
    document.getElementById('pdf-valor-credito').textContent = `R$ ${formatarValorMonetario(valorCredito)}`;
    document.getElementById('pdf-valor-locacao').textContent = `R$ ${formatarValorMonetario(valorLocacao)}`;
    document.getElementById('pdf-fatura-copel').textContent = `R$ ${formatarValorMonetario(faturaCopel)}`;
    document.getElementById('pdf-valor-kwh').textContent = `R$ ${formatarValorMonetario(valorKwh)}`;
    document.getElementById('pdf-energia-gerada').textContent = `${energiaGerada} kWh`;
    document.getElementById('pdf-energia-consumida').textContent = `${energiaConsumida} kWh`;
    document.getElementById('pdf-energia-enviada').textContent = `${energiaEnviada} kWh`;
    document.getElementById('pdf-total-consumido').textContent = `${totalConsumido} kWh`;
    document.getElementById('pdf-total-acumulado').textContent = `${totalAcumulado} kWh`;
    document.getElementById('pdf-retorno-acumulado').textContent = `R$ ${formatarValorMonetario(retornoAcumulado)}`;

    // Preencher a tabela "Recebimento (R$)" com 11 históricos + mês vigente
    const recebimentoTableBody = document.getElementById('pdf-recebimentoTableBody');
    recebimentoTableBody.innerHTML = ''; // Limpar a tabela
    const mesRefAbrev = mesReferencia.split('/')[0]; // Pegar apenas o mês
    const fullLabels = [...historicoData.labels, mesRefAbrev];
    const fullValores = [...historicoData.valores, parseFloat(valorCredito) || 0];

    for (let i = 0; i < fullLabels.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${fullLabels[i]}</td><td>R$ ${formatarValorMonetario(fullValores[i])}</td>`;
        recebimentoTableBody.appendChild(row);
    }
}

// Função para gerar o PDF
function generatePDF() {
    const mesReferenciaInput = document.getElementById('mes-referencia').value.split('-');
    const mesReferencia = mesReferenciaInput.length > 1 ? numeroParaMes(mesReferenciaInput[1]) : 'Atual';
    const valorCredito = parseFloat(document.getElementById('valor-credito').value) || 0;

    // Preparar dados completos (11 históricos + mês vigente)
    const fullLabels = [...historicoData.labels, mesReferencia];
    const fullValores = [...historicoData.valores, valorCredito];

    // Atualizar gráfico da prévia antes de gerar o PDF
    pdfHistoricoChart.data.labels = fullLabels.map(abreviarMes);
    pdfHistoricoChart.data.datasets[0].data = fullValores;
    pdfHistoricoChart.update();

    // Atualizar a prévia
    updatePreview();

    // Garantir que a logo seja carregada
    const logoImg = document.querySelector('#pdf-template .logo img');
    logoImg.src = './Assets/logoG.png'; // Certifique-se de que o caminho está correto

    // Inserir o QR Code (usando uma imagem estática)
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = './Assets/2.png'; // Substitua pelo caminho correto da sua imagem de QR Code
    qrCodeContainer.appendChild(qrCodeImg);

    // Aguardar a renderização completa do gráfico antes de capturar
    setTimeout(() => {
        const element = document.getElementById('pdf-template');
        html2canvas(element, { 
            scale: 2.5, // Aumentado para melhorar a resolução
            useCORS: true, // Para carregar imagens externas
            logging: true // Para depuração
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png', 1.0); // Qualidade máxima
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Ajustar para caber em uma página
            if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                const scaleFactor = pdf.internal.pageSize.getHeight() / pdfHeight;
                const scaledWidth = pdfWidth * scaleFactor;
                const scaledHeight = pdfHeight * scaleFactor;
                pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            // Usar o nome do investidor como nome do arquivo
            const nomeInvestidor = document.getElementById('nome-investidor').value || 'Investidor_Não_Informado';
            const nomeArquivo = `${nomeInvestidor.replace(/\s+/g, '_')}_relatorio.pdf`;
            pdf.save(nomeArquivo);
        }).catch(error => {
            console.error('Erro ao gerar o PDF com html2canvas:', error);
        });
    }, 1500); // Aumentado para garantir que o gráfico esteja renderizado
}

// Inicializar a prévia ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Atualizar gráficos e prévia com os dados preenchidos
    updateChartsAndPreview();

    // Garantir que a logo seja carregada
    const logoImg = document.querySelector('#pdf-template .logo img');
    logoImg.src = './Assets/logoG.png'; // Certifique-se de que o caminho está correto

    // Inserir o QR Code (usando uma imagem estática)
    const qrCodeContainer = document.getElementById('qrcode');
    qrCodeContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = './Assets/2.png'; // Substitua pelo caminho correto da sua imagem de QR Code
    qrCodeContainer.appendChild(qrCodeImg);
});