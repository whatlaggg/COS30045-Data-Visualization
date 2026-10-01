const drawLineChart = data => {
//code goes here
    // --- Margins and Dimensions (Identical to Exercise 5.1) ---
    const margin = { top: 40, right: 170, bottom: 25, left: 40 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // --- Create SVG Container ---
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    // --- Create Inner Chart Group ---
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // --- Create Scales ---
    // xScale: Linear continuous scale using extent to capture [1998, 2024]
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    // yScale: Linear continuous scale from 0 to maximum average price
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .range([innerHeight, 0]);

    // --- Set up Axes ---
    // Format ticks as integers using "d" so years don't show commas or decimals (e.g. 2000, not 2,000)
    const bottomAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));

    const leftAxis = d3.axisLeft(yScale);

    // Define the line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));

    // --- Append Axes to Inner Chart Group ---
    // Bottom (X) Axis: translated to the bottom edge
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Left (Y) Axis
    innerChart
        .append("g")
        .call(leftAxis);

    // --- Add Y-Axis Label ---
    innerChart
        .append("text")
        .text("Average Price ($/MWh)")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-family", "sans-serif")
        .style("fill", "#000000");
    
    // Draw Scatter Plot points
    innerChart
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 4)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice))
        .attr("fill", "green");

    // Append the path to innerChart
    innerChart
        .append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "green");
};

// 2. Load and Type-Cast CSV Data
const loadPriceData = path => {
    d3.csv(path, d => ({
        // Ensure year is parsed as an integer number
        year: +d.Year,
        // Map the exact CSV column header into averagePrice as a number
        averagePrice: +d["Average Price (notTas-Snowy)"]
    })).then(data => {
        console.log("Loaded 5.2 Spot Price Data:", data);
        console.log("Year Extent:", d3.extent(data, d => d.year));
        console.log("Max Price:", d3.max(data, d => d.averagePrice));

        // Draw the chart axes and containers
        drawLineChart(data);
    }).catch(err => {
        console.error("Error loading CSV:", err);
        // Fallback relative path in case folder level differs
        if (path === "data/ARE_Spot_Prices.csv") {
            loadPriceData("../data/ARE_Spot_Prices.csv");
        }
    });
};

loadPriceData("data/ARE_Spot_Prices.csv");