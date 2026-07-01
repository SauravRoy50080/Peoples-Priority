import { useState } from 'react';
import api from '../services/api';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/export-pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'priority-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="shrink-0 bg-ink hover:bg-ink-light text-paper px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading ? 'Preparing report…' : 'Export PDF report'}
    </button>
  );
}