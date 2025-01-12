import { RefObject, useEffect } from "react";
import { Context } from "@/app/interfaces/skill.interface";

import "./tooltip.scss";

type TooltipProps = {
    text: string;
    context: Context;
};

export default function Tooltip({ text, context }: TooltipProps) {
    if (text == null && context == null) {
        return;
    }
    return (
        <div className="hint" data-position="4">
            <img className="logo-icon invert" src="/icons/help.png" />
            <div className="hint-content do--split-children">
                {text != "" && (
                    <p>{text}</p>
                )}
                {context != null && Object.entries(context).map(([key, value]) =>
                    value && <p key={key}>{key}: {value}</p>
                )}
            </div>
        </div>
    );
}