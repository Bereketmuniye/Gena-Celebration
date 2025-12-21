
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Exporting getAI to resolve import error in components and ensuring initialization follows SDK guidelines
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCulturalResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = getAI();
  // Fixed: Included history in chats.create to maintain conversation state
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    },
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text || "I apologize, my chronicles seem momentarily clouded.";
};

export const generateEthiopianVisual = async (description: string): Promise<string | null> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A high-quality, cinematic, charismatic depiction of Ethiopia: ${description}. Vibrant colors, realistic textures, rich lighting.` }
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      }
    }
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    // Correctly iterating through parts to find the image data
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const getRecipe = async (dishName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate an authentic Ethiopian recipe for ${dishName}. Return JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          history: { type: Type.STRING },
        },
        required: ["name", "ingredients", "instructions", "history"],
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
};
