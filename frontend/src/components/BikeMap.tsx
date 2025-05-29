import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface Props {
  latitude: number;
  longitude: number;
}

const Map = ({ latitude, longitude }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-liberty/style.json?apiKey=${apikey}`,
      center: [longitude, latitude],
      zoom: 16,
    });

    mapRef.current = map;

    map.on('load', () => {
      // GeoJSON using props
      const waypointData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              title: 'Your Bike',
            },
          },
        ],
      };

      map.addSource('waypoints', {
        type: 'geojson',
        data: waypointData,
      });

      map.addLayer({
        id: 'waypoints-layer',
        type: 'circle',
        source: 'waypoints',
        paint: {
          'circle-radius': 6,
          'circle-color': '#3B82F6',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });

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

      map.on('mouseenter', 'waypoints-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'waypoints-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [latitude, longitude]);

  return <div ref={mapContainer} style={{ height: '500px' }} />;
};

export default Map;
