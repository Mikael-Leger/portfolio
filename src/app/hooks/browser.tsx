import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Preferences from "../interfaces/preferences.interface";
import TabInterface from "../interfaces/tab.interface";

export default function useBrowser(animateCreateWindow: () => number, type: string, hide: boolean, windowIconPath: string, tabs?: TabInterface[], id?: number, preferences?: Preferences) {
    const [activeTab, setActiveTab] = useState<number>(-1);
    const [browserIconPath, setBrowserIconPath] = useState<string>("");

    const isBrowserOpen = useRef<boolean>(false);

    const getBrowserIconPath = () => {
        const userAgent = navigator.userAgent.toLowerCase();

        const basePath = "/browsers";
        const extension = ".png";

        if ((userAgent.includes("chrome") || userAgent.includes("crios")) && !userAgent.includes("edg")) return `${basePath}/chrome${extension}`;
        if (userAgent.includes("firefox")) return `${basePath}/firefox${extension}`;
        if (userAgent.includes("safari") && !userAgent.includes("chrome") && !userAgent.includes("crios")) return `${basePath}/safari${extension}`;
        if (userAgent.includes("edg")) return `${basePath}/edge${extension}`;
        if (userAgent.includes("opera") || userAgent.includes("opr")) return `${basePath}/opera${extension}`;

        return `${basePath}/chrome${extension}`;
    };

    useEffect(() => {
        const activeLocal = localStorage.getItem("active-tab");
        if (activeLocal) {
            setActiveTab(parseInt(activeLocal));
        } else {
            setActiveTab(0);
        }
    }, []);

    const animatePortfolioPage = (delay: number) => {
        gsap.from(".project", {
            duration: .2,
            opacity: 0,
            y: 100,
            stagger: .1,
            ease: "sine.in"
        });
    }

    useEffect(() => {
        if (browserIconPath == "" || activeTab == -1 || windowIconPath == "") {
            return;
        }

        const windowBrowser = document.getElementsByClassName("window-browser");

        let openDuration = 0;
        if (type === 'browser' && !isBrowserOpen.current && windowBrowser[0]) {
            openDuration = animateCreateWindow();
            setTimeout(() => {
                isBrowserOpen.current = true;
            }, openDuration * 1000);
        }

        if (!tabs) {
            return;
        }

        if (isCurrentTabPortfolio()) {
            animatePortfolioPage(openDuration);
        }

    }, [browserIconPath, activeTab, windowIconPath]);

    const isCurrentTabPortfolio = () => {
        if (!tabs) return false;

        const tabFound = tabs.findIndex(tab => tab.title === "Projects");
        return tabFound == activeTab;
    }

    useEffect(() => {
        if (preferences == null || preferences.color == null || id == null || hide) {
            return;
        }
        const iconPath = getBrowserIconPath();
        setBrowserIconPath(iconPath);
    }, [preferences, id, hide]);

    const isBrowser = (type === 'browser');
    if (!isBrowser) {
        return { isNotBrowser: true };
    }

    const switchTab = (index: number) => {
        setActiveTab(index);
        localStorage.setItem("active-tab", index.toString());
    }

    return { activeTab, setActiveTab, browserIconPath, switchTab, isCurrentTabPortfolio };
}