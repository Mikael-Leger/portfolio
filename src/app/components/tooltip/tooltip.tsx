import { RefObject, useEffect, useState } from "react";
import { Context } from "@/app/interfaces/skill.interface";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";

import "./tooltip.scss";

type TooltipProps = {
    text: string;
    context: Context;
};

export default function Tooltip({ text, context }: TooltipProps) {
    const { language, getTextsByComponent } = useLanguage();

    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("tooltip");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }

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

    if ((text == null && context == null) || texts.length === 0) {
        return;
    }

    return (
        <div className="hint" data-position="4">
            <img className="logo-icon invert" src="/icons/help.png" />
            <div className="hint-content do--split-children">
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
            </div>
        </div>
    );
}