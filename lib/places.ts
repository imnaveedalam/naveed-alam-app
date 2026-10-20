export type LatLng = [number, number];

const places: Record<string, LatLng> = {
  karachi: [24.8607, 67.0011],
  gwadar: [25.1264, 62.3225],
  "hassan abdal": [33.8196, 72.689],
  khunjerab: [36.85, 75.4258],
  "khunjerab pass": [36.85, 75.4258],
  muzaffarabad: [34.37, 73.471],
  kel: [34.816, 74.358],
  dir: [35.205, 71.876],
  chitral: [35.851, 71.786],
  islamabad: [33.6844, 73.0479],
  lahore: [31.5204, 74.3587],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.975],
  multan: [30.1575, 71.5249],
  sukkur: [27.7052, 68.8574],
  hyderabad: [25.396, 68.3578],
  gilgit: [35.9208, 74.308],
  skardu: [35.2976, 75.6337],
  hunza: [36.3167, 74.65],
  swat: [35.2227, 72.4258],
  murree: [33.907, 73.3943],
  naran: [34.907, 73.6507],
  faisalabad: [31.4504, 73.135],
  rawalpindi: [33.5651, 73.0169],
  sialkot: [32.4945, 74.5229],
  bahawalpur: [29.3956, 71.6836],
  turbat: [26.0023, 63.0507],
  pasni: [25.2631, 63.471],
  ormara: [25.2088, 64.636],
  zhob: [31.3417, 69.4486],
  "dera ghazi khan": [30.0561, 70.6348],
};

export function lookupPlace(name: string): LatLng | null {
  const key = name.toLowerCase().replace(/\s+/g, " ").trim();
  return places[key] ?? places[key.replace(/\s+pass$/, "")] ?? null;
}

export function routeStops(route: string): { name: string; point: LatLng | null }[] {
  return route
    .split(/\s*(?:→|->|—|–|\bto\b)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({ name, point: lookupPlace(name) }));
}
