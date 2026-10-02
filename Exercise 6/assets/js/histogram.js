/* ========================================================
   Exercise 6.1: Histogram Drawing Implementation
   ======================================================== */

const drawHistogram = (data) => {
    // 1. Create SVG inside the template card
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 2. Generate bins
    const bins = binGenerator(data);
    console.log("Generated Bins (14 groups):", bins);

    // 3. Define scale domains
    const minEnergy = bins[0].x0;
    const maxEnergy = bins[bins.length - 1].x1;
    const binsMaxLength = d3.max(bins, d => d.length);

    xScale
        .domain([minEnergy, maxEnergy])
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice();

    // 4. Draw histogram bars
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor) // White gap stroke
        .attr("stroke-width", 2);

    // 5. Add Axes
    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    // X Axis
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Y Axis
    innerChart
        .append("g")
        .call(leftAxis);

    // X Axis Label
    innerChart
        .append("text")
        .text("Energy Consumption (kWh/year)")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle");

    // Y Axis Label
    innerChart
        .append("text")
        .text("Frequency (Number of TVs)")
        .attr("class", "axis-label")
        .attr("x", -margin.left + 15)
        .attr("y", -15)
        .attr("text-anchor", "start");
};