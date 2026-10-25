let reports = [];

// Submit new hazard report
function submitReport() {
    const type = document.getElementById("type").value;
    const location = document.getElementById("location").value;
    const desc = document.getElementById("desc").value;

    if (!location || !desc) {
        alert("Please fill all fields");
        return;
    }

    const report = {
        type,
        location,
        desc,
        time: new Date().toLocaleString()
    };

    reports.push(report);

    updateUI();
    analyzeRisks();
    generateSuggestions();
}

// Update incident log UI
function updateUI() {
    const log = document.getElementById("log");
    log.innerHTML = "";

    reports.slice().reverse().forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
      <b>${r.type}</b> - ${r.location}<br>
      <small>${r.time}</small><br>
      ${r.desc}
      <hr>
    `;
        log.appendChild(li);
    });
}

// Simple analytics engine
function analyzeRisks() {
    const analytics = document.getElementById("analytics");

    const counts = {};

    reports.forEach(r => {
        counts[r.type] = (counts[r.type] || 0) + 1;
    });

    let output = "<h3>Incident Frequency</h3>";
    for (let key in counts) {
        output += `<p>${key}: ${counts[key]}</p>`;
    }

    analytics.innerHTML = output;
}

// Rule-based preventive suggestions (basic AI logic)
function generateSuggestions() {
    const suggestions = document.getElementById("suggestions");

    let text = "";

    const typeCount = reports.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {});

    if (typeCount["Slippery Floor"] >= 2) {
        text += "⚠ Install anti-slip mats and increase floor inspections.<br>";
    }

    if (typeCount["Electrical Risk"] >= 2) {
        text += "⚠ Conduct urgent electrical system maintenance.<br>";
    }

    if (typeCount["Equipment Failure"] >= 2) {
        text += "⚠ Schedule preventive maintenance for machines.<br>";
    }

    if (text === "") {
        text = "✔ No major risk patterns detected yet.";
    }

    suggestions.innerHTML = text;
}