
import { GoogleGenAI, Modality } from "@google/genai";

// Standard base64 decode for the raw PCM stream
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM data (Int16) into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playMelkamGennaSpeech = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: 'Say cheerfully and warmly in an Ethiopian accent: Melkam Genna!' }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
    
    const audioBytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(
      audioBytes,
      outputAudioContext,
      24000,
      1
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
    
    source.onended = () => {
      outputAudioContext.close();
    };
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

  setTimeout(() => ctx.close(), 1000);
};
