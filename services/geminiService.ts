
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSocialStory = async (situation: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie uma "História Social" curta e simples para uma pessoa autista sobre a seguinte situação: "${situation}". 
      A história deve ser escrita na primeira pessoa, ser positiva, direta e descrever o que esperar e como agir. 
      Use frases curtas. Divida em no máximo 5 passos claros.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao gerar história social:", error);
    return "Desculpe, não consegui gerar a história agora. Tente algo simples como 'ir ao dentista'.";
  }
};
