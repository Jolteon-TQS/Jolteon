import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Landmark {
  id: number;
  name: string;
  city: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
}

interface Props {
  landmarks: Landmark[];
  onDeleteLandmark?: (id: number) => void;
}

declare global {
  interface Window {
    deleteLandmark: (id: number) => void;
  }
}

const PanelMap = ({ landmarks, onDeleteLandmark }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<L.Marker[]>([]);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = L.map(mapContainer.current).setView(
      landmarks.length > 0
        ? [landmarks[0].lat, landmarks[0].lng]
        : [40.641, -8.653],
      14,
    );

    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apikey}`,
      {
        attribution:
          'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a>',
      },
    ).addTo(map);

    mapRef.current = map;

    window.deleteLandmark = (id: number) => {
      if (onDeleteLandmark) onDeleteLandmark(id);
    };

    return () => {
      map.remove();
    };
  }, [apikey, landmarks, onDeleteLandmark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markerRefs.current.forEach((marker) => map.removeLayer(marker));
    markerRefs.current = [];

    // Add new markers
    landmarks.forEach((lm) => {
      const color = "4bd176"; 
      const iconName = "landmark"; 
      const icon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?size=medium&type=awesome&color=%23${color}&icon=${iconName}&apiKey=${apikey}`,
        iconSize: [30, 40],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([lm.lat, lm.lng], { icon });

      const popupHtml = `
        <div style="text-align:center;">
          <strong>${lm.name}</strong><br/>
          <em>${lm.city}</em><br/>
          ${lm.description}<br/>
          ${lm.image ? `<img src="${lm.image}" alt="${lm.name}" style="max-width: 100px; margin-top: 5px;" />` : ""}
          <br/><button onclick="window.deleteLandmark(${lm.id})" style="color:red; margin-top:5px;">Delete</button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(map);
      markerRefs.current.push(marker);
    });

  }, [landmarks, apikey]);

  return <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />;
};

export default PanelMap;
