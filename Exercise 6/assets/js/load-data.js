const loadCSV = path => {
    d3.csv(path, d => ({
        brand: d.brand,
        model: d.model,
        screenSize: +d.screenSize,
        screenTech: d.screenTech,
        energyConsumption: +d.energyConsumption,
        star: +d.star
    })).then(data => {
        console.log("Processed TV Data loaded successfully:", data.length, "rows");

        // Clear any previous error messages
        d3.select("#histogram").selectAll(".error-msg").remove();

        // 1. Draw Histogram (Exercise 6.1)
        drawHistogram(data);

        // 2. Initialise Filters (Exercise 6.2)
        populateFilters(data);

        // 3. Draw Scatterplot (Exercise 6.3)
        drawScatterplot(data);

        // 4. Initialise Tooltip Handlers (Exercise 6.4)
        createTooltip(data);
        handleMouseEvents();

    }).catch(error => {
        console.error("Failed to load CSV from:", path, error);
        if (path === "data/Ex6_TVdata_withStar.csv") {
            loadCSV("../data/Ex6_TVdata_withStar.csv");
        }
    });
};

loadCSV("data/Ex6_TVdata_withStar.csv");