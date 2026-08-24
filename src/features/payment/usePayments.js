import { useMutation } from "@tanstack/react-query";
import {
  handlePayWithCOD,
  handlePayWithMoMo,
  handlePayWithVNPay,
  handlePayWithZaloPay,
} from "../../apis";

export function usePayments() {
  const momo = useMutation({ mutationFn: handlePayWithMoMo });
  const zalo = useMutation({ mutationFn: handlePayWithZaloPay });
  const vnpay = useMutation({ mutationFn: handlePayWithVNPay });
  const cod = useMutation({ mutationFn: handlePayWithCOD });

  const isPending =
    momo.isLoading || zalo.isLoading || vnpay.isLoading || cod.isLoading;

  return {
    payWithMoMo: momo.mutateAsync,
    payWithZaloPay: zalo.mutateAsync,
    payWithVNPay: vnpay.mutateAsync,
    payWithCOD: cod.mutateAsync,
    isPending,
  };
}
