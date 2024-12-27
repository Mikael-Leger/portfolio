import { useEffect } from "react";

import "./title.scss";

type TitleProps = {
    text: string;
    size?: "big" | "normal";
    effect?: "neon" | "shadow" | "gradient";
};

export default function Title({ text, effect, size = "normal" }: TitleProps) {
    return (
        <div className={`title title-${size} ${effect ? `title-${effect}` : ''}`}>
            {text}
        </div>
    );
}