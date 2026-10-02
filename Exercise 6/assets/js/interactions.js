// --- Exercise 6.2: Filter Controls for Histogram ---
const populateFilters = (data) => {
    let activeTech = "all";
    let activeSize = "all";

    const updateHistogram = () => {
        let updatedData = data;

        if (activeTech !== "all") {
            updatedData = updatedData.filter(tv => tv.screenTech === activeTech);
        }

        if (activeSize !== "all") {
            updatedData = updatedData.filter(tv => tv.screenSize === activeSize);
        }

        const updatedBins = binGenerator(updatedData);

        d3.selectAll("#histogram rect")
            .data(updatedBins)
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    };

    // Screen Technology Buttons (Above Histogram)
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                filters_screen.forEach(filter => {
                    filter.isActive = (filter.id === d.id);
                });

                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id);

                activeTech = d.id;
                updateHistogram();
            }
        });

    // Screen Size Buttons (Below Histogram Extension)
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                filters_size.forEach(filter => {
                    filter.isActive = (filter.id === d.id);
                });

                d3.selectAll("#filters_size .filter")
                    .classed("active", filter => filter.id === d.id);

                activeSize = d.id;
                updateHistogram();
            }
        });
};

// ========================================================
// Exercise 6.4: Tooltip Construction & Mouse Event Handlers
// ========================================================

// 1. Build the Tooltip Container and Elements
const createTooltip = (data) => {
    // Append tooltip group to the scatterplot's innerChart
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none"); // Prevents tooltip box from blocking hover on circles underneath

    // Append tooltip background rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)                      // Rounded horizontal corners
        .attr("ry", 3)                      // Rounded vertical corners
        .attr("fill", barColor)             // Deep blue matching brand theme
        .attr("fill-opacity", 0.85);        // Subtle transparency to see underlying points

    // Append tooltip label text
    tooltip
        .append("text")
        .text("NA")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-family", "sans-serif")
        .style("font-size", "13px")
        .style("font-weight", 700);
};

// 2. Attach Mouse Events to Scatterplot Circles
const handleMouseEvents = () => {
    innerChartS
        .selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);

            // 1. Update text to show screen size
            d3.select(".tooltip text")
                .text(`${d.screenSize}"`);

            // 2. Extract coordinates of the hovered circle
            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");

            // 3. Position tooltip above circle center and fade in smoothly
            d3.select(".tooltip")
                .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);

            // 4. Fade out tooltip and move off-screen
            d3.select(".tooltip")
                .transition()
                .duration(150)
                .style("opacity", 0)
                .attr("transform", `translate(0, 500)`);
        });
};