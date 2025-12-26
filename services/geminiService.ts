
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSocialStory = async (situation: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie uma História Social curta e clara para uma pessoa autista sobre: "${situation}". Use frases curtas, primeira pessoa e divida em 5 passos simples com emojis.`,
    });
    return response.text || "Não foi possível gerar a história agora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, o assistente de histórias está descansando. Tente novamente em breve!";
  }
};

export const createEducationalMaterial = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique de forma visual e simples sobre: "${prompt}". Use tópicos curtos, analogias simples e muitos emojis. Foco em clareza literal.`,
      config: {
        systemInstruction: "Você é um tutor de educação especial focado em clareza e previsibilidade.",
      }
    });
    return response.text || "Material não disponível.";
  } catch (error) {
    return "Ocorreu um erro ao criar o material educativo.";
  }
};

export const generateDailyIncentive = async () => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma única frase de incentivo positiva e curta para uma criança autista começar o dia. Use um emoji de estrela ou troféu.",
    });
    return response.text || "Você é capaz de coisas incríveis hoje! 🌟";
  } catch (error) {
    return "Hoje é um ótimo dia para brilhar! 🌟";
  }
};
