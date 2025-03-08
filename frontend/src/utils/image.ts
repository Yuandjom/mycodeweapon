// For the Gemini API format
const fileToGenerativePart = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String =
        typeof reader.result === "string" ? reader.result.split(",")[1] : "";

      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// For the OpenAI API format
const fileToOpenAIImageContent = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String =
        typeof reader.result === "string" ? reader.result.split(",")[1] : "";

      resolve({
        type: "image_url",
        image_url: {
          url: `data:${file.type};base64,${base64String}`,
          detail: "high",
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
