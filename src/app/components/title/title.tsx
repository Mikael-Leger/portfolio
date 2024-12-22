import { useEffect } from "react";

import { TimelineProp } from "@/app/types/timeline-prop";

import "./title.scss";

type TitleProps = {
    text: string;
    size?: "big" | "normal";
};

export default function Title({ text, size }: TitleProps) {
    return (
        <div className={`title title-${size}`}>
            {text}
        </div>
    );
}