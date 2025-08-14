import { useQuery } from "@tanstack/react-query";
import { handleGetAccounts } from "../../apis/index";

export function useAccounts() {
  const {
    isLoading,
    data: accounts,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: handleGetAccounts,
  });

  return { isLoading, error, accounts };
}
