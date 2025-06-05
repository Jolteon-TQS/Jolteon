import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Landmark {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

interface Spot {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  capacity?: number;
}

interface Props {
  latitude: number;
  longitude: number;
  landmarks?: Landmark[];
  startSpot?: Spot;
  endSpot?: Spot | null;
  stations?: Spot[];
  onStationSelect?: (stationId: number) => void;
}

const Map = ({
  latitude,
  longitude,
  landmarks = [],
  startSpot,
  endSpot,
  stations = [],
  onStationSelect,
}: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: [longitude, latitude],
      zoom: 16,
      attributionControl: false,
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add scale control
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
    );

    mapRef.current = map;

    map.on("load", () => {
      // Add bike location
      const bikeData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            properties: {
              title: "Your Bike",
              type: "bike",
            },
          },
        ],
      };

      // Add landmarks if provided
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

      // Add start spot if provided
      // const startSpotData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      //   type: "FeatureCollection",
      //   features: startSpot
      //     ? [
      //         {
      //           type: "Feature",
      //           geometry: {
      //             type: "Point",
      //             coordinates: [startSpot.longitude, startSpot.latitude],
      //           },
      //           properties: {
      //             title: "Start Location",
      //             description: startSpot.city,
      //             type: "start",
      //           },
      //         },
      //       ]
      //     : [],
      // };

      // Add end spot if provided
      // const endSpotData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      //   type: "FeatureCollection",
      //   features: endSpot
      //     ? [
      //         {
      //           type: "Feature",
      //           geometry: {
      //             type: "Point",
      //             coordinates: [endSpot.longitude, endSpot.latitude],
      //           },
      //           properties: {
      //             title: "End Location",
      //             description: endSpot.city,
      //             type: "end",
      //           },
      //         },
      //       ]
      //     : [],
      // };

      // Add stations data
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
            type: "station",
            id: station.id,
          },
        })),
      };

      // Add all sources
      map.addSource("bike", {
        type: "geojson",
        data: bikeData,
      });

      map.addSource("landmarks", {
        type: "geojson",
        data: landmarksData,
      });

      // map.addSource("end-spot", {
      //   type: "geojson",
      //   data: endSpotData,
      // });

      map.addSource("stations", {
        type: "geojson",
        data: stationsData,
      });

      // Add layers with different styles for each type
      map.addLayer({
        id: "bike-layer",
        type: "circle",
        source: "bike",
        paint: {
          "circle-radius": 10,
          "circle-color": "#3B82F6",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
        },
      });

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
        id: "start-spot-layer",
        type: "circle",
        source: "start-spot",
        paint: {
          "circle-radius": 9,
          "circle-color": "#F59E0B",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
        },
      });

      map.addLayer({
        id: "end-spot-layer",
        type: "circle",
        source: "end-spot",
        paint: {
          "circle-radius": 9,
          "circle-color": "#EF4444",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
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

      // Add symbol layers for labels
      map.addLayer({
        id: "bike-labels",
        type: "symbol",
        source: "bike",
        layout: {
          "text-field": ["get", "title"],
          "text-size": 14,
          "text-offset": [0, 1.5],
        },
        paint: {
          "text-color": "#1E40AF",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

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
          "text-color": "#F97316",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // Click handler for all point types
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
          popupContent += `<br>Capacity: ${properties.capacity}`;
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

      // Add click handlers for all layers
      map.on("click", "bike-layer", handlePointClick);
      map.on("click", "landmarks-layer", handlePointClick);
      map.on("click", "start-spot-layer", handlePointClick);
      map.on("click", "end-spot-layer", handlePointClick);
      map.on("click", "stations-layer", handlePointClick);

      // Highlight selected station
      if (selectedStation) {
        map.setPaintProperty("stations-layer", "circle-color", [
          "case",
          ["==", ["get", "id"], selectedStation],
          "#EC4899", // Highlight color for selected station
          "#8B5CF6", // Default color for other stations
        ]);
      }

      // Cursor changes
      const layers = [
        "bike-layer",
        "landmarks-layer",
        "start-spot-layer",
        "end-spot-layer",
        "stations-layer",
      ];
      layers.forEach((layer) => {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [
    latitude,
    longitude,
    landmarks,
    startSpot,
    endSpot,
    stations,
    selectedStation,
    apikey,
    onStationSelect,
  ]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "12px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    />
  );
};

export default Map;
