import { useEffect } from "react";

import "./title.scss";

type TitleProps = {
    text: string;
    size?: "big" | "normal";
    effect?: "neon" | "shadow" | "gradient";
    transform?: "upper";
};

export default function Title({ text, effect, transform, size = "normal" }: TitleProps) {
    return (
        <div className={`title title-${size} ${effect ? `title-${effect}` : ''} ${transform ? `title-${transform}` : ''}`}>
            {text}
        </div>
    );
}