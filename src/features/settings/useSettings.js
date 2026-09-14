import { useQuery } from "@tanstack/react-query";
import { handleGetSettings } from "../../apis";

export function useSettings() {
  const {
    isLoading,
    error,
    data: settings = {},
  } = useQuery({
    queryKey: ["settings"],
    queryFn: handleGetSettings,
  });

  return { isLoading, error, settings: settings || {} };
}
