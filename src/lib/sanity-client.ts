import { useQuery } from "@tanstack/react-query";

const fetchSanityData = async () => {
  // The query lives server-side in api/sanity.ts; sending one from here is
  // what made the endpoint an open GROQ proxy.
  const response = await fetch("/api/sanity");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data?.result;
};

export const useSanityData = () => {
  return useQuery({
    queryKey: ["sanity-data"],
    queryFn: fetchSanityData,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry twice in case of failure
  });
};