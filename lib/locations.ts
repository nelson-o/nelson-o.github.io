import type { Profile } from "@/lib/profile";
import type { MapMarker } from "@/components/ui/world-map";

type CityCoord = { lat: number; lon: number };

const CITY_COORDS: Record<string, CityCoord> = {
  taipei:     { lat: 25.04,  lon: 121.56 },
  hsinchu:    { lat: 24.81,  lon: 120.97 },
  berlin:     { lat: 52.52,  lon: 13.41 },
  singapore:  { lat: 1.35,   lon: 103.82 },
  bangkok:    { lat: 13.75,  lon: 100.50 },
  "san jose": { lat: 37.34,  lon: -121.89 },
  london:     { lat: 51.51,  lon: -0.13 },
  manchester: { lat: 53.48,  lon: -2.24 },
};

const CITY_ALIASES: Record<string, string> = {
  台北: "taipei",
  台灣台北: "taipei",
  新竹: "hsinchu",
  台灣新竹: "hsinchu",
  柏林: "berlin",
  新加坡: "singapore",
  曼谷: "bangkok",
  聖荷西: "san jose",
  倫敦: "london",
  曼徹斯特: "manchester",
  台湾台北: "taipei",
  台湾新竹: "hsinchu",
  圣何塞: "san jose",
  伦敦: "london",
  曼彻斯特: "manchester",
  "台湾・台北": "taipei",
  "台湾・新竹": "hsinchu",
  ベルリン: "berlin",
  シンガポール: "singapore",
  バンコク: "bangkok",
  サンノゼ: "san jose",
  ロンドン: "london",
  マンチェスター: "manchester",
};

export type LocationRole = {
  company: string;
  title: string;
  start: string;
  end: string | null;
};

export type LocationEntry = {
  key: string;
  displayName: string;
  lat: number;
  lon: number;
  roles: LocationRole[];
};

/** "Taipei, Taiwan" → "taipei", "San Jose" → "san jose" */
function normalizeCityKey(raw: string): string {
  const city = raw.split(",")[0].trim();

  return CITY_ALIASES[city] ?? city.toLowerCase();
}

/** "Berlin / Singapore / Taipei" → ["Berlin", "Singapore", "Taipei"] */
function parseCities(locationStr: string): string[] {
  return locationStr.split("/").map((s) => s.trim()).filter(Boolean);
}

function shortYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

export function periodLabel(start: string, end: string | null): string {
  const s = shortYear(start);
  if (!end) return `${s} –`;
  const e = shortYear(end);
  return s === e ? s : `${s} – ${e}`;
}

export type ProfileLocations = {
  primary: LocationEntry;
  rest: LocationEntry[];
};

export function getProfileLocations(profile: Profile): ProfileLocations {
  const map = new Map<string, LocationEntry>();

  const allRoles = [...profile.selectedExperience, ...profile.groupedExperience.roles];

  for (const role of allRoles) {
    for (const city of parseCities(role.location)) {
      const key = normalizeCityKey(city);
      const coord = CITY_COORDS[key];
      if (!coord) continue;

      if (!map.has(key)) {
        map.set(key, { key, displayName: city, ...coord, roles: [] });
      }
      map.get(key)!.roles.push({
        company: role.company,
        title: role.title,
        start: role.start,
        end: role.end,
      });
    }
  }

  const primaryKey = normalizeCityKey(parseCities(profile.basics.location)[0]);
  const primary = map.get(primaryKey) ?? {
    key: primaryKey,
    displayName: parseCities(profile.basics.location)[0],
    lat: CITY_COORDS[primaryKey]?.lat ?? 0,
    lon: CITY_COORDS[primaryKey]?.lon ?? 0,
    roles: [],
  };

  // Order: primary city first, then by most recent role start date
  const rest = [...map.values()]
    .filter((e) => e.key !== primaryKey)
    .sort((a, b) => b.roles[0].start.localeCompare(a.roles[0].start));

  return { primary, rest };
}

export function locationsToMarkers(
  locations: ProfileLocations,
  currentBaseLabel = "Current base",
): MapMarker[] {
  const { primary, rest } = locations;
  return [
    {
      id: primary.key,
      label: primary.displayName,
      sublabel: currentBaseLabel,
      lat: primary.lat,
      lon: primary.lon,
      primary: true,
    },
    ...rest.map((e) => ({ id: e.key, label: e.displayName, lat: e.lat, lon: e.lon })),
  ];
}
