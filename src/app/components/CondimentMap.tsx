import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Condiment } from '../types';
import { Language } from '../i18n/translations';

// 都道府県庁所在地のおおよその緯度経度
const PREFECTURE_COORDS: Record<string, [number, number]> = {
  '北海道': [43.0642, 141.3469], '青森県': [40.8244, 140.7400], '岩手県': [39.7036, 141.1527],
  '宮城県': [38.2688, 140.8721], '秋田県': [39.7186, 140.1024], '山形県': [38.2404, 140.3633],
  '福島県': [37.7503, 140.4676], '茨城県': [36.3418, 140.4468], '栃木県': [36.5658, 139.8836],
  '群馬県': [36.3911, 139.0608], '埼玉県': [35.8570, 139.6489], '千葉県': [35.6047, 140.1233],
  '東京都': [35.6895, 139.6917], '神奈川県': [35.4478, 139.6425], '新潟県': [37.9026, 139.0236],
  '富山県': [36.6953, 137.2113], '石川県': [36.5947, 136.6256], '福井県': [36.0652, 136.2216],
  '山梨県': [35.6642, 138.5684], '長野県': [36.6513, 138.1810], '岐阜県': [35.3912, 136.7223],
  '静岡県': [34.9769, 138.3831], '愛知県': [35.1802, 136.9066], '三重県': [34.7303, 136.5086],
  '滋賀県': [35.0045, 135.8686], '京都府': [35.0116, 135.7681], '大阪府': [34.6937, 135.5023],
  '兵庫県': [34.6913, 135.1830], '奈良県': [34.6851, 135.8048], '和歌山県': [34.2260, 135.1675],
  '鳥取県': [35.5039, 134.2378], '島根県': [35.4723, 133.0505], '岡山県': [34.6618, 133.9350],
  '広島県': [34.3966, 132.4596], '山口県': [34.1859, 131.4714], '徳島県': [34.0658, 134.5593],
  '香川県': [34.3401, 134.0434], '愛媛県': [33.8416, 132.7657], '高知県': [33.5597, 133.5311],
  '福岡県': [33.6064, 130.4183], '佐賀県': [33.2494, 130.2988], '長崎県': [32.7448, 129.8737],
  '熊本県': [32.7898, 130.7417], '大分県': [33.2382, 131.6126], '宮崎県': [31.9111, 131.4239],
  '鹿児島県': [31.5602, 130.5581], '沖縄県': [26.2124, 127.6809],
};

const JAPAN_CENTER: [number, number] = [37.2, 137.5];
const JAPAN_ZOOM = 5;

// 「東京都（伊豆大島）」のような表記から都道府県名の本体を取り出す
function resolveCoords(origin: string): [number, number] | null {
  const base = origin.replace(/[（(].*?[）)]/g, '').trim();
  return PREFECTURE_COORDS[base] ?? null;
}

interface Props {
  condiments: Condiment[];
  language: Language;
}

export function CondimentMap({ condiments, language }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: JAPAN_CENTER,
      zoom: JAPAN_ZOOM,
      minZoom: 3,
      maxZoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // 「日本にズームしている状態」に戻すボタン
    const HomeControl = L.Control.extend({
      onAdd: () => {
        const btn = L.DomUtil.create('button', 'leaflet-bar');
        btn.innerHTML = language === 'ja' ? '🇯🇵 日本' : '🇯🇵 Japan';
        btn.style.cssText = 'padding:4px 10px;background:#fff;cursor:pointer;font-size:12px;border:none;';
        btn.onclick = () => map.setView(JAPAN_CENTER, JAPAN_ZOOM);
        return btn;
      },
    });
    new HomeControl({ position: 'topright' }).addTo(map);

    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const counts = new Map<string, number>();
    condiments.forEach(c => {
      counts.set(c.origin, (counts.get(c.origin) ?? 0) + 1);
    });

    counts.forEach((count, origin) => {
      const coords = resolveCoords(origin);
      if (!coords) return;
      const marker = L.circleMarker(coords, {
        radius: 6 + Math.min(count, 10) * 1.5,
        color: '#7c4a1e',
        fillColor: '#c17f3a',
        fillOpacity: 0.75,
        weight: 2,
      }).addTo(map);
      marker.bindPopup(
        `<strong>${origin}</strong><br>${count}${language === 'ja' ? '件の調味料' : ' condiments'}`
      );
      markersRef.current.push(marker);
    });
  }, [condiments, language]);

  return <div ref={containerRef} className="w-full h-full" />;
}
