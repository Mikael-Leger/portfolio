import { RefObject, useEffect, useState } from "react";
import { Context } from "@/app/interfaces/skill.interface";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";
import { useIsMobile } from "@/app/contexts/mobile-context";

import "./tooltip.scss";

type TooltipProps = {
    text: string;
    context: Context;
    setMobileTooltipData: (data: any) => void;
    clickedOnTooltip: RefObject<boolean>
};

export default function Tooltip({ text, context, setMobileTooltipData, clickedOnTooltip }: TooltipProps) {
    const { isMobile } = useIsMobile();

    const { getText } = useLanguage("tooltip");

    const getTranslatedText = (text: string) => {
        switch (text) {
            case "personal":
                return getText(0);
            case "professional":
                return getText(1);
            case "academic":
                return getText(2);
            default:
                return "";
        }
    }

    const getDataDetails = (value: string, key: string) => {
        if (value === "*") {
            return `${getText(9)} ${getText(4)}`
        }
        let valueNumber = parseInt(value);

        let endStr = getText(3);
        if (valueNumber > 1) {
            endStr = getText(4);
        }

        if (key == "professional") {
            endStr = getText(7);

            if (valueNumber >= 24) {
                endStr = getText(6);
                valueNumber /= 12;
            } else if (valueNumber >= 12) {
                endStr = getText(5);
                valueNumber /= 12;
            } else if (valueNumber > 1) {
                endStr = getText(8);
            }
        }
        return `${valueNumber} ${endStr}`;
    }

    const getData = () => {
        return (<>
            {text != "" && (
                <p>{text}</p>
            )}
            {context != null && Object.entries(context).map(([key, value], idx) =>
                value && (
                    <p key={getTranslatedText(key)}>
                        {getTranslatedText(key)}: {getDataDetails(value, key)}
                    </p>
                )
            )}
        </>);
    }

    const handleImgClick = () => {
        if (!isMobile) return;
        clickedOnTooltip.current = true;
        setMobileTooltipData(getData());
    }

    if (text == null && context == null) {
        return;
    }

    return (
        <div className="hint" data-position="4" onMouseDown={handleImgClick}>
            <img className="logo-icon invert" src="/icons/help.png" />
            {!isMobile && (
                <div className="hint-content do--split-children">
                    {getData()}
                </div>
            )}
        </div>
    );
}