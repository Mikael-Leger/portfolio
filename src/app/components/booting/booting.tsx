import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import Preferences from "@/app/interfaces/preferences.interface";
import PreferencesContext from "@/app/contexts/preferences-context";
import { getFormattedDate } from "@/app/services/date.service";

import "./booting.scss";

type BootingProps = {
    onFinish: () => void;
};

gsap.registerPlugin(TextPlugin);

const BASE_TIME_BOOTING_FACTOR = process.env.DEV_ANIMATION_SPEED === "fast" ? 0 : 1000;

export default function Booting({ onFinish }: BootingProps) {
    const preferences = useContext(PreferencesContext) as Preferences;

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!timelineRef.current) {
            const timeline = gsap.timeline();
            const initDuration = 1;
            gsap.to(".booting-initialize", {
                duration: initDuration,
                text: "Initializing . . .",
                ease: "power2.inOut"
            });
            timeline.to(".booting-progress-bar", {
                duration: initDuration + 1,
                width: "100%",
                ease: "power2.inOut"
            });
            timeline.to([".booting-progress", ".booting-initialize"], {
                duration: .6,
                opacity: 0,
                ease: "sine.in"
            });
            timelineRef.current = timeline;

            return () => {
                timelineRef.current?.kill();
                timelineRef.current = null;
            };
        }
    }, []);

    useEffect(() => {
        if (preferences) {
            setIsInitialized(true);
        }
    }, [preferences]);

    useEffect(() => {
        if (!isInitialized || !timelineRef.current || timelineRef.current.totalDuration() == 0) {
            return;
        }

        const timeline = timelineRef.current;
        timeline.to([".booting-progress", ".booting-initialize"], {
            display: "none",
            ease: "sine.in"
        });
        timeline.to(".booting-text", {
            display: "block",
            ease: "sine.in"
        });
        const durationOfTexts = .3;
        timeline.to(".booting-text-time-result", {
            duration: durationOfTexts,
            text: getTime(),
            ease: "sine.in"
        });
        timeline.to(".booting-text-os-result", {
            duration: durationOfTexts,
            text: getOsName(),
            ease: "sine.in"
        });
        timeline.to(".booting-text-theme-result", {
            duration: durationOfTexts,
            text: getThemeName(),
            ease: "sine.in"
        });
        timeline.to(".booting-text-color-result", {
            duration: durationOfTexts,
            text: getColorName(),
            ease: "sine.in"
        });
        timeline.to(".booting-starting", {
            duration: 1,
            text: "Starting . . .",
            ease: "sine.in"
        });
        timeline.to(".booting", {
            delay: .5,
            display: "none",
            ease: "sine.in"
        });

        setTimeout(onFinish, timeline.totalDuration() * BASE_TIME_BOOTING_FACTOR);
    }, [isInitialized, timelineRef.current]);

    const getTime = () => {
        return getFormattedDate();
    }

    const getOsName = () => {
        const userAgent = navigator.userAgent;

        let osName = 'Unknown';

        if (userAgent.indexOf('Win') !== -1) osName = 'Windows';
        else if (userAgent.indexOf('Mac') !== -1) osName = 'macOS';
        else if (userAgent.indexOf('X11') !== -1) osName = 'UNIX';
        else if (userAgent.indexOf('Linux') !== -1) osName = 'Linux';

        else if (/android/i.test(userAgent)) osName = 'Android';
        else if (/iPhone|iPad|iPod/i.test(userAgent)) osName = 'iOS';

        return osName;
    }

    const getThemeName = () => {
        return preferences.theme;
    }


    const getColorName = () => {
        return preferences.color ? preferences.color.backgroundColor : 'None';
    }

    return (
        <div className="booting">
            <div className="booting-initialize" />
            <div className="booting-progress">
                <div className="booting-progress-bar"></div>
            </div>
            <div className="booting-text" >
                <div className="booting-text-time" >
                    {`Current Time: `}
                    <div className="booting-text-time-result" />
                </div>
                <div className="booting-text-os" >
                    {`Operating System: `}
                    <div className="booting-text-os-result" />
                </div>
                <div className="booting-text-theme" >
                    {`Preferred Theme: `}
                    <div className="booting-text-theme-result" />
                </div>
                <div className="booting-text-color" >
                    {`Preferred Color: `}
                    <div className="booting-text-color-result" />
                </div>
            </div>
            <div className="booting-starting">
            </div>
        </div>
    );
}