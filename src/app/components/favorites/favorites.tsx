import { useEffect } from "react";

import TabInterface from "@/app/interfaces/tab.interface";
import Preferences from "@/app/interfaces/preferences.interface";

import "./favorites.scss";

type FavoritesProps = {
    preferences: Preferences;
    getDefaultTabs?: () => TabInterface[];
    onAction: (action: string, payload?: any) => void;
};

export default function Favorites({ preferences, getDefaultTabs, onAction }: FavoritesProps) {
    if (!getDefaultTabs) {
        return <></>;
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
                        {favorite.title}
                    </div>
                </div>
            ))}
        </div>
    );
}