"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const route = useRouter();
  const { status, data } = useSession();

  const [dataLogin, setDataLogin] = React.useState({
    email: "",
  });

  const handleLoginClick = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataLogin((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLoginCredentials = async (e: React.SyntheticEvent) => {
    console.log(dataLogin);
    e.preventDefault();
    const res = await signIn<"credentials">("credentials", {
      ...dataLogin,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.ok) {
      route.replace("/");
    } else if (res?.error) {
      toast.error("Login falhou: " + res.error);
    }
  };

  React.useEffect(() => {
    if (status === "authenticated") {
      route.replace("/");
    }
  }, [status, route]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLoginCredentials}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Bem-vindo a JP Store.</h1>
          </div>
          <div className="flex flex-col gap-6">
            {/* <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={handleChange}
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div> */}
            {/* <Button variant={"secondary"} type="submit" className="w-full">
              Login
            </Button> */}
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            {/* <span className="relative z-10 bg-background px-2 text-muted-foreground">
              ou
            </span> */}
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              type="button"
              className="flex w-full items-center justify-center gap-4 text-nowrap"
              onClick={handleLoginClick}
            >
              <Image
                src="/google-icon-logo-svgrepo-com.svg"
                alt="Google Icon"
                width={16}
                height={16}
              />
              Continue com Google
            </Button>
          </div>
        </div>
      </form>
      {/* <div className="*:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
