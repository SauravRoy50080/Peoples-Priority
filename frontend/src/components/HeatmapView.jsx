import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { useHeatmap } from '../hooks/usePriorities';

const containerStyle = { width: '100%', height: '400px', borderRadius: '12px' };
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

  if (!hasKey) {
    return (
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
        <div className="h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-sm text-gray-400 text-center px-6">
          Add VITE_GOOGLE_MAPS_API_KEY to your .env to enable the heatmap.
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
        <div className="h-[400px] bg-gray-50 rounded-xl flex items-center justify-center text-sm text-red-500">
          Failed to load Google Maps.
        </div>
      </div>
    );
  }

  if (!isLoaded || isLoading || !data) {
    return <div className="h-[400px] bg-gray-100 rounded-xl animate-pulse mb-6" />;
  }

  const heatmapData = (data.points ?? []).map(
    (p) => new window.google.maps.LatLng(p.lat, p.lng)
  );

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Demand Hotspots</h2>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <HeatmapLayer data={heatmapData} />
      </GoogleMap>
    </div>
  );
}