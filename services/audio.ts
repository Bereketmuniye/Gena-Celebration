
export const playMelkamGennaSpeech = async () => {
  try {
    const utterance = new SpeechSynthesisUtterance("Merry Christmas!");
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Google US English') ||
      v.name.includes('Samantha') ||
      (v.lang === 'en-US' && v.name.includes('Google'))
    ) || voices.find(v => v.lang === 'en-US') || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    // Cancel any currently playing speech to prevent queuing
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Failed to play Melkam Genna speech:", error);
  }
};

export const playLaunchSound = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(40, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.5);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
  setTimeout(() => ctx.close(), 600);
};

export const playBurstSound = (isGrand = false) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playImpact = (delay: number, volume: number, pitch: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + delay + 0.2);

      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    };

    if (isGrand) {
      for (let i = 0; i < 5; i++) {
        playImpact(i * 0.05, 0.2, 800 + (i * 100), 'triangle');
      }
    } else {
      playImpact(0, 0.3, 1200);
      playImpact(0.05, 0.1, 400);
    }

    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    }, 1000);
  } catch (error) {
    console.warn("Audio playback failed:", error);
  }
};
