/* ========================================================
   Exercise 6.1: Shared Constants & Global Scalers
   ======================================================== */

// Dimensions and inner margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Palette matched to the site template
const barColor = "#1e3a8a";          // Deep blue matching --primary-color
const bodyBackgroundColor = "#ffffff"; // White matching the card background for bar gaps

// Global scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// D3 Bin Generator
const binGenerator = d3.bin()
    .value(d => d.energyConsumption);