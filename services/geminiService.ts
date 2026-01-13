
import { GoogleGenAI, Type } from "@google/genai";
import { Product, SearchResult } from "../types";

// Helper to convert base64 data URL to raw base64 string
const cleanBase64 = (dataUrl: string) => dataUrl.split(',')[1];

export const identifyFlower = async (
  queryImageBase64: string,
  inventory: Product[]
): Promise<SearchResult | null> => {
  if (inventory.length === 0) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We'll send a subset of the inventory if it's too large, 
  // but for small/medium shops we can send the visual context.
  // Strategy: Send the query image and the names/descriptions/images of candidates.
  
  const queryPart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: cleanBase64(queryImageBase64)
    }
  };

  // Limit candidates to top 20 for context window efficiency in this prototype
  const candidates = inventory.slice(0, 20);
  
  const inventoryContext = candidates.map((p, idx) => `[ID: ${p.id}, Name: ${p.name}, Desc: ${p.description}]`).join('\n');

  const prompt = `
    Bạn là một chuyên gia về hoa. Tôi sẽ cung cấp một hình ảnh hoa mà khách hàng đang hỏi (Query Image).
    Dưới đây là danh sách các loại hoa hiện có trong cửa hàng của tôi:
    ${inventoryContext}

    Nhiệm vụ: 
    1. Phân tích hình ảnh Query Image.
    2. So sánh với danh sách hoa trong kho.
    3. Tìm ra hoa khớp nhất dựa trên màu sắc, hình dáng cánh hoa, và đặc điểm nhận dạng.
    4. Trả về kết quả dưới dạng JSON.

    Nếu không tìm thấy hoa nào khớp, hãy trả về confidence thấp.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [queryPart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productId: { type: Type.STRING, description: "ID của sản phẩm khớp nhất" },
            confidence: { type: Type.NUMBER, description: "Độ tin cậy từ 0-1" },
            reason: { type: Type.STRING, description: "Lý do tại sao chọn sản phẩm này" }
          },
          required: ["productId", "confidence", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as SearchResult;
    return result;
  } catch (error) {
    console.error("Gemini Recognition Error:", error);
    return null;
  }
};

export const autoTagProduct = async (imageBase64: string): Promise<{ name: string, description: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const part = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: cleanBase64(imageBase64)
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: "Phân tích hình ảnh hoa này và cho tôi tên loại hoa (ngắn gọn) và mô tả chi tiết về màu sắc, kiểu dáng (dưới 30 từ)." }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["name", "description"]
      }
    }
  });

  return JSON.parse(response.text || '{"name": "Hoa lạ", "description": "Không xác định"}');
};
