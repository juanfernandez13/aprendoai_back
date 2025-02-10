import axios from "axios";

const GEMINI_API_URL = ""; // AAAAAAAAAAAAAAAAAAAAAAAAA p i?
const GEMINI_API_KEY = "AIzaSyA8wd6JmHymHBQKPQ3hib74azbBFi5372M";

// Definir um tipo para a resposta da API
interface GeminiResponse {
  text: string;
}

export const generateTextWithGemini = async (prompt: string): Promise<GeminiResponse> => {
    try {
      const response = await axios.post<GeminiResponse>(
        GEMINI_API_URL,
        { prompt: "retorne o resumo sobre o título do collectionId" },
        { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
      );
      console.log("Gemini Response:", response.data); // Adicione este log
      return { text: response.data.text };  // Retorna como um objeto com a propriedade 'text'
    } catch (error) {
      console.error("Error generating text with Gemini:", error); // Verifique o erro
      throw new Error("Failed to generate summary");
    }
  };
  
