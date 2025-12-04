import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MarketAnalysis, RecommendationType } from "../types";

// NOTE: In a real scenario, this service would fetch from your FastAPI backend.
// e.g., const response = await fetch(`http://localhost:8000/analyze/${ticker}`);
// For this demo, we use Gemini to generate realistic simulation data.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING },
    companyName: { type: Type.STRING },
    currentPrice: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    recommendation: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
    confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
    reasoning: { type: Type.STRING },
    metrics: {
      type: Type.OBJECT,
      properties: {
        peRatio: { type: Type.NUMBER },
        dividendYield: { type: Type.NUMBER },
        marketCap: { type: Type.STRING },
        volatility: { type: Type.STRING },
      },
      required: ["peRatio", "dividendYield", "marketCap", "volatility"]
    },
    history: {
      type: Type.ARRAY,
      description: "Generate 30 data points for the last 30 days trend",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          price: { type: Type.NUMBER }
        }
      }
    }
  },
  required: ["ticker", "companyName", "currentPrice", "recommendation", "metrics", "history", "reasoning", "confidenceScore"]
};

export const analyzeTicker = async (ticker: string): Promise<MarketAnalysis> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Act as a senior financial analyst. Analyze the ticker "${ticker}".
      Provide a realistic simulation of current market data, a buy/sell/hold recommendation based on typical market sentiment for this stock, 
      and generate realistic historical price data for the last 30 days to visualize a trend.
      
      If the ticker is invalid or not found, make a best guess or return generic valid data for "UNKNOWN".
      The reasoning should be concise but professional.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent/realistic data
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI analyst.");

    const rawData = JSON.parse(text);

    // Ensure enum compatibility
    let rec = RecommendationType.HOLD;
    if (rawData.recommendation === "BUY") rec = RecommendationType.BUY;
    if (rawData.recommendation === "SELL") rec = RecommendationType.SELL;

    return {
      ...rawData,
      recommendation: rec,
    } as MarketAnalysis;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze market data. Please check the ticker or API key.");
  }
};