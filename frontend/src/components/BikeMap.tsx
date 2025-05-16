// MyMap.tsx
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = '899a092ef47346c8af9097d08bc54b13';

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [-8.6530, 40.6410],
      zoom: 16,
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
              coordinates: [-8.6530, 40.6410],
            },
            properties: {
              title: 'Your Bike',
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

export default Map;
