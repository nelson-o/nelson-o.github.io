import type { Profile } from "@/lib/profile";
import type { MapMarker } from "@/components/ui/world-map";

type CityCoord = { lat: number; lon: number; displayName: string };

const CITY_COORDS: Record<string, CityCoord> = {
  taipei:     { lat: 25.04,  lon: 121.56,   displayName: "Taipei" },
  hsinchu:    { lat: 24.81,  lon: 120.97,   displayName: "Hsinchu" },
  berlin:     { lat: 52.52,  lon: 13.41,    displayName: "Berlin" },
  singapore:  { lat: 1.35,   lon: 103.82,   displayName: "Singapore" },
  bangkok:    { lat: 13.75,  lon: 100.50,   displayName: "Bangkok" },
  "san jose": { lat: 37.34,  lon: -121.89,  displayName: "San Jose" },
  london:     { lat: 51.51,  lon: -0.13,    displayName: "London" },
  manchester: { lat: 53.48,  lon: -2.24,    displayName: "Manchester" },
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
  return raw.split(",")[0].trim().toLowerCase();
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
        map.set(key, { key, ...coord, roles: [] });
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

export function locationsToMarkers(locations: ProfileLocations): MapMarker[] {
  const { primary, rest } = locations;
  return [
    { id: primary.key, label: primary.displayName, sublabel: "Current base", lat: primary.lat, lon: primary.lon, primary: true },
    ...rest.map((e) => ({ id: e.key, label: e.displayName, lat: e.lat, lon: e.lon })),
  ];
}
