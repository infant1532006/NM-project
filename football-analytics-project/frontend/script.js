
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
    });

    loadPlayerMetrics();
    loadTeamStats();
}

async function loadPlayerMetrics() {
    const res = await fetch("http://localhost:8000/player-metrics");
    const data = await res.json();

    const labels = data.map(d => d.Player);
    const goals = data.map(d => d.Goals);

    new Chart(document.getElementById("playerChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Goals",
                data: goals,
                backgroundColor: "blue"
            }]
        }
    });
}

async function loadTeamStats() {
    const res = await fetch("http://localhost:8000/team-stats");
    const data = await res.json();

    const labels = data.map(d => d.Team);
    const possession = data.map(d => d.Possession);

    new Chart(document.getElementById("teamChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Avg Possession",
                data: possession,
                backgroundColor: "green"
            }]
        }
    });
}
