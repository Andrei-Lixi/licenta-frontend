import { useState } from "react";

const TOKEN_KEY = "authToken"; // Cheia pentru localStorage



export function useAuthToken() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  
  // Salvăm token-ul în localStorage și actualizăm starea
  const saveToken = (newToken) => {
    
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  // Ștergem token-ul la logout
  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  function decodeJWT(token) {
    try {
      const [headerB64, payloadB64, signatureB64] = token.split('.');
  
      const decodeBase64Url = (str) => {
        // Înlocuim caracterele non-standard
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Adăugăm padding dacă lipsește
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        // Decodăm și parsăm JSON-ul
        return JSON.parse(atob(padded));
      };
  
      const header = decodeBase64Url(headerB64);
      const payload = decodeBase64Url(payloadB64);
  
      return  payload;
    } catch (error) {
      console.error('Token invalid:', error);
      return null;
    }
  };
  
  const getRol = () => {
    return decodeJWT(token)['roles'][0];
    
    
  };

  return { token, saveToken, removeToken, getRol};
}
