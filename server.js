// Load CSV and parse it
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();

    // Parse CSV to JSON
    const rows = text.trim().split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index].trim();
            return acc;
        }, {});
    });

    return data;
}

// Perform calculations and render results
function calculateAndDisplayResults(drugData, p, x, q, a, b) {
    const c = p * q;
    const d = (b * c) / a;
    const e = (x * b) / d;
    const f = e / b;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p>Value of E: ${e.toFixed(2)}</p>
        <p>Value of F: ${f.toFixed(2)}</p>
        <p>Comments: ${drugData.Comments || "No comments available"}</p>
    `;
}

// Main logic
document.getElementById("calculation-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form inputs
    const drugName = document.getElementById("drugName").value.trim();
    const p = parseFloat(document.getElementById("p").value);
    const x = parseFloat(document.getElementById("x").value);
    const q = parseFloat(document.getElementById("q").value);
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);

    // Load drug data
    const drugs = await loadCSV("drug.csv");

    // Search for drug by name (case-insensitive match)
    const drugData = drugs.find(drug =>
        drug["Generic Name"].toLowerCase() === drugName.toLowerCase()
    );

    if (!drugData) {
        document.getElementById("results").innerHTML = "<p>Drug not found.</p>";
        return;
    }

    // Perform calculations
    calculateAndDisplayResults(drugData, p, x, q, a, b);
});
