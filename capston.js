// ==========================================
// 1. SYSTEM CONFIGURATION & STATE MANAGEMENT
// ==========================================

// Sets the dollar value per barrel for revenue calculations.
const OIL_PRICE = 94.40;

// Retrieves saved data from the browser's LocalStorage. 
// If no data exists (null), it initializes an empty array [].
// JSON.parse() converts the stored string back into a JavaScript object.
let wells = JSON.parse(localStorage.getItem('petroData')) || [];

// ==========================================
// 2. CHART.JS INITIALIZATION & VISUALS
// ==========================================

// Get the 2D drawing context of the HTML canvas element. 
// Chart.js needs this context to draw the graphics.
const ctx = document.getElementById('chart').getContext('2d');

// -- VISUAL EFFECT: LIQUID GOLD --
// This uses the native HTML5 Canvas API (not Chart.js directly) to create a gradient.
// (x0, y0, x1, y1) -> Starts at top (0,0) and goes down to (0,400).
const gradient = ctx.createLinearGradient(0, 0, 0, 400);

// Define the color stops: 
// 0 = Start (Top) is solid Gold (#ffb700).
// 1 = End (Bottom) is transparent Gold to fade out.
gradient.addColorStop(0, '#ffb700');
gradient.addColorStop(1, 'rgba(255, 183, 0, 0.23)');

// -- THE CHART INSTANCE --
// We create a new Chart object which takes control of the canvas.
const chart = new Chart(ctx, {

// 'type': Defines the chart geometry. Options: 'line', 'bar', 'pie', 'doughnut', etc.
type: 'bar',

// 'data': The distinct payload the chart renders.
data: {
// 'labels': The X-Axis categories. We start empty [] and fill this via JavaScript later.
labels: [],

// 'datasets': Array of object groups. You can have multiple bars per category.
datasets: [{
label: 'Barrels (BBL)', // Tooltip title when hovering.
data: [],               // The Y-Axis numerical values. Starts empty [].

// Styling properties:
backgroundColor: gradient, // Applies our custom canvas gradient to the bars.
borderColor: '#ffb700',    // The solid outline color of the bars.
borderWidth: 2,            // Thickness of the outline in pixels.
borderRadius: 5,           // Rounds the top corners of the bars for a modern look.
}]
},

// 'options': Global configuration for behavior and layout.
options: {
// 'responsive': true ensures the chart resizes if the window size changes.
responsive: true,

// 'scales': Configures the X and Y axes.
scales: {
y: {
// 'grid': Controls the background grid lines.
grid: { color: '#334155' },
// 'ticks': Controls the numbers/labels on the axis.
ticks: { color: '#94a3b8' }
},
x: {
// Hides the vertical grid lines for a cleaner look.
grid: { display: false },
ticks: { color: '#94a3b8' }
}
},

// 'plugins': Namespace for extra features like Legend, Title, Tooltips.
plugins: {
// We hide the legend (the box that says "Barrels (BBL)") because we only have one dataset.
legend: { display: true }
}
}
});

// ==========================================
// 3. APPLICATION LOGIC (CONTROLLER)
// ==========================================

// REFRESH ENGINE: Updates the HTML and Chart to match the data.
function updateUI() {

// -- SYNC CHART --
// 1. Map the 'name' from our data array to the Chart's labels.
chart.data.labels = wells.map(w => w.name);

// 2. Map the 'value' from our data array to the Chart's dataset.
chart.data.datasets[0].data = wells.map(w => w.value);

// 3. CRITICAL: Tell Chart.js to re-render. Nothing changes visually without this!
chart.update();

// -- SYNC LIST HTML --
const list = document.getElementById('list');
list.innerHTML = ''; // Clear current list to prevent duplicates.
let totalRevenue = 0;

// Loop through data to build the list items and calculate total money.
wells.forEach(well => {
const revenue = well.value * OIL_PRICE;
totalRevenue += revenue;

// Create HTML elements dynamically.
const li = document.createElement('li');
// toLocaleString() formats numbers with commas (e.g., 1,200).
li.innerHTML = `
${well.name}
<div>
<strong>${well.value}</strong> bbl
<span class="money">($${revenue.toLocaleString()})</span>
</div>`;
list.appendChild(li);
});

// Update the Total Revenue display.
document.getElementById('totalRev').textContent =
"$" + totalRevenue.toLocaleString();

// -- SAVE STATE --
// Convert the complex array of objects into a simple string to save in the browser.
localStorage.setItem('petroData', JSON.stringify(wells));
}

// ADD DATA: Triggered by the "Log Production" button.
function addData() {
const nameInput = document.getElementById('wellName');
const valInput = document.getElementById('production');

// Validation: Ensure both fields have text.
if (nameInput.value && valInput.value) {
// Push new object to our state array.
wells.push({
name: nameInput.value,
value: Number(valInput.value) // Convert string input to true number.
});

// Refresh the screen.
updateUI();

// Clear the input fields for the next entry.
nameInput.value = '';
valInput.value = '';
}
}

// CLEAR DATA: Triggered by "Reset System".
function clearData() {
// Confirm dialog stops accidental deletion.
if (confirm("Purge all rig data?")) {
wells = []; // Empty the state array.
updateUI(); // Refresh (which will also clear LocalStorage via updateUI).
}
}

// INITIALIZER: Runs once when the page loads to show any saved data.
updateUI();

