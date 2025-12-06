const WORKER_URL = "https://bmkgupdate.workers.dev/";

async function loadWarnings() {
  try {
    const res = await fetch(WORKER_URL);
    const data = await res.json();
    console.log(data); // pastikan muncul di console browser
    renderMap(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function renderMap(data) {
  const map = L.map('map').setView([-2.5, 118], 5); // contoh center Indonesia
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  data.forEach(d => {
    if (!d.latest_warning) return;
    const color = getMarkerColor(d.latest_warning.severity);
    L.circleMarker(d.coords, { radius: 8, color }).addTo(map)
      .bindPopup(`<b>${d.region}</b><br>${d.latest_warning.description}`);
  });
}

function getMarkerColor(severity) {
  switch (severity) {
    case 'light': return 'yellow';
    case 'moderate': return 'orange';
    case 'heavy': return 'red';
    case 'extreme': return 'purple';
    case 'wind': return 'blue';
    default: return 'gray';
  }
}

loadWarnings();
