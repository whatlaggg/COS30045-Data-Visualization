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

    // ========================================================
    // 4. Exercise 4.3 & 4.4: D3 Canvas Setup and CSV Data Load
    // ========================================================
    const svgContainer = d3.select(".responsive-svg-container");

    if (!svgContainer.empty()) {
        // Step 2 from Ex 4.3: Create responsive SVG container
        const svg = svgContainer
            .append("svg")
            .attr("viewBox", "0 0 1200 1600")
            .style("border", "1px solid black");

        // Try 'data/tvBrandCount.csv' if inside current folder, or '../data/tvBrandCount.csv' if one level up
        const dataPath = "data/tvBrandCount.csv";

        // Step 1 & 2: Row accessor function converting count string into a number (+d.count)
        d3.csv(dataPath, d => {
            return {
                brand: d.brand || d.Brand || d.Brand_Reg,
                count: +(d.count || d.Count || d["Number of Models"] || 0)
            };
        }).then(data => {
            // Step 3: Inspect dataset metrics in Console
            console.log("Loaded Data Array:", data);
            console.log("Total Records (length):", data.length);
            console.log("Max Count:", d3.max(data, d => d.count));
            console.log("Min Count:", d3.min(data, d => d.count));
            console.log("Extent [min, max]:", d3.extent(data, d => d.count));

            // Sort data descending by count
            data.sort((a, b) => b.count - a.count);
            console.log("Sorted Data (descending):", data);

            // Pass cleaned data to the chart builder
            drawBarChart(data, svg);
        }).catch(error => {
            console.error("Error loading CSV file:", error);
            // Fallback attempt with '../data/tvBrandCount.csv' if the first path failed
            d3.csv("../data/tvBrandCount.csv", d => ({
                brand: d.brand || d.Brand,
                count: +(d.count || d.Count || 0)
            })).then(data => {
                data.sort((a, b) => b.count - a.count);
                drawBarChart(data, svg);
            });
        });
    }
});

// Placeholder function for Exercise 4.5
function drawBarChart(data, svg) {
    console.log("drawBarChart called successfully with", data.length, "items.");
}