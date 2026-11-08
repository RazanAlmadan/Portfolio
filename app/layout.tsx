import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Razan — Enter My World',description:'Explore the software development and AI integration projects of Razan, a Full Stack Developer.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
