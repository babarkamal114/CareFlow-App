"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  DASHBOARD_MAP_PIN_CLASSES,
  DASHBOARD_VISIT_STATUS_LABELS,
  type DashboardMapMarker,
} from "utils";
import { DashboardMapPin } from "types";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const FALLBACK_CENTER: [number, number] = [53.4808, -2.2426];

interface LiveMapCanvasProps {
  markers: DashboardMapMarker[];
}

function FitToMarkers({ markers }: LiveMapCanvasProps) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;
    map.fitBounds(
      markers.map((marker) => [marker.lat, marker.lng] as [number, number]),
      { padding: [32, 32], maxZoom: 15 },
    );
  }, [map, markers]);

  return null;
}

function createPinIcon(marker: DashboardMapMarker) {
  return L.divIcon({
    className: "", 
    html: `<span class="flex size-6 items-center justify-center"><span class="block size-3 rounded-full ring-2 ring-cf-surface ${DASHBOARD_MAP_PIN_CLASSES[marker.status]}"></span></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function LiveMapCanvas({ markers }: LiveMapCanvasProps) {
  return (
    <MapContainer
      center={FALLBACK_CENTER}
      zoom={12}
      scrollWheelZoom={false} // so the map doesn't hijack page scrolling
      className="size-full min-h-[220px]"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <FitToMarkers markers={markers} />

      {markers.map((marker) => (
        <Marker
          key={marker.visitId}
          position={[marker.lat, marker.lng]}
          icon={createPinIcon(marker)}
          title={`${marker.label}, ${DASHBOARD_VISIT_STATUS_LABELS[marker.status]}`}
        >
          <Popup>
            <span className="font-semibold">{marker.label}</span>
            <br />
            {DASHBOARD_VISIT_STATUS_LABELS[marker.status]}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}