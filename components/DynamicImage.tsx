'use client'

import Image from "next/image"
import { CSSProperties } from "react";

export default function DynamicImage({ src, alt, fill, priority, className, thumbnail }: {
    src: string,
    alt: string,
    fill?: boolean
    priority?: boolean,
    thumbnail?: boolean,
    className?: string
}) {
    const sizes = thumbnail ?
        "40vw" :
        "(max-width: 768px) 80vw, (max-width: 1200px) 90vw, 100vw";
    const width = fill ? undefined : thumbnail ? 160 : 640;
    const height = fill ? undefined : thumbnail ? 120 : 480;
    const style: CSSProperties = fill ? { objectFit: 'contain' } : { height: 'auto' }

    return (
        <div className={`relative ${fill && "w-full h-full"}`} >
            <Image
                src={src}
                alt={alt}
                priority={priority ?? false}
                style={{
                    width: '100%',
                    ...style
                }}
                fill={fill}
                width={width}
                height={height}
                sizes={sizes}
                className={className}
            />
        </div >
    );
}