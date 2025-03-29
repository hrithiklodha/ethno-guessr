import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

const Map = ({ setSelectedLocation, actualLocation, selectedLocation, showResult }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const actualMarkerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', (e) => {
        if (!showResult) {
          const { lat, lng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.remove();
          }
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          setSelectedLocation({ lat, lng });
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [setSelectedLocation, showResult]);

  useEffect(() => {
    if (showResult && actualLocation && selectedLocation) {
      // Remove existing markers and line
      if (markerRef.current) markerRef.current.remove();
      if (actualMarkerRef.current) actualMarkerRef.current.remove();
      if (lineRef.current) lineRef.current.remove();

      // Add actual location marker with a different color
      actualMarkerRef.current = L.marker([actualLocation.lat, actualLocation.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(mapInstanceRef.current);

      // Add line connecting guess to actual location
      lineRef.current = L.polyline([
        [selectedLocation.lat, selectedLocation.lng],
        [actualLocation.lat, actualLocation.lng]
      ], {
        color: '#ef4444',
        weight: 2,
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      // Fit map to show both points
      const bounds = L.latLngBounds([
        [selectedLocation.lat, selectedLocation.lng],
        [actualLocation.lat, actualLocation.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [showResult, actualLocation, selectedLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map; 