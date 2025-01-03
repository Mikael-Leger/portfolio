import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Title from "../title/title";
import TabInterface from "@/app/interfaces/tab.interface";

import "./welcome.scss";

type WelcomeProps = {
    getDefaultTabs: () => TabInterface[];
    handleAction: (id: number, action: string, payload?: any) => void;
    openWindow: (id: number) => void;
};

export default function Welcome({ getDefaultTabs, handleAction, openWindow }: WelcomeProps) {
    useEffect(() => {
        const timeline = gsap.timeline();
        timeline.fromTo(".title, .welcome-content-description", {
            clipPath: "inset(100% 0 0 0)",
            y: 100,
        }, {
            duration: .4,
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            stagger: .2,
            ease: "power1.inOut"
        })
        timeline.fromTo(".welcome-sections-section", {
            clipPath: "inset(100% 0 0 0)",
            y: 100,
        }, {
            duration: .4,
            clipPath: "inset(-5% -10px -10px)",
            y: 0,
            stagger: .1,
            ease: "power1.inOut"
        })
    }, []);

    const goToTab = (tabTitle: string) => {
        const defaultTabs = getDefaultTabs();
        const newTab = defaultTabs.find(tab => tab.title == tabTitle);

        handleAction(0, "addTab", newTab);
    }

    const mainSections = [
        {
            name: "Portfolio",
            onClick: () => goToTab("Portfolio")
        },
        {
            name: "Skills",
            onClick: () => goToTab("Skills")
        },
        {
            name: "CV",
            onClick: () => { handleAction(2, "openWindow") }
        },
    ];

    return (
        <div className="welcome">
            <div className="welcome-header">
                <Title text="Mikaël Léger" size="big" transform="upper" effect="shadow" />
            </div>
            <div className="welcome-content">
                <Title text="Full-Stack Developer Junior" />
                <div className="welcome-content-description">
                    <div className="welcome-content-description-paragraph">
                        Welcome to my portfolio!
                    </div>
                    <div className="welcome-content-description-paragraph">
                        French developer based in Belgium <img className="logo-icon" src="/icons/earth.png" />
                    </div>
                    <div className="welcome-content-description-paragraph">
                        Passionate about web development and creativity <img className="logo-icon" src="/icons/creativity.png" />
                    </div>
                    <div className="welcome-content-description-paragraph">
                        You can find me on <span className="welcome-content-description-paragraph-link blue-link"
                            onClick={() => window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank')}>
                            LinkedIn
                        </span> or message me directly <span className="welcome-content-description-paragraph-link"
                            onClick={() => handleAction(3, "openWindow")}>
                            here!
                        </span>
                    </div>
                    <div className="welcome-content-description-paragraph">
                        Feel free to explore and learn more about me below
                    </div>
                </div>
            </div>
            <div className="welcome-sections">
                {mainSections.map(section => (
                    <div className="welcome-sections-section" onClick={section.onClick} key={section.name}>
                        <div className="welcome-sections-section-container">
                            <div className="welcome-sections-section-container-icon">
                                <img className="logo-icon" src="/icons/arrow_right.png" />
                            </div>
                            <div className="welcome-sections-section-container-name">
                                {section.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}