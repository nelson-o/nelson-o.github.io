import React from "react";

import styles from "@/components/ui/world-map.module.css";

export type MapMarker = {
  id: string;
  label: string;
  sublabel?: string;
  /** Longitude in degrees (-180 to 180) */
  lon: number;
  /** Latitude in degrees (-90 to 90) */
  lat: number;
  primary?: boolean;
};

type WorldMapProps = {
  landPath: string;
  markers?: MapMarker[];
  ariaLabel?: string;
};

const GRATICULE_LATS = [-60, -30, 0, 30, 60];
const GRATICULE_LONS = [-120, -60, 0, 60, 120];

// Matches the d3 geoEquirectangular().scale(153).translate([480, 250]) used to generate the land path
const PROJ_SCALE = 153;
const PROJ_TX = 480;
const PROJ_TY = 250;

function lonToX(lon: number) {
  return PROJ_SCALE * (lon * (Math.PI / 180)) + PROJ_TX;
}

function latToY(lat: number) {
  return -PROJ_SCALE * (lat * (Math.PI / 180)) + PROJ_TY;
}

export function WorldMap({ landPath, markers = [], ariaLabel = "World map" }: WorldMapProps) {
  return (
    <svg
      className={styles.map}
      viewBox="0 0 960 500"
      aria-label={ariaLabel}
      role="img"
    >
      <g className={styles.graticule} aria-hidden="true">
        {GRATICULE_LATS.map((lat) => (
          <line key={`lat-${lat}`} x1={0} y1={latToY(lat)} x2={960} y2={latToY(lat)} />
        ))}
        {GRATICULE_LONS.map((lon) => (
          <line key={`lon-${lon}`} x1={lonToX(lon)} y1={0} x2={lonToX(lon)} y2={500} />
        ))}
      </g>

      <path className={styles.land} d={landPath} />

      {markers.map((marker) => {
        const cx = lonToX(marker.lon);
        const cy = latToY(marker.lat);
        return (
          <g key={marker.id} className={marker.primary ? styles.markerPrimary : styles.marker}>
            {marker.primary && (
              <circle className={styles.pulse} cx={cx} cy={cy} r={10} />
            )}
            <circle
              className={styles.dot}
              cx={cx}
              cy={cy}
              r={marker.primary ? 5 : 3.5}
            />
            <text className={styles.label} x={cx + 8} y={cy + 4}>
              {marker.label}
            </text>
            {marker.sublabel && (
              <text className={styles.sublabel} x={cx + 8} y={cy + 14}>
                {marker.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
