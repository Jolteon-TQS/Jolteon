import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

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
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  // Convert landmarks to GeoJSON with proper typing
  const getLandmarkGeoJSON = (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
    type: "FeatureCollection",
    features: landmarks.map((lm) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lm.lng, lm.lat],
      },
      properties: {
        id: lm.id,
        name: lm.name,
        city: lm.city,
        description: lm.description,
        image: lm.image,
      },
    })),
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: [-8.6530, 40.6410],
      zoom: 14,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("landmarks", {
        type: "geojson",
        data: getLandmarkGeoJSON(),
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

      // Add popup on click
      map.on("click", "landmarks-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties as {
          id: number;
          name: string;
          city: string;
          description: string;
          image: string;
        };
        
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

        const html = `
          <strong>${props.name}</strong><br/>
          <em>${props.city}</em><br/>
          ${props.description}<br/>
          ${props.image ? `<img src="${props.image}" alt="${props.name}" style="max-width: 100px;" />` : ""}
          <br/><button onclick="window.deleteLandmark(${props.id})" style="color:red;">Delete</button>
        `;

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map);
      });

      // Change cursor on hover
      map.on("mouseenter", "landmarks-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      
      map.on("mouseleave", "landmarks-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      // Properly type the window extension
      window.deleteLandmark = (id: number) => {
        if (onDeleteLandmark) onDeleteLandmark(id);
      };
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("landmarks");
    if (source && source.type === "geojson") {
      (source as maplibregl.GeoJSONSource).setData(getLandmarkGeoJSON());
    }
  }, [landmarks]);

  return <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />;
};

export default PanelMap;