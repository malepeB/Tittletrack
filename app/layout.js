import './globals.css';
import Link from 'next/link';
import Nav from '../components/Nav';
import Boot from '../components/Boot';
export const viewport = { themeColor: '#0b6e4f' };
export const metadata = { manifest: '/manifest.json', title: 'TitleTrack — Know your property rights', description: 'Title deeds, FLISP and rental help for South Africans' };
export default function RootLayout({ children }) {
  return (<html lang="en"><body><Nav /><Boot />{children}<footer>TitleTrack.co.za · Sol Plaatje University NPRJ740 · A guide, not legal advice. · <Link href="/feedback" style={{ color: 'var(--g)' }}>Give feedback</Link></footer></body></html>);
}
