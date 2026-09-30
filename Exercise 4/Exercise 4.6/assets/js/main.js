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
    // 4. Exercise 4.7: Adding Labels to the Bar Chart
    // ========================================================
    const svgContainer = d3.select(".responsive-svg-container");

    if (!svgContainer.empty()) {
        // SVG Canvas with viewBox (Set to 650 width so right labels don't get clipped)
        const svg = svgContainer
            .append("svg")
            .attr("viewBox", "0 0 650 500")
            .style("border", "1px solid black");

        // Function to build bar chart with groups and labels
        const drawBarChart = data => {
            // Linear scale for bar lengths
            const xScale = d3.scaleLinear()
                .domain([0, 1100])
                .range([0, 500]);

            // Band scale for brand positioning down the Y axis
            const yScale = d3.scaleBand()
                .domain(data.map(d => d.brand))
                .range([0, 500])
                .padding(0.1);

            // Group each brand's bar and text labels together in a <g> element
            const barAndLabel = svg
                .selectAll("g")
                .data(data)
                .join("g")
                .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

            // 1. Draw the bar rectangle
            barAndLabel
                .append("rect")
                .attr("width", d => xScale(d.count))
                .attr("height", yScale.bandwidth())
                .attr("fill", "blue")
                .attr("x", 100)
                .attr("y", 0);

            // 2. Draw the brand name label on the left (right-aligned at x=90)
            barAndLabel
                .append("text")
                .text(d => d.brand)
                .attr("x", 90)
                .attr("y", 15)
                .attr("text-anchor", "end")
                .style("font-size", "13px");

            // 3. Draw the count value label at the right tip of the bar
            barAndLabel
                .append("text")
                .text(d => d.count)
                .attr("x", d => 100 + xScale(d.count) + 4)
                .attr("y", 12)
                .style("font-size", "13px");
        };

        // Load data, sort descending, and render
        const loadData = path => {
            d3.csv(path, d => ({
                brand: d.brand,
                count: +d.count
            })).then(data => {
                console.log(data);
                console.log(data.length);
                console.log(d3.max(data, d => d.count));
                console.log(d3.min(data, d => d.count));

                data.sort((a, b) => b.count - a.count);
                drawBarChart(data);
            }).catch(() => {
                if (path === "data/tvBrandCount.csv") {
                    loadData("../data/tvBrandCount.csv");
                }
            });
        };

        loadData("data/tvBrandCount.csv");
    }
});