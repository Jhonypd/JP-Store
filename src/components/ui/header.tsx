"use client";
import { Card } from "./card";
import { Button } from "./button";
import {
  MenuIcon,
  ShoppingCartIcon,
  LogInIcon,
  PercentIcon,
  ListOrderedIcon,
  HomeIcon,
  LogOutIcon,
  ShoppingBag,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./sheet";
import { signIn, useSession, signOut } from "next-auth/react";
import { Avatar } from "./avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "./separator";
import Link from "next/link";
import Cart from "./cart";
import CounterItemBadge from "./count-item-badge";
import { CartContext } from "@/providers/cart";
import { useContext } from "react";

const Header = () => {
  const { status, data } = useSession();

  const { products } = useContext(CartContext);

  const handleLoginClick = async () => {
    await signIn();
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  return (
    <Card className="flex items-center justify-between p-[1.875rem]">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="text-left text-lg font-semibold">
            Menu
          </SheetHeader>
          <div className="mt-2 flex flex-col gap-2">
            {status === "authenticated" && data?.user && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 py-4">
                  <Avatar>
                    <AvatarFallback>
                      {data.user.name?.[0].toUpperCase()}
                    </AvatarFallback>
                    {data.user.image && <AvatarImage src={data.user.image} />}
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-midium">{data.user.name}</p>
                    <p className="text-sm opacity-75">Boas compras!</p>
                  </div>
                </div>
                <Separator />
              </div>
            )}

            <SheetClose asChild>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <HomeIcon size={16} />
                  Início
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ShoppingBag size={16} />
                  Meus Pedidos
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/deals">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <PercentIcon size={16} />
                  Ofertas
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/catalog">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ListOrderedIcon size={16} />
                  Catálogo
                </Button>
              </Link>
            </SheetClose>
            <div className="mt-4 flex flex-col gap-2">
              {status === "unauthenticated" && (
                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <LogInIcon size={16} />
                  Fazer Login
                </Button>
              )}

              {status === "authenticated" && (
                <Button
                  onClick={handleLogoutClick}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <LogOutIcon size={16} />
                  Fazer Logout
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/">
        <h1 className="text-lg font-semibold">
          <span className="text-secondary">JP</span> Store
        </h1>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            {products.length > 0 && (
              <CounterItemBadge className="absolute right-5 top-6">
                {products.length}
              </CounterItemBadge>
            )}
            <ShoppingCartIcon />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <Cart />
        </SheetContent>
      </Sheet>
    </Card>
  );
};

export default Header;
