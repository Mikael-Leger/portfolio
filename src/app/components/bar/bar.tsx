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
                <img className="logo-icon-actions-back logo-icon" src="/icons/back.png" />
                <img className="logo-icon-actions-forward logo-icon" src="/icons/forward.png" />
                <img className="logo-icon-actions-refresh logo-icon" src="/icons/refresh.png" />
            </div>
            <div className="window-bar-url" style={{ "backgroundColor": preferences.color?.backgroundColor }}>
                {tabs[activeTab].url}
            </div>
        </div>
    );
}