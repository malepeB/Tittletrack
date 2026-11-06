'use client';
import { useEffect, useRef, useState } from 'react';
import { DEEDS } from '../lib/data';
export default function Map() {
  const el = useRef(null), [info, setInfo] = useState(null), mapRef = useRef(null), L = useRef(null);
  useEffect(() => {
    let map; (async () => {
      const lf = (await import('leaflet')).default; await import('leaflet/dist/leaflet.css'); L.current = lf;
      map = lf.map(el.current).setView([-29, 25], 5); mapRef.current = map;
      lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
      DEEDS.forEach(d => lf.circleMarker([d[1], d[2]], { radius: 9, color: '#0b6e4f', fillColor: '#f4a261', fillOpacity: 1 }).addTo(map).on('click', () => setInfo(d)));
    })(); return () => map && map.remove();
  }, []);
  function near() {
    navigator.geolocation?.getCurrentPosition(p => {
      const { latitude: la, longitude: lo } = p.coords; const b = [...DEEDS].sort((a, c) => Math.hypot(a[1] - la, a[2] - lo) - Math.hypot(c[1] - la, c[2] - lo))[0];
      setInfo(b); mapRef.current.setView([b[1], b[2]], 8); L.current.circleMarker([la, lo], { radius: 7, color: '#14507a' }).addTo(mapRef.current);
    }, () => setInfo(['Location permission denied', 0, 0, '']));
  }
  return (<><p><button className="btn o" onClick={near}>Find nearest to me</button></p><div ref={el} style={{ height: 460, borderRadius: 18, border: '1px solid #e1ece6' }} />
    <div className="card" style={{ marginTop: 14 }}>{info ? <><b>{info[0]} Deeds Office</b><br />Serves: {info[3]}</> : 'Tap a pin to see which office serves your area.'}</div></>);
}
