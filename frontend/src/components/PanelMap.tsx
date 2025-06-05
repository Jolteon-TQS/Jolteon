import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Marker {
  id: number;
  type: "bike" | "station";
  latitude: number;
  longitude: number;
  label?: string;
}

interface Props {
  markers: Marker[];
  onStationSelect?: (stationId: number) => void;
}

const PanelMap = ({ markers, onStationSelect }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with first marker as center or default location
    const defaultCenter =
      markers.length > 0
        ? [markers[0].longitude, markers[0].latitude]
        : [-8.653, 40.641]; // Default to Aveiro, Portugal

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: defaultCenter as [number, number],
      zoom: 14,
      attributionControl: false,
    });

    // Add zoom controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    map.on("load", () => {
      // Prepare GeoJSON data
      const bikeData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: markers
          .filter((marker) => marker.type === "bike")
          .map((marker) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
            properties: {
              title: marker.label || "Bike",
              type: "bike",
              id: marker.id,
            },
          })),
      };

      const stationData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: markers
          .filter((marker) => marker.type === "station")
          .map((marker) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
            properties: {
              title: marker.label || `Station ${marker.id}`,
              type: "station",
              id: marker.id,
            },
          })),
      };

      // Add sources
      map.addSource("bikes", {
        type: "geojson",
        data: bikeData,
      });

      map.addSource("stations", {
        type: "geojson",
        data: stationData,
      });

      // Add layers
      map.addLayer({
        id: "bikes-layer",
        type: "circle",
        source: "bikes",
        paint: {
          "circle-radius": 8,
          "circle-color": "#3B82F6",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      map.addLayer({
        id: "stations-layer",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": 7,
          "circle-color": "#F97316",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Add labels
      map.addLayer({
        id: "bike-labels",
        type: "symbol",
        source: "bikes",
        layout: {
          "text-field": ["get", "title"],
          "text-size": 12,
          "text-offset": [0, 1.5],
        },
        paint: {
          "text-color": "#1E40AF",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      map.addLayer({
        id: "station-labels",
        type: "symbol",
        source: "stations",
        layout: {
          "text-field": ["get", "title"],
          "text-size": 11,
          "text-offset": [0, 1.5],
        },
        paint: {
          "text-color": "#9A3412",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // Click handler for points
      const handlePointClick = (e: maplibregl.MapLayerMouseEvent) => {
        const coordinates = (
          e.features?.[0]?.geometry as GeoJSON.Point
        )?.coordinates.slice();
        const properties = e.features?.[0]?.properties;

        if (!coordinates || !properties) return;

        const popupContent = `<strong>${properties.title}</strong>`;

        new maplibregl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(popupContent)
          .addTo(map);

        // Handle station selection
        if (properties.type === "station" && properties.id && onStationSelect) {
          setSelectedStation(properties.id);
          onStationSelect(properties.id);
        }
      };

      // Add click handlers
      map.on("click", "bikes-layer", handlePointClick);
      map.on("click", "stations-layer", handlePointClick);

      // Change cursor on hover
      map.on("mouseenter", "bikes-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "bikes-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "stations-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "stations-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      // Highlight selected station
      if (selectedStation) {
        map.setPaintProperty("stations-layer", "circle-color", [
          "case",
          ["==", ["get", "id"], selectedStation],
          "#EC4899", // Highlight color for selected station
          "#F97316", // Default color for other stations
        ]);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, selectedStation, apikey, onStationSelect]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "605px",
        width: "100%",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    />
  );
};

export default PanelMap;
