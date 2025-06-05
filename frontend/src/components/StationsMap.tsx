import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createReview, Review } from "../api/review-crud";

interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  bikes?: number;
}

interface Landmark {
  id?: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  averageRating?: number;
}

interface StationsMapProps {
  landmarks: Landmark[];
  stations: Station[];
  onStationSelect: (stationId: number) => void;
  initialCenter: [number, number];
  initialZoom: number;
}

const StationsMap = ({
  landmarks = [],
  stations = [],
  onStationSelect,
  initialCenter = [-8.653, 40.641],
  initialZoom = 14,
}: StationsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [landmarkToReview, setLandmarkToReview] = useState<number | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    (
      window as typeof window & {
        openReviewModal: (landmarkId: number) => void;
      }
    ).openReviewModal = (landmarkId: number) => {
      setLandmarkToReview(landmarkId);
      setShowModal(true);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
    );

    mapRef.current = map;

    map.on("load", () => {
      const landmarksData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: landmarks.map((landmark) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [landmark.longitude, landmark.latitude],
          },
          properties: {
            id: landmark.id,
            title: landmark.name,
            description:
              landmark.city +
              "<br>" +
              (landmark.averageRating !== undefined
                ? landmark.averageRating.toFixed(1) + " ⭐"
                : "Sem avaliações"),
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

      map.addSource("landmarks", { type: "geojson", data: landmarksData });
      map.addSource("stations", { type: "geojson", data: stationsData });

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
            "#EC4899",
            "#F97316",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
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
          "text-color": "#9A3412",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

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

        if (properties.type === "landmark") {
          popupContent += `<br><button onclick="window.openReviewModal(${properties.id})"  style="
    margin-top: 12px;
    padding: 8px 16px;
    background-color: #10B981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;"
  onmouseover="this.style.backgroundColor='#059669'"
  onmouseout="this.style.backgroundColor='#10B981'">Rate</button>`;
        }

        new maplibregl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(popupContent)
          .addTo(map);

        if (properties.type === "station" && properties.id && onStationSelect) {
          setSelectedStation(properties.id);
          onStationSelect(properties.id);
        }
      };

      map.on("click", "landmarks-layer", handlePointClick);
      map.on("click", "stations-layer", handlePointClick);

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

  const landmarkName =
    landmarks.find((l) => l.id === landmarkToReview)?.name ?? "Local";

  return (
    <>
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
      {showModal && landmarkToReview !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                marginBottom: "16px",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              Rating {landmarkName}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const stars = parseInt(form.stars.value);
                const description = form.description.value;

                const review: Review = {
                  stars,
                  description,
                  user: 1,
                  culturalLandmark: landmarkToReview!,
                };

                await createReview(review);
                setShowModal(false);
                setLandmarkToReview(null);
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontWeight: "500" }}>
                  Stars:
                  <input
                    name="stars"
                    type="number"
                    min={1}
                    max={5}
                    required
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "500" }}>
                  Comment:
                  <textarea
                    name="description"
                    required
                    rows={4}
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "6px",
                    border: "none",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#10B981",
                    color: "white",
                    borderRadius: "6px",
                    border: "none",
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StationsMap;
