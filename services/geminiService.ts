
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBattleCommentary = async (
  attacker: string,
  defender: string,
  moveName: string,
  isCritical: boolean,
  isEffective: 'NORMAL' | 'SUPER' | 'NOT'
) => {
  try {
    const prompt = `Write a short, dramatic Pokémon-style battle line for: ${attacker} used ${moveName} on ${defender}.
    Effectiveness: ${isEffective}.
    Critical hit: ${isCritical}.
    Keep it under 15 words and in English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text?.trim() || `${attacker} used ${moveName}!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `${attacker} used ${moveName}!`;
  }
};

export const getVictoryText = async (winner: string, loser: string) => {
  try {
    const prompt = `Write a victory message for ${winner} who just defeated ${loser} in a Gemimon battle. Under 15 words.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || `${winner} won the battle!`;
  } catch (error) {
    return `${winner} won!`;
  }
};
