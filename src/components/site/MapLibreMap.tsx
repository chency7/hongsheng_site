'use client';

import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef } from 'react';

type MapLibreMapProps = {
  className?: string;
};

export default function MapLibreMap({ className }: MapLibreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const center: [number, number] = [112.5532, 28.2534];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://p0.map.gtimg.com/tile/?z={z}&x={x}&y={y}',
              'https://p1.map.gtimg.com/tile/?z={z}&x={x}&y={y}',
              'https://p2.map.gtimg.com/tile/?z={z}&x={x}&y={y}',
              'https://p3.map.gtimg.com/tile/?z={z}&x={x}&y={y}',
            ],
            tileSize: 256,
            attribution: '腾讯地图',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center,
      zoom: 12.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    new maplibregl.Marker({ color: '#F4B400' }).setLngLat(center).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
