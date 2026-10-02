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

// Exercise 6.2: Filter buttons definition
const filters_screen = [
    { id: "all",  label: "All",  isActive: true },
    { id: "LED",  label: "LED",  isActive: false },
    { id: "LCD",  label: "LCD",  isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Exercise 6.2 Extension: Screen Size Filters (Below Histogram)
const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: 24,    label: '24"',       isActive: false },
    { id: 32,    label: '32"',       isActive: false },
    { id: 55,    label: '55"',       isActive: false },
    { id: 65,    label: '65"',       isActive: false },
    { id: 98,    label: '98"',       isActive: false }
];