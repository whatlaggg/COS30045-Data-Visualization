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
    // 4. Exercise 4.6: D3 Linear & Band Scales
    // ========================================================
    const svgContainer = d3.select(".responsive-svg-container");

    if (!svgContainer.empty()) {
        // 1. Create SVG with a 500x500 square viewBox
        const svg = svgContainer
            .append("svg")
            .attr("viewBox", "0 0 500 500")
            .style("border", "1px solid black");

        // 2. Define drawBarChart using d3.scaleLinear and d3.scaleBand
        const drawBarChart = data => {
            // Linear scale for continuous count data (0 to 1100 mapped to 0 to 500px width)
            const xScale = d3.scaleLinear()
                .domain([0, 1100])
                .range([0, 500]);

            // Band scale for categorical brand names mapped evenly down 0 to 500px height
            const yScale = d3.scaleBand()
                .domain(data.map(d => d.brand))
                .range([0, 500])
                .padding(0.1);

            // Draw bars sized and positioned by the scales
            svg
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("width", d => xScale(d.count))
                .attr("height", yScale.bandwidth())
                .attr("fill", "blue")
                .attr("x", 0)
                .attr("y", d => yScale(d.brand));
        };

        // 3. Load CSV data, sort descending, and pass to drawBarChart
        const loadData = path => {
            d3.csv(path, d => ({
                brand: d.brand,
                count: +d.count
            })).then(data => {
                data.sort((a, b) => b.count - a.count);
                drawBarChart(data);
            }).catch(() => {
                // Fallback in case the file is referenced relative to the parent directory
                if (path === "data/tvBrandCount.csv") {
                    loadData("../data/tvBrandCount.csv");
                }
            });
        };

        loadData("data/tvBrandCount.csv");
    }
});