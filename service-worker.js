const CACHE_NAME = "batalha-terrestre-pwa-v19";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",
  "./src/game.js",
  "./assets/branding/pwa-180.png",
  "./assets/branding/pwa-192.png",
  "./assets/branding/pwa-512.png",
  "./assets/branding/pwa-512-maskable.png",
  "./assets/wreckage/patrol_wreckage.svg",
  "./assets/wreckage/tank_wreckage.svg",
  "./assets/wreckage/drone_wreckage.svg",
  "./assets/wreckage/aircraft_wreckage.svg",
  "./assets/bases/base_peripheral.svg",
  "./assets/bases/base_ground_defense.svg",
  "./assets/bases/base_center.svg",
  "./assets/bases/base_anti_air.svg",
  "./assets/effects/fall_smoke.svg",
  "./assets/effects/bombing_smoke_3x3.svg",
  "./assets/effects/explosion.svg",
  "./assets/scenario/neutral_tile.svg",
  "./assets/scenario/territory_red.svg",
  "./assets/scenario/territory_pink.svg",
  "./assets/scenario/territory_blue.svg",
  "./assets/scenario/territory_green.svg",
  "./assets/scenario/territory_yellow.svg",
  "./assets/scenario/battlefield_16x10.svg",
  "./assets/ui/icon_shield.svg",
  "./assets/ui/icon_settings.svg",
  "./assets/ui/icon_reserve.svg",
  "./assets/ui/icon_faith.svg",
  "./assets/ui/icon_aircraft.svg",
  "./assets/ui/icon_tank.svg",
  "./assets/ui/icon_drone.svg",
  "./assets/ui/icon_patrol.svg",
  "./assets/units/tank/tank_front.svg",
  "./assets/units/tank/tank_aa_front.svg",
  "./assets/units/tank/tank_dodge_right.svg",
  "./assets/units/tank/tank_aa_right.svg",
  "./assets/units/tank/tank_right.svg",
  "./assets/units/tank/tank_dodge_left.svg",
  "./assets/units/tank/tank_dodge_front.svg",
  "./assets/units/tank/tank_back.svg",
  "./assets/units/tank/tank_left.svg",
  "./assets/units/tank/tank_aa_back.svg",
  "./assets/units/tank/tank_aa_left.svg",
  "./assets/units/tank/tank_dodge_back.svg",
  "./assets/units/drone/drone_right.svg",
  "./assets/units/drone/drone_front.svg",
  "./assets/units/drone/drone_back.svg",
  "./assets/units/drone/drone_left.svg",
  "./assets/units/aircraft/aircraft_right.svg",
  "./assets/units/aircraft/aircraft_front.svg",
  "./assets/units/aircraft/aircraft_left.svg",
  "./assets/units/aircraft/aircraft_back.svg",
  "./assets/units/patrol/patrol_dodge_left.svg",
  "./assets/units/patrol/patrol_front.svg",
  "./assets/units/patrol/patrol_dodge_front.svg",
  "./assets/units/patrol/patrol_dodge_right.svg",
  "./assets/units/patrol/patrol_left.svg",
  "./assets/units/patrol/patrol_right.svg",
  "./assets/units/patrol/patrol_dodge_back.svg",
  "./assets/units/patrol/patrol_back.svg",
  "./assets/branding/logo-emblema.png",
  "./assets/branding/resultado-derrota.jpg",
  "./assets/branding/cena-inicial.jpg",
  "./assets/branding/lateral-batalha.png",
  "./assets/branding/icone-app.png",
  "./assets/branding/atlas-pecas-referencia.png",
  "./assets/branding/capa-jogo.png",
  "./assets/branding/resultado-vitoria.jpg",
  "./audio/movimento_tanque.wav",
  "./audio/LEIA-ME.txt",
  "./audio/movimento_aviao_drone.wav",
  "./audio/audio.js",
  "./audio/trilha_partida_loop.wav",
  "./audio/movimento_patrulha.wav",
  "./audio/explosao.wav"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("batalha-terrestre-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", response.clone());
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("./index.html"));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
