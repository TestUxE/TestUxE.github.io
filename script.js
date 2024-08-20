document.addEventListener('DOMContentLoaded', function() {
    const incomeField = document.getElementById('income');
    const costsField = document.getElementById('costs');
    const sponsorshipField = document.getElementById('sponsorship');
    const taxRateField = document.getElementById('taxRate');
    const calculateButton = document.getElementById('calculate');
    const formError = document.getElementById('form-error');
    const resultTable = document.getElementById('result-table');

    function validateAndCleanInput(event) {
        const inputField = event.target;
        const value = inputField.value;

        if (!/^\d*$/.test(value)) {
            inputField.value = value.replace(/\D/g, ''); 
        }

        if (value.startsWith('0')) {
            inputField.value = value.replace(/^0+/, '');
        }
    }

    function validateAndCleanInputPerc(event) {
        const inputField = event.target;
        const value = inputField.value;

        if (!/^\d*$/.test(value)) {
            inputField.value = value.replace(/\D/g, ''); 
        }
        if (value.length > 2) {
            inputField.value = value.substring(0, 2);
        }

        if (value.startsWith('0')) {
            inputField.value = value.replace(/^0+/, '');
        }
    }

    function validateFormCompletion() {
        const income = parseInt(incomeField.value);
        const costs = parseInt(costsField.value);
        const sponsorship = parseInt(sponsorshipField.value);
        if (incomeField.value && costsField.value && sponsorshipField.value && taxRateField.value && costs + sponsorship < income) {
            calculateButton.disabled = false;
            calculateButton.style.cursor = 'pointer';
        } else {
            calculateButton.disabled = true;
            calculateButton.style.cursor = 'not-allowed';
        }
        if (costs + sponsorship > income){
            formError.textContent = "El beneficio no podrá generar pérdida";
        }
    }
    

    function formatCurrency(value) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    }
    
    function calculateAndDisplayResults() {
        const percDeducibilidad = 1.5;
        const perPLU = 0.15;
        const income = parseInt(incomeField.value);
        const costs = parseInt(costsField.value);
        const sponsorship = parseInt(sponsorshipField.value);
        const taxRate = parseFloat(taxRateField.value) / 100;
    
        const costsWithoutSponsorship = costs + sponsorship;
        const costsWithSponsorship = costs;
    
        const utilityWithoutSponsorship = income - costsWithoutSponsorship;
        const utilityWithSponsorship = income - costsWithSponsorship - sponsorship;


        const taxDeductionWithoutSponsorship = 0;
        const taxDeductionWithSponsorship = sponsorship * percDeducibilidad;

        const PLUWithoutSponsorship = utilityWithoutSponsorship * perPLU;
        const PLUWithSponsorship = utilityWithSponsorship * perPLU;
    
        const taxableAmountWithoutSponsorship = utilityWithoutSponsorship - taxDeductionWithoutSponsorship - PLUWithoutSponsorship;
        const taxableAmountWithSponsorship = utilityWithSponsorship - taxDeductionWithSponsorship - PLUWithSponsorship;
    
        const netTaxesWithoutSponsorship = taxableAmountWithoutSponsorship * taxRate;
        const netTaxesWithSponsorship = taxableAmountWithSponsorship * taxRate;
    
        const profitAfterTaxesWithoutSponsorship = utilityWithSponsorship - PLUWithSponsorship - netTaxesWithoutSponsorship;
        const profitAfterTaxesWithSponsorship = utilityWithoutSponsorship - PLUWithoutSponsorship - netTaxesWithSponsorship;

        const overallProfitWithoutSponsorship = 0;
        const overallProfitWithSponsorship = profitAfterTaxesWithSponsorship - profitAfterTaxesWithoutSponsorship;


    
        // Create and display the result table
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Datos</th>
                        <th>Sin Beneficio</th>
                        <th>Con Beneficio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="lateral-cell">Ingresos</td>
                        <td>${formatCurrency(income)}</td>
                        <td>${formatCurrency(income)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Costos y Gastos - Otros</td>
                        <td>${formatCurrency(costsWithoutSponsorship)}</td>
                        <td>${formatCurrency(costsWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Costos y Gastos - PATROCINIO</td>
                        <td>${formatCurrency(0)}</td>
                        <td>${formatCurrency(sponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Utilidad Contable</td>
                        <td>${formatCurrency(utilityWithoutSponsorship)}</td>
                        <td>${formatCurrency(utilityWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">15% Trabajadores</td>
                        <td>${formatCurrency(PLUWithoutSponsorship)}</td>
                        <td>${formatCurrency(PLUWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Deducciones Adicionales 150%</td>
                        <td class="highlighted-cell-2">${formatCurrency(taxDeductionWithoutSponsorship)}</td>
                        <td class="highlighted-cell-2">${formatCurrency(taxDeductionWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Base Imponible Impuesto a la Renta</td>
                        <td>${formatCurrency(taxableAmountWithoutSponsorship)}</td>
                        <td>${formatCurrency(taxableAmountWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Impuesto a la Renta Causado</td>
                        <td>${formatCurrency(netTaxesWithoutSponsorship)}</td>
                        <td>${formatCurrency(netTaxesWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="lateral-cell">Ganancia Total</td>
                        <td>${formatCurrency(profitAfterTaxesWithoutSponsorship)}</td>
                        <td>${formatCurrency(profitAfterTaxesWithSponsorship)}</td>
                    </tr>
                    <tr>
                        <td class="highlighted-cell">BENEFICIO POR INVERTIR EN CULTURA</td>
                        <td class="highlighted-cell-2">${formatCurrency(overallProfitWithoutSponsorship)}</td>
                        <td class="highlighted-cell-2">${formatCurrency(overallProfitWithSponsorship)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    
        resultTable.innerHTML = tableHTML;
    }

    incomeField.addEventListener('input', validateAndCleanInput);
    costsField.addEventListener('input', validateAndCleanInput);
    taxRateField.addEventListener('input', validateAndCleanInputPerc);
    sponsorshipField.addEventListener('input', validateAndCleanInput);
    incomeField.addEventListener('input', validateFormCompletion);
    costsField.addEventListener('input', validateFormCompletion);
    sponsorshipField.addEventListener('input', validateFormCompletion);
    taxRateField.addEventListener('change', validateFormCompletion);

    calculateButton.addEventListener('click', function() {
        if (!incomeField.value || !costsField.value || !sponsorshipField.value || !taxRateField.value) {
            formError.textContent = "Please fill all the inputs.";
        } else {
            formError.textContent = "";
            calculateAndDisplayResults();
        }
    });
});
