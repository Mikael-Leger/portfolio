import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Preferences from "../interfaces/preferences.interface";
import TabInterface from "../interfaces/tab.interface";

export default function useBrowser(type: string, hide: boolean, windowIconPath: string, tabs?: TabInterface[], id?: number, preferences?: Preferences) {
    const [activeTab, setActiveTab] = useState<number>(-1);
    const [browserIconPath, setBrowserIconPath] = useState<string>("");

    const isBrowserOpen = useRef<boolean>(false);

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

    useEffect(() => {
        const activeLocal = localStorage.getItem("active-tab");
        if (activeLocal) {
            setActiveTab(parseInt(activeLocal));
        } else {
            setActiveTab(0);
        }
    }, []);

    const animateOpenBrowser = () => {
        const timeline = gsap.timeline();
        timeline.fromTo(document.querySelector(`.window-browser-${id}`), {
            opacity: 0,
            scale: 0.2,
            y: '40vh',
            x: '40vw',
        }, {
            duration: .7,
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            ease: "sine.in"
        });

        return timeline.totalDuration();
    }

    const animatePortfolioPage = (delay: number) => {
        const timeline = gsap.timeline();
        timeline.from(".portfolio-name", {
            delay,
            duration: 1.2,
            opacity: 0,
            x: -600,
            ease: "sine.in"
        });

        const currentDuration = timeline.totalDuration();
        gsap.from(".portfolio-container-group-title", {
            delay: currentDuration - .5,
            duration: 1.2,
            opacity: 0,
            x: 600,
            stagger: 1.9,
        });

        timeline.from(".project", {
            duration: .7,
            opacity: 0,
            y: 100,
            stagger: .5,
            ease: "sine.in"
        });
    }

    useEffect(() => {
        if (browserIconPath == "" || activeTab == -1 || windowIconPath == "") {
            return;
        }

        const windowBrowser = document.getElementsByClassName("window-browser");

        let openDuration = 0;
        if (!isBrowserOpen.current && windowBrowser[0]) {
            openDuration = animateOpenBrowser();
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

        const tabFound = tabs.findIndex(tab => tab.title === "Portfolio");
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

    return { activeTab, setActiveTab, browserIconPath, switchTab, animateOpenBrowser, isCurrentTabPortfolio };
}