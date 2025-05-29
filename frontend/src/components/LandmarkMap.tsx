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

const PanelMap = ({ landmarks, onDeleteLandmark }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  // Convert landmarks to GeoJSON
  const getLandmarkGeoJSON = (): GeoJSON.FeatureCollection => ({
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
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [-8.653, 40.641],
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
          "circle-color": "#10B981", // green
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Add popup on click
      map.on("click", "landmarks-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties!;
        const coordinates = (feature.geometry as any).coordinates.slice();

        const html = `
          <strong>${props.name}</strong><br/>
          <em>${props.city}</em><br/>
          ${props.description}<br/>
          ${props.image ? `<img src="${props.image}" alt="${props.name}" style="max-width: 100px;" />` : ""}
          <br/><button onclick="window.deleteLandmark(${props.id})" style="color:red;">Delete</button>
        `;

        new maplibregl.Popup().setLngLat(coordinates).setHTML(html).addTo(map);
      });

      // Change cursor on hover
      map.on("mouseenter", "landmarks-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "landmarks-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      (window as any).deleteLandmark = (id: number) => {
        if (onDeleteLandmark) onDeleteLandmark(id);
      };
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getSource("landmarks")) return;

    const source = map.getSource("landmarks") as maplibregl.GeoJSONSource;
    source.setData(getLandmarkGeoJSON());
  }, [landmarks]);

  return <div ref={mapContainer} style={{ height: "500px" }} />;
};

export default PanelMap;
