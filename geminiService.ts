
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseDetectionResult } from "./types";

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
  console.warn('Gemini API key not set. Please set GEMINI_API_KEY in your .env.local file.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'PLACEHOLDER_API_KEY' });

export const detectCropDisease = async (base64Image: string, lang: 'en' | 'bn'): Promise<DiseaseDetectionResult> => {
  // Use gemini-3-flash-preview for general multimodal analysis
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this agricultural leaf image. 
  Determine:
  1. Crop Name
  2. Disease Name (or "Healthy" if no disease)
  3. Confidence score (0 to 1)
  4. Short description of the issue
  5. Practical solutions/treatment
  6. Prevention methods for future.
  
  Provide the text values in ${lang === 'bn' ? 'Bangla' : 'English'}. 
  Ensure accuracy specific to Bangladeshi agriculture (Rice, Jute, Potato, etc).`;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image,
    },
  };

  const response = await ai.models.generateContent({
    model,
    // Use recommended part structure
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      // Configure responseSchema for typed JSON output
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          solution: { type: Type.ARRAY, items: { type: Type.STRING } },
          prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["cropName", "diseaseName", "confidence", "description", "solution", "prevention"],
      }
    }
  });

  // Access text directly from the response property
  const result = JSON.parse(response.text || '{}');
  return result;
};

export const getChatResponse = async (history: { role: string, content: string }[], userInput: string, lang: 'en' | 'bn') => {
  // Check if API key is valid
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error(lang === 'bn'
      ? 'API কী সেট করা হয়নি। অনুগ্রহ করে .env.local ফাইলে GEMINI_API_KEY যোগ করুন।'
      : 'API key not set. Please add GEMINI_API_KEY to your .env.local file.'
    );
  }

  try {
    const model = "gemini-3-flash-preview";

    const systemInstruction = `You are Agro Vision's AI Agriculture Assistant.
    You help Bangladeshi farmers with crop diseases, fertilizers, and farming techniques.
    Be polite, encouraging, and use simple language.
    Answer primarily in ${lang === 'bn' ? 'Bangla' : 'English'}.
    If the user asks about specific diseases, provide scientific yet practical advice.`;

    const response = await ai.models.generateContent({
      model,
      // Map conversation history to acceptable model roles
      contents: [
        ...history.map(h => ({
          role: (h.role === 'assistant' || h.role === 'model' || h.role === 'bot') ? 'model' : 'user',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction,
      }
    });

    // Return text content from response property
    return response.text;
  } catch (error: any) {
    console.error('Gemini API error:', error);

    // Handle specific API errors
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error(lang === 'bn'
        ? 'API কী অবৈধ। অনুগ্রহ করে সঠিক Google Gemini API কী ব্যবহার করুন।'
        : 'Invalid API key. Please use a valid Google Gemini API key.'
      );
    }

    if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error(lang === 'bn'
        ? 'API কোটা শেষ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।'
        : 'API quota exceeded. Please try again later.'
      );
    }

    // Generic error
    throw new Error(lang === 'bn'
      ? 'চ্যাটবট উত্তর দিতে পারছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।'
      : 'Chatbot cannot respond right now. Please try again later.'
    );
  }
};
