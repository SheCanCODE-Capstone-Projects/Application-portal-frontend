import {cn} from "@/lib/utils";
import Image from "next/image";
import {className} from "postcss-selector-parser";

export default function Logo() {
    return (
        <header
            className={cn(
                "flex items-center justify-center py-4 sm:py-6",
                className
            )}
        >
            <div className="relative h-15 w-15 sm:h-20 sm:w-20 md:h-16 md:w-16">
                <Image
                    src="/images/logo-igire.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </header>
    )
}