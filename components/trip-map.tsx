"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/places";

type RouteLine = {
  id: string;
  title: string;
  points: LatLng[];
};

type TripMapProps = {
  lines: RouteLine[];
};

const markerIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#f0771a;border:2px solid #07140f;box-shadow:0 0 0 2px rgba(240,119,26,0.35)"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitRoute({ points }: { points: LatLng[] }) {
  const map = useMap();
  const signature = points.map((point) => point.join(",")).join("|");

  useEffect(() => {
    if (points.length === 0) {
      map.setView([30.4, 69.3], 5);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 7);
      return;
    }

    map.fitBounds(points, { padding: [36, 36] });
    // `signature` tracks coordinate changes without refitting on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);

  return null;
}

export function TripMap({ lines }: TripMapProps) {
  const points = lines.flatMap((line) => line.points);

  return (
    <div className="h-[420px]">
      <MapContainer
        center={[30.4, 69.3]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRoute points={points} />
        {lines.map((line) =>
          line.points.length > 1 ? (
            <Polyline
              key={line.id}
              positions={line.points}
              pathOptions={{ color: "#f0771a", weight: 4, opacity: 0.9 }}
            />
          ) : null,
        )}
        {lines.flatMap((line) =>
          line.points.map((point, index) => (
            <Marker
              key={`${line.id}-${index}`}
              position={point}
              icon={markerIcon}
            >
              <Popup>{line.title}</Popup>
            </Marker>
          )),
        )}
      </MapContainer>
    </div>
  );
}
