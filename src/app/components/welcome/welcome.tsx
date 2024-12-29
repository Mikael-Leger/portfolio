import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Title from "../title/title";
import TabInterface from "@/app/interfaces/tab.interface";

import "./welcome.scss";

type WelcomeProps = {
    getDefaultTabs: () => TabInterface[];
    handleAction: (id: number, action: string, payload?: any) => void;
};

export default function Welcome({ getDefaultTabs, handleAction }: WelcomeProps) {
    const goToTab = (tabTitle: string) => {
        const defaultTabs = getDefaultTabs();
        const newTab = defaultTabs.find(tab => tab.title == tabTitle);

        handleAction(0, "addTab", newTab);
    }

    const sections = [
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
            onClick: () => handleAction(2, "showPDF")
        },
    ];

    return (
        <div className="welcome">
            <div className="welcome-header">
                <Title text="Full-Stack Developer" size="big" transform="upper" effect="shadow" />
                <Title text="Mikaël Léger" />
            </div>
            <div className="welcome-content">
                <div className="welcome-content-description">
                    <p className="welcome-content-description-paragraph">
                        I am French and I live in Belgium
                    </p>
                    <p className="welcome-content-description-paragraph">
                        I enjoy creativity and purple color very much
                    </p>
                    <p className="welcome-content-description-paragraph">
                        You can check anything more you want to know about me below
                    </p>
                </div>
                <div className="welcome-content-sections">
                    {sections.map(section => (
                        <div className="welcome-content-sections-section" onClick={section.onClick} key={section.name}>
                            {section.name}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}