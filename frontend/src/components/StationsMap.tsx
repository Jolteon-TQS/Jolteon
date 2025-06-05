import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  bikes?: number;
}

interface StationsMapProps {
  landmarks: {
    name: string;
    city: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
  }[];
  stations: Station[];
  onStationSelect: (stationId: number) => void;
  initialCenter: [number, number];
  initialZoom: number;
}

const StationsMap = ({
  landmarks = [],
  stations = [],
  onStationSelect,
  initialCenter = [-8.653, 40.641], // Default to Aveiro
  initialZoom = 14,
}: StationsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
    );

    mapRef.current = map;

    map.on("load", () => {
      // Prepare GeoJSON data sources
      const landmarksData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: landmarks.map((landmark) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [landmark.longitude, landmark.latitude],
          },
          properties: {
            title: landmark.name,
            description: landmark.city,
            type: "landmark",
            imageUrl: landmark.imageUrl,
          },
        })),
      };

      const stationsData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: stations.map((station) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [station.longitude, station.latitude],
          },
          properties: {
            title: `Station ${station.id}`,
            description: station.city,
            capacity: station.capacity,
            bikes: station.bikes,
            type: "station",
            id: station.id,
          },
        })),
      };

      // Add sources
      map.addSource("landmarks", {
        type: "geojson",
        data: landmarksData,
      });

      map.addSource("stations", {
        type: "geojson",
        data: stationsData,
      });

      // Add layers
      map.addLayer({
        id: "landmarks-layer",
        type: "circle",
        source: "landmarks",
        paint: {
          "circle-radius": 8,
          "circle-color": "#10B981",
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
          "circle-color": [
            "case",
            ["==", ["get", "id"], selectedStation ?? -1],
            "#EC4899", // Selected station color
            "#F97316", // Default station color
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Add labels
      map.addLayer({
        id: "landmark-labels",
        type: "symbol",
        source: "landmarks",
        layout: {
          "text-field": ["get", "title"],
          "text-size": 12,
          "text-offset": [0, 1.5],
        },
        paint: {
          "text-color": "#065F46",
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

        let popupContent = `<strong>${properties.title}</strong>`;
        if (properties.description) {
          popupContent += `<br>${properties.description}`;
        }
        if (properties.capacity) {
          popupContent += `<br>Capacity: ${properties.bikes || 0}/${properties.capacity}`;
        }
        if (properties.imageUrl) {
          popupContent += `<br><img src="${properties.imageUrl}" alt="${properties.title}" style="max-width: 200px; margin-top: 8px;">`;
        }

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
      map.on("click", "landmarks-layer", handlePointClick);
      map.on("click", "stations-layer", handlePointClick);

      // Cursor changes
      map.on("mouseenter", ["landmarks-layer", "stations-layer"], () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", ["landmarks-layer", "stations-layer"], () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [
    landmarks,
    stations,
    selectedStation,
    apikey,
    initialCenter,
    initialZoom,
    onStationSelect,
  ]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    />
  );
};

export default StationsMap;
