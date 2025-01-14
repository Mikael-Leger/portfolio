import { useEffect, useState } from "react";

import TabInterface from "@/app/interfaces/tab.interface";
import Preferences from "@/app/interfaces/preferences.interface";
import { TextByLanguage } from "@/app/types/language";
import { useLanguage } from "@/app/contexts/language-context";

import "./favorites.scss";

type FavoritesProps = {
    preferences: Preferences;
    getDefaultTabs?: () => TabInterface[];
    onAction: (action: string, payload?: any) => void;
};

export default function Favorites({ preferences, getDefaultTabs, onAction }: FavoritesProps) {
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

    const translateTitle = (value: string) => {
        if (value === "Projects") {
            return getText(0);
        }
        if (value === "Skills") {
            return getText(1);
        }
        return value;
    }

    if (!getDefaultTabs || texts.length === 0) {
        return;
    }

    return (
        <div className="favorites" style={{ "backgroundColor": preferences.color?.backgroundColor }}>
            <div className="favorites-icon">
                <img className="logo-icon" src="/icons/star.png" />
            </div>
            {getDefaultTabs()?.map(favorite => (
                <div
                    className="favorites-item"
                    style={{ "backgroundColor": preferences.color?.backgroundColor }}
                    onClick={() => onAction("addTab", favorite)}
                    key={favorite.url}>
                    <div className="favorites-item-icon">
                        <img className="logo-icon" src={favorite.logoPath} />
                    </div>
                    <div className="favorites-item-title">
                        {translateTitle(favorite.title)}
                    </div>
                </div>
            ))}
        </div>
    );
}