import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface Bike {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
}

interface Station {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  bikes: Bike[];
  stations: Station[];
  onDeleteBike?: (id: number) => void;
  onDeleteStation?: (id: number) => void;
}

const PanelMap = ({ bikes, stations, onDeleteBike, onDeleteStation }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  const convertToGeoJSON = (
    items: (Bike | Station)[],
    type: "bike" | "station"
  ): GeoJSON.FeatureCollection<GeoJSON.Point, { id: number; name: string; status: string; itemType: "bike" | "station" }> => ({
    type: "FeatureCollection",
    features: items.map((item) => ({
      type: "Feature",
      properties: {
        id: item.id,
        name: item.name,
        status: (type === "bike" && "status" in item) ? item.status : "",
        itemType: type,
      },
      geometry: {
        type: "Point",
        coordinates: [item.lng, item.lat],
      },
    })),
  });

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [-8.6530, 40.6410],
      zoom: 15,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("bikes", {
        type: "geojson",
        data: convertToGeoJSON(bikes, "bike"),
      });

      map.addSource("stations", {
        type: "geojson",
        data: convertToGeoJSON(stations, "station"),
      });

      // Bike layer (blue)
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

      // Station layer (red)
      map.addLayer({
        id: "stations-layer",
        type: "circle",
        source: "stations",
        paint: {
          "circle-radius": 8,
          "circle-color": "#ff7b00",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Handle clicks on either layer
      map.on("click", "bikes-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const id = feature.properties?.id;
        const name = feature.properties?.name;
        const status = feature.properties?.status;

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${name}</strong><br/>
            ${status}<br/>
            <button onclick="window.deleteBike(${id})" style="color: red;">Delete</button>
          `)
          .addTo(map);
      });

      map.on("click", "stations-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const id = feature.properties?.id;
        const name = feature.properties?.name;

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${name}</strong><br/>
            <button onclick="window.deleteStation(${id})" style="color: red;">Delete</button>
          `)
          .addTo(map);
      });

      // Cursor pointer
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

      // Global delete functions
      (window as any).deleteBike = (id: number) => onDeleteBike?.(id);
      (window as any).deleteStation = (id: number) => onDeleteStation?.(id);
    });

    return () => map.remove();
  }, []);

  // Update data dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const bikesSource = map.getSource("bikes") as maplibregl.GeoJSONSource;
    const stationsSource = map.getSource("stations") as maplibregl.GeoJSONSource;

    bikesSource?.setData(convertToGeoJSON(bikes, "bike"));
    stationsSource?.setData(convertToGeoJSON(stations, "station"));
  }, [bikes, stations]);

  return <div ref={mapContainer} style={{ height: '600px' }} />;
};

export default PanelMap;
