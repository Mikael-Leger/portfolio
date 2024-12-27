import { useEffect } from "react";

import TabInterface from "@/app/interfaces/tab.interface";
import Preferences from "@/app/interfaces/preferences.interface";

type BarProps = {
    preferences: Preferences;
    activeTab: number;
    tabs: TabInterface[];
};

export default function Bar({ preferences, activeTab, tabs }: BarProps) {
    return (
        <div className="window-bar" style={{ "backgroundColor": preferences.color?.backgroundShadedColor }}>
            <div className="window-bar-actions">
                <img className="logo-icon-actions-back logo-icon" src="/icons/back.png" style={{ filter: (preferences.color?.textColor == 'white' ? 'invert(100%)' : '') + ' brightness(50%)' }} />
                <img className="logo-icon-actions-forward logo-icon" src="/icons/forward.png" style={{ filter: (preferences.color?.textColor == 'white' ? 'invert(100%)' : '') + ' brightness(50%)' }} />
                <img className="logo-icon-actions-refresh logo-icon" src="/icons/refresh.png" style={{ filter: preferences.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
            </div>
            <div className="window-bar-url" style={{ "backgroundColor": preferences.color?.backgroundColor }}>
                {tabs[activeTab].url}
            </div>
        </div>
    );
}