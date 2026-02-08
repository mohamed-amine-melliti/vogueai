
// IDM-VTON Hugging Face Inference API Integration
// Note: This requires a valid Hugging Face API Token

const HF_API_URL = "https://api-inference.huggingface.co/models/yisol/IDM-VTON";

export const generateTryOn = async (
  personImage: Blob | File,
  garmentImage: Blob | File,
  hfToken: string
): Promise<Blob> => {
  // 1. Convert inputs to Base64 if needed, or send as Multipart Form Data
  // For IDM-VTON on HF Inference API, it often accepts JSON with base64 strings
  // OR a standard inference payload.
  // However, many custom spaces/models have specific input signatures.
  // Assuming standard image-to-image or specific VTON signature.
  
  // Method A: Multipart Form Data (Common for file uploads)
  // But HF Inference API usually expects raw bytes of ONE image for simple models,
  // or a JSON payload for complex ones.
  // IDM-VTON takes multiple inputs (human, garment, mask, description).
  // The standard Inference API might not support multi-input models directly without a custom handler.
  // WE WILL USE A GENERIC FETCH IMPLEMENTATION that matches the typical Space/Model API structure.
  
  // If using a deployed Space via Gradio client:
  // import { client } from "@gradio/client";
  // const app = await client("yisol/IDM-VTON");
  // const result = await app.predict("/tryon", [personImg, garmentImg, ...]);
  
  // Since we want a "minimal JavaScript example" using fetch:
  
  try {
    // We'll convert images to base64 first to send as JSON
    const personB64 = await blobToBase64(personImage);
    const garmentB64 = await blobToBase64(garmentImage);

    const payload = {
      inputs: {
        image: personB64, // The person
        garment: garmentB64, // The cloth
        // description: "A cool t-shirt" // Optional text prompt if model supports it
      }
    };

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HF API Error: ${response.status} ${response.statusText}`);
    }

    // The API usually returns the image as a Blob directly
    const resultBlob = await response.blob();
    return resultBlob;

  } catch (error) {
    console.error("Try-On Generation Failed:", error);
    throw error;
  }
};

// Helper to convert Blob/File to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,") if API expects raw base64
      // Standard HF API usually accepts the full data URL or raw base64 depending on the task.
      // We'll keep the full URL for safety unless specified otherwise.
      resolve(base64String); 
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
