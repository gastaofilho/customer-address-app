const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("A variável NEXT_PUBLIC_API_URL não foi configurada.");
}

export const API_URL = apiUrl;