import { useEffect } from "react";

import "./title.scss";

type TitleProps = {
    text: string;
    size?: "big" | "normal";
    effect?: "neon" | "shadow" | "gradient";
    transform?: "upper";
    color?: string;
};

export default function Title({ text, effect, transform, color = "", size = "normal" }: TitleProps) {
    return (
        <div className={`title title-${size} ${effect ? `title-${effect}${color}` : ''} ${transform ? `title-${transform}` : ''}`}>
            {text}
        </div>
    );
}