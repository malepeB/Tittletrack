'use client';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('../../components/Map'), { ssr: false });
export default function MapPage() { return (<div className="wrap"><h2>Deeds Office locator</h2><Map /></div>); }
