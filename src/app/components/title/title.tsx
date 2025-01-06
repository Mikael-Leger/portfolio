import { RefObject, useEffect } from "react";

import "./title.scss";

type TitleProps = {
    text: string;
    size?: "big" | "medium" | "small" | "normal";
    effect?: "neon" | "shadow" | "gradient";
    transform?: "upper";
    decoration?: "underline";
    color?: string;
};

export default function Title({ text, effect, transform, decoration, color = "", size = "normal" }: TitleProps) {
    return (
        <div className={`title title-${size} ${effect ? `title-${effect}${color}` : ''} ${transform ? `title-${transform}` : ''} ${decoration ? `title-${decoration}` : ''}`}>
            {text}
        </div>
    );
}