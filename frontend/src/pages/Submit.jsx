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
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | requesting | granted | denied

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5); // cap at 5 photos
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Thank you</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your submission has been received and will be reviewed along with others from your area.
          </p>
          <button
            onClick={() => navigate('/submit')}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Share a development need</h1>
          <p className="text-sm text-gray-500">
            Text, a photo, or a voice note — whatever's easiest for you.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-5">
          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Language</label>
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    language === l.code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Describe the issue
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="e.g. The road near the school has had a large pothole for 2 months..."
              className="w-full border rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Voice note */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Voice note</label>
            {!audioUrl ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-3 rounded-lg text-sm font-medium border ${
                  isRecording
                    ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                {isRecording ? '⏺ Recording... tap to stop' : '🎤 Tap to record a voice note'}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <audio controls src={audioUrl} className="flex-1 h-10" />
                <button
                  type="button"
                  onClick={discardRecording}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Photos (up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoChange}
              className="text-sm text-gray-600"
            />
            {photoPreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-5 h-5 text-xs leading-5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Location</label>
            {locationStatus === 'granted' ? (
              <p className="text-sm text-green-600">📍 Location attached</p>
            ) : (
              <button
                type="button"
                onClick={requestLocation}
                className="text-sm text-blue-600 hover:underline"
              >
                {locationStatus === 'requesting' ? 'Getting location...' : '📍 Attach my location'}
              </button>
            )}
            {locationStatus === 'denied' && (
              <p className="text-xs text-gray-400 mt-1">
                Location unavailable — you can still submit without it.
              </p>
            )}
          </div>

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}