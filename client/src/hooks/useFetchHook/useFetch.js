import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
export const FetchResponseContext = createContext();

export function useFetch(userId) {
  const { getResponse } = useContext(FetchResponseContext);
  const { data, isLoading, isError } = useQuery(
    {
      queryKey: "fetch",
      queryFn: getResponse(`/user/v1/${userId}`),
    },
    {
      cacheTime: 10000,
      onError: (err) => {
        console.error("Error fetching blog:", err.message);
      },
      refetchOnWindowFocus: true,
      enabled: true, // Ensures the query only runs if userId is defined and Set this to false to disable this query from automatically running.
    }
  );

  return { data, isLoading, isError };
}
