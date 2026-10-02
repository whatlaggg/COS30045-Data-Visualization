/* ========================================================
   Exercise 6.1: CSV Data Loader
   ======================================================== */

const loadCSV = path => {
    d3.csv(path, d => ({
        brand: d.brand,
        model: d.model,
        screenSize: +d.screenSize,
        screenTech: d.screenTech,
        energyConsumption: +d.energyConsumption,
        star: +d.star
    })).then(data => {
        console.log("Processed TV Data:", data);

        // Call drawing and filter functions
        drawHistogram(data);
        populateFilters(data);
    }).catch(error => {
        console.error("Error loading CSV from:", path, error);

        // Fallbacks for alternative folder locations or names
        if (path === "data/Ex6_TVdata_withStar.csv") {
            loadCSV("data/W6_TVdata.csv");
        } else if (path === "data/W6_TVdata.csv") {
            loadCSV("../data/Ex6_TVdata_withStar.csv");
        }
    });
};

loadCSV("data/Ex6_TVdata_withStar.csv");