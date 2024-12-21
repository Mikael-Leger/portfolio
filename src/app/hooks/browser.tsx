import { useContext, useEffect, useRef, useState } from "react";
import Preferences from "../interfaces/preferences.interface";

export default function useBrowser(preferences?: Preferences) {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [browserIconPath, setBrowserIconPath] = useState<string>("");

    useEffect(() => {
        if (preferences != null && preferences.color != null) {
            const iconPath = getBrowserIconPath();
            setBrowserIconPath(iconPath);
        }
    }, [preferences]);

    const switchTab = (index: number) => {
        setActiveTab(index);
    }

    const getBrowserIconPath = () => {
        const userAgent = navigator.userAgent;

        const basePath = "/browsers";
        const extension = ".png";

        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return `${basePath}/chrome${extension}`;
        if (userAgent.includes("Firefox")) return `${basePath}/firefox${extension}`;
        if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return `${basePath}/safari${extension}`;
        if (userAgent.includes("Edg")) return `${basePath}/edge${extension}`;
        if (userAgent.includes("Opera") || userAgent.includes("OPR")) return `${basePath}/opera${extension}`;

        return "Unknown Browser";
    };

    return { activeTab, setActiveTab, browserIconPath, switchTab };
}