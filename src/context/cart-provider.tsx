"use client";

import { useTheme } from "next-themes";
import { createContext, useCallback, useEffect, useState, useTransition } from "react";

import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";

export const CartContext = createContext<CartContextType | undefined>(undefined);

const BaseCartProvider = ({ children, appService }: { children: React.ReactNode; appService: AppService }) => {
  const [cart, setCart] = useState<CartedProduct[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isAddToCartPending, startAddToCartTransition] = useTransition();
  const [isAddToCartWithRoutePending, startAddToCartWithRouteTransition] = useTransition();
  const [isRemoveFromCartPending, startRemoveFromCartTransition] = useTransition();
  const [isUpdateQuantityPending, startUpdateQuantityTransition] = useTransition();
  const [isPurchaseProductFromCartPending, startPurchaseProductFromCartTransition] = useTransition();
  const { user } = useSession();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const getAllProductsFromCart = useCallback(() => {
    startTransition(async () => {
      const response = await appService.getProductsFromCart();
      if (response) {
        setCart([...response]);
      }
    });
  }, [appService]);

  const addToCart = (productSlug: string, quantity: number) => {
    startAddToCartTransition(async () => {
      const response = await appService.storeProductsInCart({ product_slug: productSlug, quantity });
      if (response) {
        setCart((previousCart) => [...previousCart, response.data]);
        Toast.getInstance().showToast({
          title: "Success",
          description: `Product added to cart successfully`,
          variant: "success",
        });
      }
    });
  };

  const addToCartWithRoute = (productSlug: string, quantity: number) => {
    startAddToCartWithRouteTransition(async () => {
      const response = await appService.storeProductsInCart({ product_slug: productSlug, quantity });
      if (response) {
        setCart((previousCart) => [...previousCart, response.data]);
        Toast.getInstance().showToast({
          title: "Success",
          description: `Product added to cart successfully`,
          variant: "success",
        });
      }
    });
  };

  const removeFromCart = (productId: string) => {
    startRemoveFromCartTransition(async () => {
      const response = await appService.deleteProductInCart(productId);
      if (response) {
        setCart((previousCart) => previousCart.filter((item) => item.id !== productId));
        Toast.getInstance().showToast({
          title: "Success",
          description: `Product removed from cart successfully`,
          variant: "success",
        });
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    startUpdateQuantityTransition(async () => {
      const response = await appService.updateProductInCart(productId, { quantity });
      if (response) {
        setCart((previousCart) => previousCart.map((item) => (item.id === productId ? { ...item, quantity } : item)));
        Toast.getInstance().showToast({
          title: "Success",
          description: `Product quantity updated successfully`,
          variant: "success",
        });
      }
    });
  };

  const purchaseProductInCart = (cart: CartedProduct[]) => {
    if (cart.length === 0) {
      Toast.getInstance().showToast({
        title: "Error",
        description: `No products in cart to purchase`,
        variant: "error",
      });
      return;
    }

    const data = {
      amount: cart.reduce((total, item) => total + item.product_price * item.quantity, 0),
      products: cart.map((item) => ({
        product_slug: item.product_slug,
        quantity: item.quantity,
      })),
    };

    startPurchaseProductFromCartTransition(async () => {
      const response = await appService.purchaseProductInCart(data);
      if (response) {
        Toast.getInstance().showToast({
          title: "Success",
          description: `Purchase initiated! Redirecting to payment...`,
          variant: "success",
        });
        window.location.href = response.authorization_url;
      }
    });
  };

  useEffect(() => {
    if (user) {
      getAllProductsFromCart();
    }
  }, [getAllProductsFromCart, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isPending,
        isAddToCartPending,
        isAddToCartWithRoutePending,
        isRemoveFromCartPending,
        isUpdateQuantityPending,
        isPurchaseProductFromCartPending,
        addToCart,
        addToCartWithRoute,
        removeFromCart,
        updateQuantity,
        purchaseProductInCart,
        getAllProductsFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartProvider = WithDependency(BaseCartProvider, {
  appService: dependencies.APP_SERVICE,
});
