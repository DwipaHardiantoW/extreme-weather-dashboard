const API_URL = "https://extreme-weather-dashboard.bmkgupdate.workers.dev/";

async function loadWarnings() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch data from Worker");
    
    const data = await res.json();
    console.log("Data from Worker:", data); // debug

    // Inisialisasi map
    const map = L.map('map').setView([-2.5, 118], 5); // Indonesia view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Tambahkan marker
    data.forEach(d => {
      if (d.latest_warning) {
        const { coords, latest_warning } = d;
        const color = getColor(latest_warning.severity);

        L.circleMarker(coords, {
          radius: 10,
          color,
          fillColor: color,
          fillOpacity: 0.7
        })
        .bindPopup(`<b>${d.region}</b><br>${latest_warning.description}`)
        .addTo(map);
      }
    });

  } catch (err) {
    console.error("Error loading warnings:", err);
  }
}

// Fungsi menentukan warna marker berdasarkan severity
function getColor(severity) {
  switch (severity) {
    case "extreme": return "red";
    case "heavy": return "orange";
    case "moderate": return "yellow";
    case "light": return "blue";
    case "wind": return "purple";
    default: return "gray";
  }
}

window.onload = loadWarnings;
