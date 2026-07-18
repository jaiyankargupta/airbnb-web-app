"use client";

import React from "react";

interface Listing {
  id: number;
  title: string;
  price_per_night: number;
  location: string;
  image_url: string;
  rating: number;
}

interface ExploreMapProps {
  listings: Listing[];
}

interface Coordinate {
  lat: number;
  lng: number;
}

const LOCATION_COORDINATES: Record<string, Coordinate> = {
  "kharagpur": { lat: 22.346, lng: 87.230 },
  "lalbana": { lat: 22.310, lng: 87.210 },
  "varanasi": { lat: 25.3176, lng: 83.0061 },
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "puri": { lat: 19.8135, lng: 85.8312 },
  "ranchi": { lat: 23.3441, lng: 85.3096 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "malibu": { lat: 34.0259, lng: -118.7798 },
  "tahoe": { lat: 39.0968, lng: -120.0324 },
  "california": { lat: 37.7749, lng: -122.4194 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "beverly hills": { lat: 34.0736, lng: -118.4004 },
  "bali": { lat: -8.5069, lng: 115.2625 },
  "goa": { lat: 15.2993, lng: 74.1240 }
};

export default function ExploreMap({ listings }: ExploreMapProps) {
  const getCoordinates = (locationStr: string): Coordinate => {
    const norm = locationStr.toLowerCase();
    for (const [key, coord] of Object.entries(LOCATION_COORDINATES)) {
      if (norm.includes(key)) {
        return coord;
      }
    }
    const hash = locationStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      lat: 20 + (hash % 15),
      lng: 75 + ((hash * 13) % 15)
    };
  };

  const markersData = listings.map((l) => {
    const coord = getCoordinates(l.location);
    return {
      id: l.id,
      title: l.title,
      price: l.price_per_night,
      location: l.location,
      lat: coord.lat,
      lng: coord.lng,
      rating: l.rating,
      image: l.image_url
    };
  });

  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        .price-pin {
          background: white;
          color: #222222;
          border: 1px solid #dddddd;
          border-radius: 28px;
          padding: 5px 10px;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          text-align: center;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .price-pin:hover {
          transform: scale(1.08);
          border-color: #222222;
          z-index: 1000 !important;
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .popup-card {
          width: 200px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .popup-card img {
          width: 100%;
          height: 110px;
          object-cover: cover;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .popup-card h4 {
          margin: 0 0 4px 0;
          font-size: 13px;
          font-weight: bold;
          color: #222222;
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .popup-card p {
          margin: 0 0 6px 0;
          font-size: 11px;
          color: #717171;
        }
        .popup-card .price {
          font-weight: bold;
          font-size: 13px;
          color: #222222;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const markers = ${JSON.stringify(markersData)};
        
        let center = [22.346, 87.230];
        if (markers.length > 0) {
          center = [markers[0].lat, markers[0].lng];
        }
        
        const map = L.map('map', { zoomControl: false }).setView(center, 12);
        L.control.zoom({ position: 'topright' }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const group = L.featureGroup();

        markers.forEach(m => {
          const icon = L.divIcon({
            html: '<div class="price-pin">$' + m.price + '</div>',
            iconSize: [50, 24],
            iconAnchor: [25, 12]
          });

          const popupContent = \`
            <div class="popup-card">
              <img src="\${m.image}" alt="\${m.title}" />
              <h4>\${m.title}</h4>
              <p>\${m.location}</p>
              <div class="price">$\${m.price} <span style="font-weight: normal; color: #717171;">night</span></div>
            </div>
          \`;

          const marker = L.marker([m.lat, m.lng], { icon: icon })
            .bindPopup(popupContent, { closeButton: false, minWidth: 200 })
            .addTo(group);
        });

        group.addTo(map);

        if (markers.length > 0) {
          map.fitBounds(group.getBounds(), { padding: [40, 40] });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden border border-gray-border bg-gray-50 dark:bg-zinc-900 shadow-md">
      <iframe
        width="100%"
        height="100%"
        title="Explore Map"
        srcDoc={srcDoc}
        frameBorder="0"
        className="w-full h-full filter dark:invert dark:hue-rotate-180"
      />
    </div>
  );
}
