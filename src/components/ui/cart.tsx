import { ShoppingCartIcon, Loader2 } from "lucide-react";
import { Badge } from "./badge";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/providers/cart";
import CartItem from "./cart-item";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { createCheckout } from "@/actions/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { createOrder } from "@/actions/order";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { data } = useSession();
  const router = useRouter();
  const { products, errorCart, total, subtotal, totalDiscount, reloadCart } =
    useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  console.log("no cart", products);
  const handleSignInClick = async () => {
    return router.replace("/login");
  };

  useEffect(() => {
    if (errorCart) {
      toast.error(errorCart);
    }
  }, [errorCart]);

  const handleFinishedPurchaseClick = async () => {
    try {
      setIsLoading(true);
      if (!data?.user) {
        // TODO: redirecionar para o login
        toast("Faça login para continuar!", {
          description: "não foi possível atender sua solicitação.",
        });

        setTimeout(() => {
          handleSignInClick();
        }, 2000);

        return;
      }

      const order = await createOrder(products, (data?.user as any).id);

      const checkout = await createCheckout(products, order.id);

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      );

      console.log({ stripe });
      console.log({ checkout });
      debugger;

      stripe?.redirectToCheckout({
        sessionId: checkout.id,
      });
      debugger;
    } catch (error) {
      toast.error("Erro ao finalizar compra, tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <Badge
        className="w-fit gap-1 border-primary px-3 py-[0.375rem] text-base uppercase"
        variant="outline"
      >
        <ShoppingCartIcon size={16} />
        Carrinho
      </Badge>

      <div className="flex h-full max-h-full flex-col gap-5 overflow-hidden">
        <ScrollArea className="h-full">
          {errorCart ? (
            <Button onClick={reloadCart}>Tentar novamente</Button>
          ) : (
            <div className="flex h-full flex-col gap-y-8 ">
              {products.length > 0 ? (
                products.map((product) => (
                  <CartItem key={product.id} product={product} />
                ))
              ) : (
                <p className="text-center font-semibold">
                  Seu carrinho está vazio!
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-3">
        {products.length > 0 && (
          <>
            <Separator />

            <div className="flex items-center justify-between text-xs">
              <p>Subtotal</p>
              <p>R$ {subtotal.toFixed(2)}</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-xs">
              <p>Entrega</p>
              <p>Grátis</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-xs">
              <p>Descontos</p>
              <p>R$ {totalDiscount.toFixed(2)}</p>
            </div>
            <Separator />

            <div className="flex items-center justify-between text-sm font-bold">
              <p>Total a pagar</p>
              <p>R$ {total.toFixed(2)}</p>
            </div>
            <Button
              className="mt-7 bg-secondary font-bold uppercase hover:bg-primary"
              onClick={handleFinishedPurchaseClick}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finalizar compra
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
