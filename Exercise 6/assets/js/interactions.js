/* ========================================================
   Exercise 6.2: Interactive Filter Controls & Extension
   ======================================================== */

const populateFilters = (data) => {

    // Track active selection states
    let activeTech = "all";
    let activeSize = "all";

    // Reusable function to filter data and update the histogram bars
    const updateHistogram = () => {
        let updatedData = data;

        // Apply screen technology filter
        if (activeTech !== "all") {
            updatedData = updatedData.filter(tv => tv.screenTech === activeTech);
        }

        // Apply screen size filter
        if (activeSize !== "all") {
            updatedData = updatedData.filter(tv => tv.screenSize === activeSize);
        }

        // Generate updated bins
        const updatedBins = binGenerator(updatedData);

        // Transition the bar heights smoothly
        d3.selectAll("#histogram rect")
            .data(updatedBins)
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    };

    // 1. Render Screen Tech Filters (Above the histogram)
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                // Update active states in dataset
                filters_screen.forEach(filter => {
                    filter.isActive = (filter.id === d.id);
                });

                // Toggle CSS class
                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id);

                activeTech = d.id;
                updateHistogram();
            }
        });

    // 2. Render Screen Size Filters (Below the histogram)
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                // Update active states in dataset
                filters_size.forEach(filter => {
                    filter.isActive = (filter.id === d.id);
                });

                // Toggle CSS class
                d3.selectAll("#filters_size .filter")
                    .classed("active", filter => filter.id === d.id);

                activeSize = d.id;
                updateHistogram();
            }
        });
};