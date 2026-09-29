// Ensure DOM is fully loaded before attaching scripts
document.addEventListener('DOMContentLoaded', () => {

    // 1. Footer Year Autoupdate
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. FAQ Accordion Logic
    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // 3. Interactive Energy Calculator
    const energyForm = document.getElementById('energy-form');
    if (energyForm) {
        energyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const watts = parseFloat(document.getElementById('power').value);
            const hours = parseFloat(document.getElementById('hours').value);
            const priceCents = parseFloat(document.getElementById('price').value);

            const errorMsg = document.getElementById('form-error');
            const resultsPanel = document.getElementById('results-panel');

            if (isNaN(watts) || isNaN(hours) || isNaN(priceCents) || watts <= 0 || hours <= 0 || priceCents <= 0) {
                errorMsg.classList.remove('hidden');
                resultsPanel.classList.add('hidden');
                return;
            }

            errorMsg.classList.add('hidden');

            const dailyKwh = (watts * hours) / 1000;
            const monthlyKwh = dailyKwh * 30;
            const yearlyKwh = dailyKwh * 365;

            const priceDollars = priceCents / 100;
            const dailyCost = dailyKwh * priceDollars;
            const monthlyCost = monthlyKwh * priceDollars;
            const yearlyCost = yearlyKwh * priceDollars;

            document.getElementById('res-daily-kwh').textContent = `${dailyKwh.toFixed(2)} kWh`;
            document.getElementById('res-daily-cost').textContent = `$${dailyCost.toFixed(2)}`;

            document.getElementById('res-monthly-kwh').textContent = `${monthlyKwh.toFixed(2)} kWh`;
            document.getElementById('res-monthly-cost').textContent = `$${monthlyCost.toFixed(2)}`;

            document.getElementById('res-yearly-kwh').textContent = `${yearlyKwh.toFixed(2)} kWh`;
            document.getElementById('res-yearly-cost').textContent = `$${yearlyCost.toFixed(2)}`;

            resultsPanel.classList.remove('hidden');
        });
    }
});