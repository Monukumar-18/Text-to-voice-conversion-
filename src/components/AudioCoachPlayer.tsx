import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Loader2,
  Radio,
  Sliders,
  ChevronUp,
  ChevronDown,
  Mic,
} from 'lucide-react';
import { CoachVoice } from '../types/fitness';
import { COACH_VOICES } from '../data/defaultData';
import { requestTTS } from '../services/api';

interface AudioCoachPlayerProps {
  currentBriefingText: string;
  selectedCoach: CoachVoice;
  onSelectCoach: (coach: CoachVoice) => void;
  onAudioError?: (err: string) => void;
}

export const AudioCoachPlayer: React.FC<AudioCoachPlayerProps> = ({
  currentBriefingText,
  selectedCoach,
  onSelectCoach,
  onAudioError,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState(currentBriefingText);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  // Update speech text if external currentBriefingText changes and not currently playing custom
  useEffect(() => {
    if (currentBriefingText) {
      setActiveSpeechText(currentBriefingText);
    }
  }, [currentBriefingText]);

  // Handle audio playback cleanup
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const loadAndPlayTTS = async (textToSpeak: string, coach: CoachVoice) => {
    setIsLoading(true);
    try {
      const cacheKey = `${coach.voiceName}:${textToSpeak}`;
      let playableUrl = cacheRef.current.get(cacheKey);

      if (!playableUrl) {
        const response = await requestTTS({
          text: textToSpeak,
          voice: coach.voiceName,
          coachName: coach.displayName,
          coachStyle: coach.styleDescription,
        });

        if (response.audioBase64) {
          // Convert base64 to Blob URL for clean browser streaming
          const binary = atob(response.audioBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'audio/wav' });
          playableUrl = URL.createObjectURL(blob);
          cacheRef.current.set(cacheKey, playableUrl);
        } else {
          throw new Error('TTS audio data missing');
        }
      }

      if (playableUrl) {
        setAudioUrl(playableUrl);
        setActiveSpeechText(textToSpeak);

        if (audioRef.current) {
          audioRef.current.src = playableUrl;
          audioRef.current.playbackRate = playbackRate;
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (err: any) {
      console.warn('TTS fetch failed, falling back to Web Speech API:', err);
      if (onAudioError) onAudioError(err.message || 'TTS generation failed');
      
      // Fallback: Browser Web Speech API if offline/error
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = textToSpeak.replace(/<[^>]+>/g, '').replace(/\|[^|]+\|/g, '');
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.rate = playbackRate;
        utter.pitch = coach.voiceName === 'Fenrir' ? 0.8 : coach.voiceName === 'Kore' ? 1.1 : 1.0;
        utter.onstart = () => setIsPlaying(true);
        utter.onend = () => setIsPlaying(false);
        utter.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utter);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current && audioUrl && audioRef.current.src) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        await loadAndPlayTTS(activeSpeechText || currentBriefingText, selectedCoach);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      loadAndPlayTTS(activeSpeechText || currentBriefingText, selectedCoach);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Floating / Persistent Audio Coach Console */}
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Coach Identity & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedCoach.accentColor} flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-emerald-500/10`}
              >
                {selectedCoach.displayName.split(' ')[1]?.[0] || 'C'}
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-base">
                  {selectedCoach.displayName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedCoach.badge}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1 font-mono">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  gemini-3.8-flash-tts
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-sm sm:max-w-md">
                {selectedCoach.title} • {selectedCoach.personality}
              </p>
            </div>
          </div>

          {/* Controls: Play, Fast, Mute, Custom TTS */}
          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
            {/* Play/Pause Main Button */}
            <button
              onClick={handleTogglePlay}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-emerald-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Briefing</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Listen to Coach</span>
                </>
              )}
            </button>

            {/* Quick Restart */}
            <button
              onClick={handleRestart}
              title="Restart Audio"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Rate Toggle */}
            <button
              onClick={handleRateChange}
              title="Playback Speed"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
            >
              {playbackRate}x
            </button>

            {/* Mute Button */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Custom Voice Request Modal Trigger */}
            <button
              onClick={() => setShowCustomModal(true)}
              title="Custom Coach Prompt"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Expand / Minimize Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Audio Waveform Equalizer & Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Equalizer Waveform Animation */}
            <div className="flex items-end gap-1 h-5 w-16 px-1">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.3, 0.7].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, Math.sin((currentTime * 4) + i) * 80 + 20)}%` : `${height * 100}%`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            {/* Scrubber Range Input */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 w-8">
                {formatSeconds(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] font-mono text-slate-500 w-8">
                {formatSeconds(duration)}
              </span>
            </div>

            {/* Download Audio Button */}
            {audioUrl && (
              <a
                href={audioUrl}
                download={`coach-${selectedCoach.voiceName.toLowerCase()}-briefing.wav`}
                className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                title="Download Spoken Audio (.wav)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Save WAV</span>
              </a>
            )}
          </div>
        </div>

        {/* Expanded View: Voice Selector & Live Transcript */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            {/* Select Coach Persona */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Coach Voice Persona
                </span>
                <span className="text-xs text-slate-500">Powered by Gemini 3.8 Flash TTS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COACH_VOICES.map((coach) => {
                  const isSelected = coach.id === selectedCoach.id;
                  return (
                    <button
                      key={coach.id}
                      onClick={() => {
                        onSelectCoach(coach);
                        if (isPlaying) {
                          loadAndPlayTTS(activeSpeechText, coach);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs text-white">
                          {coach.displayName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {coach.voiceName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {coach.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transcript Preview */}
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Spoken Script (TTS Grounded)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {selectedCoach.voiceName} voice model
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                "{activeSpeechText || 'No briefing generated yet. Click listen to hear your coach analyze your day!'}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Coach Query Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Speak with {selectedCoach.displayName}
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Type any workout question, pre-workout pep talk, or nutrition prompt.
              Gemini 3.8 Flash TTS will speak it directly with high-fidelity voice nuance!
            </p>

            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Give me an intense 30-second pep talk before my heavy squat session!"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {/* Quick Inspiration chips */}
            <div className="flex flex-wrap gap-1.5 my-3">
              {[
                'Post-workout meal advice for chest day',
                'Fast 30-second morning motivation',
                'Hydration check for hot weather',
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setCustomPrompt(sample)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading || !customPrompt.trim()}
                onClick={async () => {
                  const query = customPrompt.trim();
                  setShowCustomModal(false);
                  setCustomPrompt('');
                  await loadAndPlayTTS(query, selectedCoach);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Speak via {selectedCoach.voiceName}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
