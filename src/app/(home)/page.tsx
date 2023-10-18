"use client";

import Image from "next/image";
import Categories from "./components/catergories";

export default function Home() {
  return (
    <div className="p-5">
      <Image
        src="/banner-home-1.png"
        height={0}
        width={0}
        alt="Até 55% de desconto esse mes"
        className="h-auto w-full"
        sizes="100vw"
      />

      <div className="mt-8">
        <Categories />
      </div>
    </div>
  );
}
