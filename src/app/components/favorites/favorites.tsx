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
    const { getText } = useLanguage("page");

    const translateTitle = (value: string) => {
        if (value === "Projects") {
            return getText(0);
        }
        if (value === "Skills") {
            return getText(1);
        }
        return value;
    }

    if (!getDefaultTabs) {
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