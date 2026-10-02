/* ========================================================
   Exercise 6.3: Scatterplot with Colour Coded Legend
   ======================================================== */

const drawScatterplot = (data) => {

    // 1. Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    // Create an inner chart group with margins (stores in global innerChartS)
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 2. Set up scales for Scatterplot
    // X-Axis: Star Rating
    xScaleS
        .domain([0, d3.max(data, d => d.star)])
        .range([0, innerWidth])
        .nice();

    // Y-Axis: Energy Consumption (kWh/year)
    yScaleS
        .domain([0, d3.max(data, d => d.energyConsumption)])
        .range([innerHeight, 0])
        .nice();

    // Custom Accessible & Brand-Aligned Color Scale
    colorScale
        .domain(["LED", "OLED", "LCD"])
        .range(["#2563eb", "#d97706", "#059669"]); // Royal Blue, Warm Amber, Emerald

    // 3. Draw Circles for each TV model
    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 4)
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5); // Opacity makes overlapping points visible

    // 4. Add Axes
    const bottomAxis = d3.axisBottom(xScaleS);
    const leftAxis = d3.axisLeft(yScaleS);

    // Bottom Axis (Star Rating)
    innerChartS
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Left Axis (Energy Consumption)
    innerChartS
        .append("g")
        .call(leftAxis);

    // X Axis Label
    innerChartS
        .append("text")
        .text("Star Rating (Stars)")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle");

    // Y Axis Label
    innerChartS
        .append("text")
        .text("Energy Consumption (kWh/year)")
        .attr("class", "axis-label")
        .attr("x", -margin.left + 15)
        .attr("y", -15)
        .attr("text-anchor", "start");

    // 5. Add Legend for the Colour Scale
    const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 100}, ${margin.top})`); // Position in top-right

    // Loop through the colour scale domain to create legend entries
    colorScale.domain().forEach((screenTech, i) => {
        // Create a group for each legend entry
        const legendRow = legend
            .append("g")
            .attr("transform", `translate(0, ${i * 20})`); // Space rows vertically by 20px

        // Add a coloured rectangle for each screenTech
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(screenTech));

        // Add text next to the rectangle
        legendRow.append("text")
            .attr("x", 20)  // Position text to the right of the rectangle
            .attr("y", 10)  // Align text with rectangle
            .attr("text-anchor", "start")
            .style("alignment-baseline", "middle")
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("fill", "#334155")
            .text(screenTech);
    });
};