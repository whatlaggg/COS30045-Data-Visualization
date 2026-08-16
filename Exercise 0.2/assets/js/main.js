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
            // Toggle active state for styling
            this.classList.toggle('active');

            // Get the associated panel (the next sibling div)
            const panel = this.nextElementSibling;

            // Toggle panel height
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null; // Hide it
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px"; // Reveal it
            }
        });
    });

    // 3. Interactive Energy Calculator
    const energyForm = document.getElementById('energy-form');

    if (energyForm) {
        energyForm.addEventListener('submit', function (e) {
            // Prevent page reload
            e.preventDefault();

            // DOM elements
            const powerInput = document.getElementById('power').value;
            const hoursInput = document.getElementById('hours').value;
            const priceInput = document.getElementById('price').value;

            const errorMsg = document.getElementById('form-error');
            const resultsPanel = document.getElementById('results-panel');

            // Parse inputs as floats
            const watts = parseFloat(powerInput);
            const hours = parseFloat(hoursInput);
            const priceCents = parseFloat(priceInput);

            // Validation: Ensure values are numbers and greater than 0
            if (isNaN(watts) || isNaN(hours) || isNaN(priceCents) || watts <= 0 || hours <= 0 || priceCents <= 0) {
                errorMsg.classList.remove('hidden');
                resultsPanel.classList.add('hidden');
                return;
            }

            // Hide error if validation passes
            errorMsg.classList.add('hidden');

            // Calculations
            // Formula: (Watts * Hours / 1000) = kWh per day
            const dailyKwh = (watts * hours) / 1000;
            const monthlyKwh = dailyKwh * 30; // Assuming 30-day month
            const yearlyKwh = dailyKwh * 365;

            // Cost calculation: (kWh * Cents / 100) = Dollars
            const priceDollars = priceCents / 100;
            const dailyCost = dailyKwh * priceDollars;
            const monthlyCost = monthlyKwh * priceDollars;
            const yearlyCost = yearlyKwh * priceDollars;

            // Update DOM Results Panel
            document.getElementById('res-daily-kwh').textContent = `${dailyKwh.toFixed(2)} kWh`;
            document.getElementById('res-daily-cost').textContent = `$${dailyCost.toFixed(2)}`;

            document.getElementById('res-monthly-kwh').textContent = `${monthlyKwh.toFixed(2)} kWh`;
            document.getElementById('res-monthly-cost').textContent = `$${monthlyCost.toFixed(2)}`;

            document.getElementById('res-yearly-kwh').textContent = `${yearlyKwh.toFixed(2)} kWh`;
            document.getElementById('res-yearly-cost').textContent = `$${yearlyCost.toFixed(2)}`;

            // Reveal the results panel
            resultsPanel.classList.remove('hidden');
        });
    }
});