// RouteMap.tsx
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const RouteMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [-8.6455, 40.6405],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=40.6405,-8.6455|40.6410,-8.6530&mode=bicycle&apiKey=${apikey}`,
      );
      const data = await response.json();

      map.addSource("route", {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#6084eb",
          "line-width": 8,
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ height: "400px" }} />;
};

export default RouteMap;
