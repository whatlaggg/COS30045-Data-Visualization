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

    // Screen Technology Buttons
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

    // Screen Size Buttons
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

// Tooltip Stubs (Ready for Exercise 6.4)
const createTooltip = () => {
    console.log("createTooltip ready for Exercise 6.4.");
};

const handleMouseEvents = () => {
    console.log("handleMouseEvents ready for Exercise 6.4.");
};