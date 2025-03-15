import axios from "axios";
import { FetchResponseContext } from "../useFetchHook/useFetch";

export const useFetchData = ({ children }) => {
  const getResponse = async (url) => {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      }
    } catch {
      throw new Error("Fetching error...");
    }
  };

  return (
    <FetchResponseContext.Provider value={getResponse}>
      {children}
    </FetchResponseContext.Provider>
  );
};
