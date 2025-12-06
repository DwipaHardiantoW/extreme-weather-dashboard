const API_URL = "https://extreme-weather-dashboard.bmkgupdate.cloudflare.workers.dev"; // GANTI

const severityColors = {
  extreme: "red",
  heavy: "orange",
  moderate: "yellow",
  light: "blue",
  wind: "purple",
  info: "gray"
};

const map = L.map("map").setView([-2, 118], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18
}).addTo(map);

async function loadWarnings() {
  const resp = await fetch(API_URL);
  const data = await resp.json();
  console.log("BMKG Data:", data);

  document.getElementById("list").innerHTML = "";

  data.forEach(item => {
    const warning = item.latest_warning;

    // sidebar
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <h3>${item.region}</h3>
      ${
        warning
          ? `<p><b>${warning.type}</b></p>`
          : `<p style="color:gray">Tidak ada peringatan</p>`
      }
    `;
    document.getElementById("list").appendChild(card);

    // marker hanya jika koordinat tersedia
    const coords = regionToCoords(item.region);
    if (!coords) return;

    const color = warning ? severityColors[warning.severity] : "gray";

    const icon = L.divIcon({
      className: "",
      html: `<div style="
        background:${color};
        width:14px;height:14px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 3px #000;
      "></div>`
    });

    L.marker(coords, { icon }).addTo(map)
      .bindPopup(`
        <b>${item.region}</b><br>
        ${warning ? warning.type : "No Warning"}
      `);
  });
}

// mapping provinsi ke koordinat tengah
function regionToCoords(region) {
  const midpoint = {
    "ACEH": [4.4, 97.0],
    "SUMATERA UTARA": [2.1, 99],
    "SUMATERA BARAT": [-0.9, 100.35],
    "RIAU": [0.5, 101.5],
    "KEPULAUAN RIAU": [3.5, 108],
    "JAMBI": [-1.6, 103.6],
    "SUMATERA SELATAN": [-3.0, 104.7],
    "BANGKA BELITUNG": [-2.5, 107],
    "BENGKULU": [-3.8, 102.3],
    "LAMPUNG": [-5.2, 105.2],

    "DKI JAKARTA": [-6.2, 106.8],
    "BANTEN": [-6.1, 106.1],
    "JAWA BARAT": [-6.9, 107.6],
    "JAWA TENGAH": [-7.0, 110.2],
    "DI YOGYAKARTA": [-7.8, 110.37],
    "JAWA TIMUR": [-7.9, 112.5],
    "BALI": [-8.3, 115.1],

    "NUSA TENGGARA BARAT": [-8.5, 117.2],
    "NUSA TENGGARA TIMUR": [-9.4, 124.5],

    "KALIMANTAN BARAT": [0, 110],
    "KALIMANTAN TENGAH": [-1.8, 113],
    "KALIMANTAN SELATAN": [-3.3, 115],
    "KALIMANTAN TIMUR": [0.5, 117.1],
    "KALIMANTAN UTARA": [3.0, 117.5],

    "SULAWESI UTARA": [1.4, 124.8],
    "GORONTALO": [0.5, 123.1],
    "SULAWESI TENGAH": [-1, 120],
    "SULAWESI BARAT": [-2.7, 119.3],
    "SULAWESI SELATAN": [-4.5, 119.5],
    "SULAWESI TENGGARA": [-4, 122.2],
  };

  return midpoint[region] || null;
}

// initial load + auto refresh
loadWarnings();
setInterval(loadWarnings, 10 * 60 * 1000); // refresh 10 menit

