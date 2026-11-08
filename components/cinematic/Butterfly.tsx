import { useId } from 'react';

/** One lightweight SVG guide, used throughout the entire journey. */
export default function Butterfly() {
  const uid = useId().replace(/:/g, '');
  return (
    <div className="cin-butterfly" aria-hidden="true">
      <span className="cin-butterfly-halo" />
      <svg viewBox="0 0 120 108" xmlns="http://www.w3.org/2000/svg" className="cin-butterfly-svg">
        <defs>
          <linearGradient id={`${uid}-wing`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e5fcff" stopOpacity="0.95" />
            <stop offset=".45" stopColor="#9fc8fa" stopOpacity="0.65" />
            <stop offset="1" stopColor="#d5a7ff" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id={`${uid}-lower`} x1="0" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#eaf8ff" stopOpacity="0.88" />
            <stop offset="1" stopColor="#bd9bea" stopOpacity="0.73" />
          </linearGradient>
        </defs>
        <g className="cin-wing cin-wing-left">
          <path d="M59 50 C42 18 17 0 8 14 C-2 37 19 56 58 56 Z" fill={`url(#${uid}-wing)`} stroke="#e7faff" strokeWidth="1.4"/>
          <path d="M58 57 C38 52 21 61 25 76 C31 87 42 82 38 98 C52 91 60 76 60 60 Z" fill={`url(#${uid}-lower)`} stroke="#e9e0ff" strokeWidth="1.2"/>
          <path d="M56 52 Q39 27 12 18 M53 54 Q35 42 17 40 M56 58 Q38 65 31 76 M54 63 Q48 78 39 88" fill="none" stroke="#f1ffff" strokeWidth=".9" opacity=".72" />
          <path d="M14 16 Q28 15 39 27 M16 40 Q24 51 38 52" fill="none" stroke="#f1d7ff" strokeWidth="1.1" opacity=".7"/>
        </g>
        <g className="cin-wing cin-wing-right">
          <path d="M61 50 C78 18 103 0 112 14 C122 37 101 56 62 56 Z" fill={`url(#${uid}-wing)`} stroke="#e7faff" strokeWidth="1.4"/>
          <path d="M62 57 C82 52 99 61 95 76 C89 87 78 82 82 98 C68 91 60 76 60 60 Z" fill={`url(#${uid}-lower)`} stroke="#e9e0ff" strokeWidth="1.2"/>
          <path d="M64 52 Q81 27 108 18 M67 54 Q85 42 103 40 M64 58 Q82 65 89 76 M66 63 Q72 78 81 88" fill="none" stroke="#f1ffff" strokeWidth=".9" opacity=".72" />
          <path d="M106 16 Q92 15 81 27 M104 40 Q96 51 82 52" fill="none" stroke="#f1d7ff" strokeWidth="1.1" opacity=".7"/>
        </g>
        <path d="M59.5 34 Q55 51 59.5 76 Q64 51 60.5 34Z" fill="#f3fcff" />
        <circle cx="60" cy="34" r="3.5" fill="#fff" />
        <path d="M59 33 Q47 17 45 19 M61 33 Q73 17 75 19" fill="none" stroke="#e7faff" strokeLinecap="round" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
