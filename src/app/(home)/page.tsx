"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image
        src="/banner-home-1.png"
        height={0}
        width={0}
        alt="Até 55% de desconto esse mes"
        className="h-auto w-full"
        sizes="100vw"
      />
    </div>
  );
}
