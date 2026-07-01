import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { useHeatmap } from '../hooks/usePriorities';

<<<<<<< HEAD
const containerStyle = { width: '100%', height: '400px', borderRadius: '12px' };
=======
const containerStyle = { width: '100%', height: '360px', borderRadius: '8px' };
>>>>>>> Asmita
const center = { lat: 25.59, lng: 85.13 }; // default center, update to your region
const LIBRARIES = ['visualization'];

export default function HeatmapView() {
  const { data, isLoading } = useHeatmap();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasKey = !!apiKey && apiKey !== 'your-google-maps-api-key-here';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: LIBRARIES,
  });

<<<<<<< HEAD
  if (!hasKey) {
    return (
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
        <div className="h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-sm text-gray-400 text-center px-6">
          Add VITE_GOOGLE_MAPS_API_KEY to your .env to enable the heatmap.
        </div>
      </div>
=======
  const Frame = ({ children }) => (
    <div className="bg-white border border-ink/10 rounded-lg p-5 mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-ink">Demand hotspots</h2>
        <span className="font-mono text-xs text-slate-soft">by submission density</span>
      </div>
      {children}
    </div>
  );

  if (!hasKey) {
    return (
      <Frame>
        <div className="h-[360px] bg-paper-dim rounded-lg flex items-center justify-center text-sm text-slate-soft text-center px-6">
          Add VITE_GOOGLE_MAPS_API_KEY to your .env to enable the heatmap.
        </div>
      </Frame>
>>>>>>> Asmita
    );
  }

  if (loadError) {
    return (
<<<<<<< HEAD
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
        <div className="h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-sm text-red-500">
          Failed to load Google Maps.
        </div>
      </div>
=======
      <Frame>
        <div className="h-[360px] bg-paper-dim rounded-lg flex items-center justify-center text-sm text-terracotta">
          Failed to load Google Maps.
        </div>
      </Frame>
>>>>>>> Asmita
    );
  }

  if (!isLoaded || isLoading || !data) {
<<<<<<< HEAD
    return <div className="h-[400px] bg-gray-100 rounded-xl animate-pulse mb-6" />;
=======
    return <div className="h-[360px] bg-paper-dim rounded-lg animate-pulse mb-10" />;
>>>>>>> Asmita
  }

  const heatmapData = (data.points ?? []).map(
    (p) => new window.google.maps.LatLng(p.lat, p.lng)
  );

  return (
<<<<<<< HEAD
    <div className="bg-white border rounded-xl p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <HeatmapLayer data={heatmapData} />
      </GoogleMap>
    </div>
=======
    <Frame>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <HeatmapLayer data={heatmapData} />
      </GoogleMap>
    </Frame>
>>>>>>> Asmita
  );
}