
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types.ts";

const getLanguageName = (lang: Language) => {
  const names = { pt: 'Português', en: 'English', es: 'Español', fr: 'Français' };
  return names[lang];
};

// Fixed: Following guidelines to use direct apiKey from process.env.API_KEY
// and creating a new instance for each call as per updated SDK best practices.
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const decomposeTask = async (task: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [{
          text: `Você é um especialista em autismo. Quebre a tarefa "${task}" em 5-10 passos em ${getLanguageName(lang)}. Retorne estritamente JSON.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taskTitle: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  emoji: { type: Type.STRING }
                }
              }
            }
          },
          required: ["taskTitle", "steps"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateQuiz = async (topic: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [{
          text: `Gere 3 perguntas de múltipla escolha sobre "${topic}" em ${getLanguageName(lang)} para autistas. 
          Use linguagem simples. Retorne estritamente JSON com array "questions", cada item com "question", "options" (3 itens), "correctIndex" (0-2) e "emoji".`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  emoji: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const parsed = JSON.parse(response.text || '{ "questions": [] }');
    return parsed.questions && parsed.questions.length > 0 ? parsed : null;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};

export const generateCourseContent = async (topic: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [{
          text: `Crie um curso de 3 lições sobre "${topic}" em ${getLanguageName(lang)}. 
          Foco em autismo: use passos concretos. Retorne estritamente JSON.`
        }]
      }],
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
          },
          required: ["title", "lessons"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Course Generation Error:", error);
    return null;
  }
};

export const generateDailyIncentive = async (lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Dê uma frase curta de incentivo para uma pessoa autista em ${getLanguageName(lang)}. Seja encorajador.` }] }],
    });
    return response.text || "Você é incrível! 🌟";
  } catch (error) {
    return "Você é capaz! 🌟";
  }
};

export const askCaregiverExpert = async (question: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: question }] }],
      config: {
        systemInstruction: `Você é um especialista em autismo altamente qualificado. Responda em ${getLanguageName(lang)} de forma prática, acolhedora e direta.`,
      }
    });
    return response.text || "Não consegui processar a dúvida.";
  } catch (error) {
    return "Erro de conexão com o especialista.";
  }
};

export const generateSocialStory = async (situation: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Crie uma história social curta para a situação: "${situation}" em ${getLanguageName(lang)}. Use linguagem concreta e positiva.` }] }],
    });
    return response.text || "História não disponível.";
  } catch (error) {
    return "Erro ao gerar história.";
  }
};

export const createEducationalMaterial = async (prompt: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text || "Conteúdo indisponível.";
  } catch (error) {
    return "Erro ao gerar material.";
  }
};

export const generateFlashcards = async (topic: string, lang: Language = 'pt') => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Gere 6 flashcards educativos sobre ${topic} em ${getLanguageName(lang)}. Retorne JSON.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  emoji: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"cards":[]}');
  } catch (error) {
    return { cards: [] };
  }
};
