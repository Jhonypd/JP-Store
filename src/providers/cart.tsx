"use client";

import { ProductWithTotalPrice } from "@/helpers/products";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

export interface CartProduct extends ProductWithTotalPrice {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  cartTotalPrice: number;
  cartBasePrice: number;
  cartTotalDiscount: number;
  total: number;
  subtotal: number;
  totalDiscount: number;
  addProductToCart: (product: CartProduct) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  isLoading: boolean;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  cartTotalPrice: 0,
  cartBasePrice: 0,
  cartTotalDiscount: 0,
  total: 0,
  subtotal: 0,
  totalDiscount: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  isLoading: false,
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  // ----------------------------
  // LOCAL STORAGE FUNÇÕES
  // ----------------------------
  const loadCartFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("@fsw-store/cart-products");
      if (savedCart) {
        setProducts(JSON.parse(savedCart));
      }
    }
  };

  const saveToLocalStorage = (products: CartProduct[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "@fsw-store/cart-products",
        JSON.stringify(products),
      );
    }
  };

  // ----------------------------
  // BANCO/API FUNÇÕES
  // ----------------------------
  const loadCartFromDatabase = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/${session.user.id}`);
      if (response.ok) {
        const cartData = await response.json();
        setProducts(cartData.products || []);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------
  // MIGRAÇÃO DO LOCAL -> BANCO
  // ----------------------------
  const migrateLocalCartToDatabase = async () => {
    if (!session?.user?.id) return;
    if (typeof window === "undefined") return;

    const savedCart = localStorage.getItem("@fsw-store/cart-products");
    if (!savedCart) return;

    try {
      const localProducts: CartProduct[] = JSON.parse(savedCart);

      // Envia todos os itens do localStorage para o banco
      await Promise.all(
        localProducts.map((product) =>
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              productId: product.id,
              quantity: product.quantity,
            }),
          }),
        ),
      );

      // Limpa o localStorage depois da migração
      localStorage.removeItem("@fsw-store/cart-products");
    } catch (error) {
      console.error("Erro ao migrar carrinho local para o banco:", error);
    }
  };

  /// ----------------------------
  // EFEITO PARA TROCAR CARRINHO
  // ----------------------------
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      // 1) primeiro migra local -> banco
      migrateLocalCartToDatabase().then(() => {
        // 2) depois carrega do banco (com os itens já mesclados)
        loadCartFromDatabase();
      });
    } else if (status === "unauthenticated") {
      loadCartFromLocalStorage();
    }
  }, [status, session?.user?.id]);

  // ----------------------------
  // TOTALS
  // ----------------------------
  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, product) => acc + Number(product.basePrice) * product.quantity,
      0,
    );
  }, [products]);

  const total = useMemo(() => {
    return products.reduce(
      (acc, product) => acc + product.totalPrice * product.quantity,
      0,
    );
  }, [products]);

  const totalDiscount = subtotal - total;

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const addProductToCart = async (product: CartProduct): Promise<boolean> => {
    if (status === "unauthenticated") {
      const productIsAlreadyOnCart = products.some(
        (cartProduct) => cartProduct.id === product.id,
      );

      if (productIsAlreadyOnCart) {
        setProducts((prev) => {
          const updated = prev.map((cartProduct) =>
            cartProduct.id === product.id
              ? {
                  ...cartProduct,
                  quantity: cartProduct.quantity + product.quantity,
                }
              : cartProduct,
          );
          saveToLocalStorage(updated);
          return updated;
        });
      } else {
        setProducts((prev) => {
          const updated = [...prev, product];
          saveToLocalStorage(updated);
          return updated;
        });
      }

      return true;
    }

    // fluxo banco
    if (!session?.user?.id) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product.id,
          quantity: product.quantity,
        }),
      });

      if (response.ok) {
        const productIsAlreadyOnCart = products.some(
          (cartProduct) => cartProduct.id === product.id,
        );

        if (productIsAlreadyOnCart) {
          setProducts((prev) =>
            prev.map((cartProduct) =>
              cartProduct.id === product.id
                ? {
                    ...cartProduct,
                    quantity: cartProduct.quantity + product.quantity,
                  }
                : cartProduct,
            ),
          );
        } else {
          setProducts((prev) => [...prev, product]);
        }

        return true;
      }

      return false; // caso response não seja ok
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseProductQuantity = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (status === "unauthenticated") {
      if (product.quantity === 1) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        saveToLocalStorage(products.filter((p) => p.id !== productId));
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        );
        saveToLocalStorage(
          products.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        );
      }
      return;
    }

    // fluxo banco
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      if (product.quantity === 1) {
        await removeProductFromCart(productId);
        return;
      }

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: productId,
          quantity: product.quantity - 1,
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseProductQuantity = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (status === "unauthenticated") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
      saveToLocalStorage(
        products.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
      return;
    }

    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: productId,
          quantity: product.quantity + 1,
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Erro ao aumentar quantidade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProductFromCart = async (productId: string) => {
    if (status === "unauthenticated") {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      saveToLocalStorage(products.filter((p) => p.id !== productId));
      return;
    }

    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: productId,
        }),
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
        total,
        subtotal,
        totalDiscount,
        cartTotalPrice: total,
        cartBasePrice: subtotal,
        cartTotalDiscount: totalDiscount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
