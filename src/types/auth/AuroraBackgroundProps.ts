import {ReactNode} from "react";

export interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}