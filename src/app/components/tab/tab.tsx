import Preferences from "@/app/interfaces/preferences.interface";
import styled from "styled-components";

import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";
import { useEffect, useState } from "react";
import { TextByLanguage } from "@/app/types/language";

interface Tabprops {
    preferences: Preferences;
    logoPath: string;
    title: string;
    active: boolean;
    index: number;
    isMaximized: boolean;
    isIncreasing: boolean;
    onClick: (index: number) => void;
    onAction: (action: string, payload?: any) => void;
}

interface TabDivProps extends React.HTMLProps<HTMLDivElement> {
    $active: boolean;
    $preferences: Preferences;
};

const TabDiv = styled.div<TabDivProps>`
    background-color: ${props => props.$active ? props.$preferences.color?.backgroundShadedColor : props.$preferences.color?.backgroundColor};
    transition: background-color 0.3s ease;
`;

export default function Tab({ preferences, logoPath, title, active, index, isMaximized, isIncreasing, onClick, onAction }: Tabprops) {
    const { isMobile } = useIsMobile();
    const { language, getTextsByComponent } = useLanguage();

    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("page");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }

    const removeTabWithoutPropagation = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
        event.stopPropagation();
        onAction("removeTab", index);
    }

    const translateTitle = (value: string) => {
        if (value === "Projects") {
            return getText(0);
        }
        if (value === "Skills") {
            return getText(1);
        }
        return value;
    }

    if (texts.length === 0) {
        return;
    }

    return (
        <TabDiv
            $active={active}
            $preferences={preferences}
            className={`window-header-head-left-tabs-tab ${active ? 'active' : ''}`}
            onClick={() => onClick(index)}
            style={{ width: (!isMobile && isMaximized && !isIncreasing ? "230px" : "100px") }}>
            <div className="window-header-head-left-tabs-tab-header">
                <img className="window-header-head-left-tabs-tab-header-logo logo-icon" src={logoPath} />
                <div className="window-header-head-left-tabs-tab-header-text">
                    {translateTitle(title)}
                </div>
            </div>
            {index != 0 && !isMobile && (
                <img
                    className="window-header-head-left-tabs-tab-close logo-icon"
                    src="/icons/close_small.png"
                    style={{ filter: preferences?.color?.textColor == 'white' ? 'invert(100%)' : '' }}
                    onClick={(e) => removeTabWithoutPropagation(e, index)} />
            )}
            {active && !isMobile && (
                <div
                    className="window-header-head-left-tabs-tab-neck"
                    style={{
                        "backgroundColor": preferences?.color?.backgroundShadedColor,
                        width: (isMaximized && !isIncreasing ? "230px" : "100px")
                    }} />
            )}
        </TabDiv>
    );
}