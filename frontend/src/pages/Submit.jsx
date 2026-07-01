import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitEntry } from '../services/api';

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function Submit() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('hi');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setPhotos(files);
    setPhotoPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { timeout: 8000 }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access denied', err);
      setErrorMsg('Microphone access was denied. You can still submit text or photos.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const canSubmit = text.trim() || photos.length > 0 || audioBlob;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setErrorMsg('Add at least one of: text, a photo, or a voice note.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitEntry({
        text: text.trim(),
        language,
        lat: location?.lat,
        lng: location?.lng,
        photos,
        audio: audioBlob,
      });
      setStatus('success');
    } catch (err) {
      console.error('Submission failed', err);
      setStatus('error');
      setErrorMsg('Something went wrong sending your submission. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="bg-white border border-ink/10 rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-moss/10 text-moss flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="font-display text-xl font-semibold text-ink mb-2">
            Your voice has been logged
          </h1>
          <p className="text-sm text-slate-soft mb-6">
            This submission joins others from your area and will be reviewed
            during the next development planning cycle.
          </p>
          <button
            onClick={() => {
              setText('');
              setPhotos([]);
              setPhotoPreviews([]);
              setAudioBlob(null);
              setAudioUrl(null);
              setLocation(null);
              setLocationStatus('idle');
              setStatus('idle');
            }}
            className="bg-ink hover:bg-ink-light text-paper px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Log another issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-dark">
            New entry
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink mt-1">
            What needs your MP's attention?
          </h1>
          <p className="text-sm text-slate-soft mt-2">
            Text, a photo, or a voice note — whatever's easiest. Every submission
            is read and counted toward what gets prioritized.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Language
            </label>
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    language === l.code
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-slate-soft border-ink/15 hover:border-ink/30'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Describe the issue
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="e.g. The road near the school has had a large pothole for 2 months..."
              className="w-full border border-ink/15 rounded-lg p-3 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-marigold/50 focus:border-marigold/50"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Voice note
            </label>
            {!audioUrl ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-3 rounded-lg text-sm font-medium border transition-colors ${
                  isRecording
                    ? 'bg-terracotta/10 text-terracotta border-terracotta/40 animate-pulse'
                    : 'bg-paper text-ink border-ink/15 hover:border-ink/30'
                }`}
              >
                {isRecording ? '⏺ Recording… tap to stop' : '🎤 Tap to record a voice note'}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <audio controls src={audioUrl} className="flex-1 h-10" />
                <button
                  type="button"
                  onClick={discardRecording}
                  className="text-xs text-terracotta hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Photos (up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoChange}
              className="text-sm text-slate-soft file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-paper-dim file:text-ink file:text-sm hover:file:bg-ink/10 file:transition-colors"
            />
            {photoPreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-ink/10" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 bg-ink text-paper rounded-full w-5 h-5 text-xs leading-5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Location
            </label>
            {locationStatus === 'granted' ? (
              <p className="text-sm text-moss">📍 Location attached</p>
            ) : (
              <button
                type="button"
                onClick={requestLocation}
                className="text-sm text-marigold-dark hover:underline"
              >
                {locationStatus === 'requesting' ? 'Getting location…' : '📍 Attach my location'}
              </button>
            )}
            {locationStatus === 'denied' && (
              <p className="text-xs text-slate-soft mt-1">
                Location unavailable — you can still submit without it.
              </p>
            )}
          </div>

          {errorMsg && <p className="text-sm text-terracotta">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-marigold hover:bg-marigold-dark text-ink py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit to my MP'}
          </button>
        </form>
      </div>
    </div>
  );
}