import { GoogleGenAI, Type } from "@google/genai";
import { PostData } from '../types';

// Helper to get random number
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateSimulatedPosts = async (keyword: string, count: number = 5): Promise<PostData[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use Gemini to generate "fake" scraped data because client-side scraping of 
    // Xiaohongshu is impossible due to CORS/Security.
    const prompt = `Generate ${count} realistic social media posts that look like they came from Xiaohongshu (RedNote) for the search keyword: "${keyword}".
    Include a title, short content body (approx 50 words), a chinese username, random like count (10-5000), comment count (0-500), and a recent date.
    Ensure the tone is authentic to the platform (using emojis, casual language).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              author: { type: Type.STRING },
              likes: { type: Type.INTEGER },
              comments: { type: Type.INTEGER },
              dateString: { type: Type.STRING, description: "YYYY-MM-DD format" }
            },
            required: ["title", "content", "author", "likes", "comments", "dateString"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((item: any, index: number) => ({
      id: `${keyword}-${Date.now()}-${index}`,
      keyword,
      title: item.title,
      content: item.content,
      author: item.author,
      likes: item.likes,
      comments: item.comments,
      date: item.dateString,
      url: `https://www.xiaohongshu.com/explore/${randomInt(100000000, 999999999)}`
    }));

  } catch (error) {
    console.error("Failed to simulate scrape:", error);
    // Fallback if API fails or key missing, to keep UI working
    return Array.from({ length: count }).map((_, i) => ({
      id: `err-${Date.now()}-${i}`,
      keyword,
      title: `Error generating data for ${keyword}`,
      content: "Please check API Key. Using fallback data.",
      author: "System",
      likes: 0,
      comments: 0,
      date: new Date().toISOString().split('T')[0],
      url: "#"
    }));
  }
};