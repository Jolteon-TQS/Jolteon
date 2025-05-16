// MyMap.tsx
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const StationsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [-8.6530, 40.6410],
      zoom: 14,
    });

    mapRef.current = map;

    map.on('load', () => {
      // GeoJSON with multiple waypoint markers
      const waypointData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-8.6455, 40.6405],
            },
            properties: {
              title: 'Start',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-8.6530, 40.6410],
            },
            properties: {
              title: 'Waypoint 1',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-8.6600, 40.6430],
            },
            properties: {
              title: 'Waypoint 2',
            },
          },
        ],
      };

      // Add source
      map.addSource('waypoints', {
        type: 'geojson',
        data: waypointData,
      });

      // Add circle layer to show waypoints
      map.addLayer({
        id: 'waypoints-layer',
        type: 'circle',
        source: 'waypoints',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF5733',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });

      // Optionally add popup on click
      map.on('click', 'waypoints-layer', (e) => {
        const coordinates = (e.features?.[0]?.geometry as GeoJSON.Point)?.coordinates;
        const title = e.features?.[0]?.properties?.title;
        if (coordinates) {
          new maplibregl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(`<strong>${title}</strong>`)
            .addTo(map);
        }
      });

      // Cursor change on hover
      map.on('mouseenter', 'waypoints-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'waypoints-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ height: '500px' }} />;
        
};

export default StationsMap;
