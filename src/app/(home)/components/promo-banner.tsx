import Image, { ImageProps } from "next/image";

const PromoBanner = ({ alt, ...props }: ImageProps) => {
  return (
    <Image
      height={0}
      width={0}
      alt={alt}
      className="mx-auto h-auto w-full px-5 md:h-72 md:w-[900px]"
      sizes="80vw"
      priority={true}
      {...props}
    />
  );
};

export default PromoBanner;
