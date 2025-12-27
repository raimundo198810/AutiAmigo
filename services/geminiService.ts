
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageName = (lang: Language) => {
  const names = { pt: 'Português', en: 'English', es: 'Español', fr: 'Français' };
  return names[lang];
};

export const generateSocialStory = async (situation: string, lang: Language = 'pt') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie uma História Social extremamente visual em ${getLanguageName(lang)} sobre: "${situation}". Use frases curtas (sujeito-verbo-objeto), 100% literal, sem metáforas. Divida em passos numerados com emojis claros que representam ações físicas.`,
    });
    return response.text || "Erro.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generation story.";
  }
};

export const createEducationalMaterial = async (prompt: string, lang: Language = 'pt') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um tutor de educação especial para autistas surdos e mudos. Explique em ${getLanguageName(lang)}: "${prompt}". 
      REGRAS:
      1. Use frases curtas e diretas.
      2. Use MUITOS emojis para cada conceito principal.
      3. Liste passos de 1 a 5.
      4. Evite palavras complexas ou abstratas.
      5. Formate como um roteiro visual para fácil tradução em sinais.`,
      config: {
        systemInstruction: `Responda sempre em ${getLanguageName(lang)}. Foco total em clareza literal e apoio visual.`,
      }
    });
    return response.text || "Material não disponível.";
  } catch (error) {
    return "Error generating material.";
  }
};

export const generateCourseContent = async (topic: string, lang: Language = 'pt') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um curso rápido de 3 lições em ${getLanguageName(lang)} sobre: "${topic}". 
      Formato JSON: 
      {
        "title": "Nome do Curso",
        "lessons": [
          {"title": "Lição 1", "content": "Explicação visual curta com emojis", "icon": "emoji"},
          ...
        ]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  icon: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};

export const generateDailyIncentive = async (lang: Language = 'pt') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere uma frase de incentivo visual curta em ${getLanguageName(lang)} para uma criança autista. Use apenas palavras de ação e emojis de sucesso.`,
    });
    return response.text || "🌟";
  } catch (error) {
    return "🌟";
  }
};

export const askCaregiverExpert = async (question: string, lang: Language = 'pt') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `Você é um Especialista em autismo e surdez. Responda em ${getLanguageName(lang)}. Forneça conselhos práticos para comunicação bimodal e suporte sensorial.`,
      }
    });
    return response.text || "Error.";
  } catch (error) {
    return "Error.";
  }
};
