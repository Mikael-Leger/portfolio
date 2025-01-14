import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { LanguageType, useLanguage } from "@/app/contexts/language-context";
import gsap from "gsap";

import "./language.scss";

type LanguageProps = {
};

export default function Language({ }: LanguageProps) {
    const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

    const { language, setLanguage } = useLanguage();

    const languageRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (optionsVisible) {
            const timeline = gsap.timeline();
            timeline.to(".language-options", {
                duration: .5,
                opacity: 1,
                clipPath: "inset(0 0 0 0%)"
            });
        }
    }, [optionsVisible]);

    const handleClickOutside = (event: MouseEvent) => {
        if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
            const timeline = gsap.timeline();
            if (optionsRef.current == null) {
                return;
            }
            timeline.to(optionsRef.current, {
                duration: .5,
                opacity: 0,
                clipPath: "inset(0 0 0 100%)"
            });
            const duration = timeline.totalDuration();
            setTimeout(() => setOptionsVisible(false), duration * 1000);
        }
    };

    const handleFlagClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        setOptionsVisible(true);
    }

    const handleOptionClick = (e: React.MouseEvent<HTMLDivElement>, value: string) => {
        e.stopPropagation();

        setLanguage(value as LanguageType);
    }

    const options = [
        {
            name: "Français",
            value: "baguette"
        },
        {
            name: "English",
            value: "en"
        }
    ];

    return (
        <div className="language" ref={languageRef}>
            {optionsVisible && (
                <div className="language-options" ref={optionsRef}>
                    {options.map(option => (
                        <div
                            className={`language-options-option ${language === option.value ? "active" : ""}`}
                            onClick={(e) => handleOptionClick(e, option.value)}
                            title={option.name}
                            key={option.name}>
                            <img src={`/icons/${option.value}.png`} alt={option.name} />
                        </div>
                    ))}
                </div>
            )}
            <div className="language-flag" onClick={handleFlagClick}>
                <img src={`/icons/${language}.png`} alt={language} />
            </div>
        </div>
    );
}