async function loadWarnings() {
  try {
    const resp = await fetch("https://extreme-weather-dashboard.bmkgupdate.cloudflare.workers.dev/");
    const data = await resp.json();
    renderMap(data);
  } catch (err) {
    console.error("Failed to load warnings:", err);
  }
}
