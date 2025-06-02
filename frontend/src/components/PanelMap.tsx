import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Marker {
  id: number;
  type: "bike" | "station";
  latitude: number;
  longitude: number;
  label?: string;
}

interface Props {
  markers: Marker[];
}

const PanelMap = ({ markers }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<L.Marker[]>([]);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    const map = L.map(mapContainer.current).setView(
      markers.length > 0
        ? [markers[0].latitude, markers[0].longitude]
        : [40.641, -8.653],
      14,
    );

    // Add tile layer
    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apikey}`,
      {
        attribution:
          'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a>',
      },
    ).addTo(map);

    mapRef.current = map;

    // Clear previous markers
    markerRefs.current.forEach((marker) => map.removeLayer(marker));
    markerRefs.current = [];

    // Create markers with custom paw icons
    markers.forEach((marker) => {
      const color = marker.type === "bike" ? "3B82F6" : "F97316";
      const iconName = marker.type === "bike" ? "bicycle" : "charging-station";

      // Create custom icon
      const icon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?size=medium&type=awesome&color=%23${color}&icon=${iconName}&apiKey=${apikey}`,
        iconSize: [30, 40],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      // Create marker with icon
      const leafletMarker = L.marker([marker.latitude, marker.longitude], {
        icon: icon,
      });

      // Create and bind popup
      const popup = L.popup().setContent(
        `<p style="text-align: center">${marker.label || marker.type}</p>`,
      );
      leafletMarker.bindPopup(popup);

      // Add marker to map and store reference
      leafletMarker.addTo(map);
      markerRefs.current.push(leafletMarker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [markers, apikey]);

  return <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />;
};

export default PanelMap;