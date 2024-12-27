import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Preferences from "../interfaces/preferences.interface";

export default function useBrowser(type: string, id?: number, preferences?: Preferences) {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [browserIconPath, setBrowserIconPath] = useState<string>("");

    const isAnimating = useRef<boolean>(false);

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
        if (preferences != null && preferences.color != null && id != null) {
            const iconPath = getBrowserIconPath();
            setBrowserIconPath(iconPath);
        }
    }, [preferences, id]);

    const isBrowser = (type === 'browser');
    if (!isBrowser) {
        return { isNotBrowser: true };
    }

    const animateOpenBrowser = () => {
        if (isAnimating.current) {
            return;
        }
        isAnimating.current = true;

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
        timeline.from(".portfolio-name", {
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

    const switchTab = (index: number) => {
        setActiveTab(index);
    }

    return { activeTab, setActiveTab, browserIconPath, switchTab, animateOpenBrowser };
}