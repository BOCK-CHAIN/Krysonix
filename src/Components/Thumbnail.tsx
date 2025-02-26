import React from "react";
import Image from "next/image";
import { cn } from "~/lib/utils";

export function Thumbnail({
  thumbnailUrl,
  width,
  height,
}: {
  thumbnailUrl: string | null | undefined;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={cn("relative inset-0 h-0 w-full pb-[25%] ", {
        "w-full": !width,
        "h-0": !height,
        "pb-[50%]": !height && !width,
      })}
    >
      {width && height ? (
        <Image
          src={thumbnailUrl ? `${thumbnailUrl}` : "/background.jpg"}
          alt="Alternative"
          width={width}
          height={height}
          className="absolute inset-0 left-0 top-0 rounded-2xl"
        />
      ) : (
        <Image
          src={thumbnailUrl ? `${thumbnailUrl}` : "/background.jpg"}
          alt="Alternative"
          fill
          className="absolute inset-0 left-0 top-0 rounded-2xl"
        />
      )}
    </div>
  );
}
