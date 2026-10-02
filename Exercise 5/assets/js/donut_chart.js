/* ========================================================
   Exercise 5.3: TV Screen Size Category Donut Chart
   ======================================================== */

// 1. Chart Drawing Function
const drawDonutChart = data => {

    // --- Chart Dimensions & Radius ---
    const width = 1000;
    const height = 500;
    // Calculate maximum radius fitting inside the canvas with 20px boundary padding
    const radius = Math.min(width, height) / 2 - 20;

    // --- Create Color Scale ---
    // d3.scaleOrdinal maps discrete categories to distinct palette colours
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.Screensize_Category))
        .range(d3.schemeSet2);

    // --- Calculate Slice Angles ---
    // .sort(null) preserves the logical sequence of sizes (large -> medium -> small)
    // rather than scrambling slices by numerical count value
    const pie = d3.pie()
        .value(d => d.Count)
        .sort(null);

    // --- Set up Arc Generator ---
    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6)  // Inner radius (donut cutout at 60%)
        .outerRadius(radius * 1.0)  // Outer radius (100% of available radius)
        .padAngle(0.02)             // Small gap between adjacent slices
        .cornerRadius(6);           // Subtle rounded corners on slice edges

    // --- Create SVG Canvas & Inner Chart Group ---
    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    // In a donut/pie chart, origin (0,0) must sit at the canvas center
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // --- Draw Donut Slices ---
    innerChart
        .selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.Screensize_Category))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // --- Add Slice Labels (Using arcGenerator.centroid) ---
    // arcGenerator.centroid(d) computes the geometric midpoint [x, y] of each arc slice
    innerChart
        .selectAll(".slice-label")
        .data(pie(data))
        .join("text")
        .attr("class", "slice-label")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em") // Vertically centers text on the anchor point
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#1e293b")
        .text(d => {
            const category = d.data.Screensize_Category.charAt(0).toUpperCase() + d.data.Screensize_Category.slice(1);
            return `${category}: ${d.data.Count}`;
        });

    // --- Center Badge Text ---
    const totalModels = d3.sum(data, d => d.Count);
    innerChart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .style("font-family", "sans-serif")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .style("fill", "#0f172a")
        .text("Total TVs");

    innerChart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.3em")
        .style("font-family", "sans-serif")
        .style("font-size", "18px")
        .style("fill", "#64748b")
        .text(totalModels.toLocaleString());
};

// 2. Load Data from CSV
const loadDonutData = path => {
    d3.csv(path, d => ({
        // Handles potential UTF-8 Byte Order Mark (BOM) in raw CSV exports
        Screensize_Category: d.Screensize_Category || d["\ufeffScreensize_Category"],
        Count: +d.Count
    })).then(data => {
        console.log("Loaded Donut Data:", data);

        // Render the donut chart
        drawDonutChart(data);
    }).catch(err => {
        console.error("Error loading CSV:", err);
        // Fallback relative path in case folder nesting differs
        if (path === "data/Data_exercise 5.3.csv") {
            loadDonutData("../data/Data_exercise 5.3.csv");
        }
    });
};

loadDonutData("data/Data_exercise 5.3.csv");