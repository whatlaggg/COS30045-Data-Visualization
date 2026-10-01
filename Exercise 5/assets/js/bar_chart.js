//Exercise 5.1: Vertical Bar Chart with Scaled Axes & Labels

// 1. Define the chart drawing function
const drawBarChart = data => {

    // --- Margin Convention ---
    const margin = { top: 50, right: 40, bottom: 40, left: 60 };
    const width = 1000;
    const height = 550;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // --- Create SVG Container ---
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // --- Create Inner Chart Group ---
    // Translates the origin (0,0) inward by left and top margins
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // --- Set up Scales  ---
    // X Scale: Categorical Band Scale for Screen Technologies
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, innerWidth])
        .padding(0.12);

    // Y Scale: Continuous Linear Scale
    // Set domain up to 390 (or max * 1.06) so bars don't hit the ceiling and labels fit
    const yScale = d3.scaleLinear()
        .domain([0, 390])
        .range([innerHeight, 0]);

    // --- Define Axes  ---
    // .tickSize(0) removes protruding tick marks on the bottom axis for a cleaner look
    const bottomAxis = d3.axisBottom(xScale)
        .tickSize(0);

    // Ticks spaced every 50 kWh: 0, 50, 100, 150, 200, 250, 300, 350
    const leftAxis = d3.axisLeft(yScale)
        .ticks(8);

    // --- Append Axes to innerChart  ---
    // Bottom (X) Axis
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis)
        .selectAll("text")
        .style("font-size", "16px")
        .style("font-family", "sans-serif")
        .attr("dy", "18px"); // Push label text slightly lower below the baseline

    // Left (Y) Axis
    innerChart
        .append("g")
        .call(leftAxis)
        .selectAll("text")
        .style("font-size", "12px")
        .style("font-family", "sans-serif");

    // --- Add Y-Axis Title Label  ---
    innerChart
        .append("text")
        .text("Energy Consumption (kWh)")
        .attr("x", -margin.left + 15)
        .attr("y", -20)
        .attr("text-anchor", "start")
        .style("font-size", "18px")
        .style("font-family", "sans-serif")
        .style("font-weight", "bold")
        .style("fill", "#000000");

    // --- Draw Bars ---
    innerChart
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", d => yScale(d.Energy_Consumption))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
        .attr("fill", "green");

    // --- Add Value Labels on Top of Bars ---
    innerChart
        .selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .text(d => `${Math.round(d.Energy_Consumption)} kWh`)
        .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.Energy_Consumption) - 8)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", "sans-serif")
        .style("fill", "#000000");
};

// 2. Load Data from CSV & Type Cast
const loadData = path => {
    d3.csv(path, d => {
        return {
            // Convert 'led' -> 'LED', 'oled' -> 'OLED', 'lcd' -> 'LCD'
            Screen_Tech: d.Screen_Tech.toUpperCase(),
            // Extract numeric value from Mean column
            Energy_Consumption: +(d["Mean(Labelled energy consumption (kWh/year))"] || d.Energy_Consumption)
        };
    }).then(data => {
        console.log("Loaded 5.1 Data:", data);

        // Sort descending: LED (369) > OLED (362) > LCD (335)
        data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);

        // Render the bar chart
        drawBarChart(data);
    }).catch(err => {
        console.error("Error loading CSV:", err);
        // Fallback relative path in case folder is placed one directory up
        if (path === "data/Data_exercise 5.1-1.csv") {
            loadData("../data/Data_exercise 5.1-1.csv");
        }
    });
};

// Execute data load
loadData("data/Data_exercise 5.1-1.csv");