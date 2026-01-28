import {AuroraBackgroundProps} from "@/types/auth/AuroraBackgroundProps";
import {cn} from "@/lib/utils";

export const AuroraBackground = ({
                              className,
                              children,
                              showRadialGradient = true,
                              ...props
                          }: AuroraBackgroundProps) => {
    return (
        <main>
            <div
                className={cn(
                    "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={cn(
                            `
            [--white-gradient:repeating-linear-gradient(100deg,#f0f5f0_0%,#f0f5f0_7%,transparent_10%,transparent_12%,#f0f5f0_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#1a2e1a_0%,#1a2e1a_7%,transparent_10%,transparent_12%,#1a2e1a_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3d5c3d_10%,#c97a1a_15%,#5a7d5a_20%,#d4a84a_25%,#4a6b4a_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
                            showRadialGradient &&
                            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                        )}
                    ></div>
                </div>
                {children}
            </div>
        </main>
    );
};