import Image from "next/image";
import { cn } from "@/lib/utils";

export function Photo({
  src,
  alt,
  className,
  priority = false,
  sizes = "100vw",
  grain = true,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  grain?: boolean;
}) {
  return (
    <div className={cn("photo-frame", grain && "photo-grain", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
