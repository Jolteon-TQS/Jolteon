import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

interface Marker {
  id: number;
  type: 'bike' | 'station';
  latitude: number;
  longitude: number;
  label?: string;
}

interface Props {
  markers: Marker[];
}

const PanelMap = ({ markers }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const apikey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apikey}`,
      center: markers.length > 0 
        ? [markers[0].longitude, markers[0].latitude] 
        : [-8.6530, 40.6410],
      zoom: 14,
    });

    mapRef.current = map;

    map.on('load', () => {
      const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: markers.map(marker => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude],
          },
          properties: {
            id: marker.id,
            type: marker.type,
            title: marker.label || marker.type,
          }
        })),
      };

      map.addSource('markers', {
        type: 'geojson',
        data: geojson,
      });

      map.addLayer({
        id: 'markers-layer',
        type: 'circle',
        source: 'markers',
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'match',
            ['get', 'type'],
            'bike', '#3B82F6',
            'station', '#F97316',
            '#000000'
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });

      // Create popup once and reuse it
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',
        offset: [0, -10]
      });

      map.on('click', 'markers-layer', (e) => {
const feature = e.features?.[0];
if (!feature) return;

const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
const title = feature.properties?.title || '';

        
        if (coordinates && title && popupRef.current) {
          // Remove any existing popup first
          popupRef.current.remove();

          // Fly to the marker position
          map.flyTo({
            center: coordinates as [number, number],
            essential: true
          });

          // Add popup after the flyTo animation completes
          map.once('moveend', () => {
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor: 'bottom',
              offset: [0, -10]
            })
            .setLngLat(coordinates as [number, number])
            .setHTML(`<strong>${title}</strong>`)
            .addTo(map);
          });
        }
      });

      // Close popup when clicking elsewhere on the map
      map.on('click', () => {
        if (popupRef.current) {
          popupRef.current.remove();
        }
      });

      map.on('mouseenter', 'markers-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'markers-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [markers]);

  return <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />;
};

export default PanelMap;