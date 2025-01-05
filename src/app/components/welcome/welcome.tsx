import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Title from "../title/title";
import TabInterface from "@/app/interfaces/tab.interface";
import Gallery from "../parallax/parallax";
import { useIsMobile } from "@/app/contexts/mobile-context";
import Parallax from "../parallax/parallax";

import "./welcome.scss";

type WelcomeProps = {
    getDefaultTabs: () => TabInterface[];
    handleAction: (id: number, action: string, payload?: any) => void;
    openWindow: (id: number) => void;
};

export default function Welcome({ getDefaultTabs, handleAction, openWindow }: WelcomeProps) {
    const { isMobile } = useIsMobile();

    const timeline = gsap.timeline();

    useEffect(() => {
        // timeline.to('.welcome-content-description', {
        //     scrollTrigger: {
        //         trigger: '.welcome-content-description',
        //         start: 'top 50%'
        //     }, // start the animation when ".box" enters the viewport (once)
        //     duration: 1,
        //     y: 500
        // });


        // timeline.pause();
        // timeline.to(".aaa", {
        //     duration: 1,
        //     y: 0,
        //     ease: "power4.inOut"
        // });

        // timeline.fromTo(".title, .welcome-content-description", {
        //     clipPath: "inset(100% 0 0 0)",
        //     y: 100,
        // }, {
        //     duration: .4,
        //     clipPath: "inset(0% 0 0 0)",
        //     y: 0,
        //     stagger: .2,
        //     ease: "power1.inOut"
        // })
        // let sectionsLeft: HTMLElement[] = [];
        // let sectionsRight: HTMLElement[] = [];

        // const leftOrders = isMobile ? [1, 3] : [1, 2];
        // const rightOrders = isMobile ? [2, 4] : [3, 4];

        // const items = document.querySelectorAll('.welcome-sections-section') as NodeListOf<HTMLElement>;
        // items.forEach((item: HTMLElement) => {
        //     const order = parseInt(window.getComputedStyle(item).order, 10);

        //     if (leftOrders.includes(order)) {
        //         sectionsLeft.push(item);
        //     } else if (rightOrders.includes(order)) {
        //         sectionsRight.push(item);
        //     }
        // });

        // const duration = timeline.totalDuration();

        // const sectionsLeftOrder = isMobile ? sectionsLeft : sectionsLeft.reverse();
        // gsap.fromTo(sectionsLeftOrder, {
        //     x: -400,
        //     opacity: 0
        // }, {
        //     delay: duration,
        //     duration: .7,
        //     x: 0,
        //     opacity: 1,
        //     stagger: .5,
        //     ease: "power1.inOut"
        // })

        // const sectionsRightOrder = sectionsRight;
        // gsap.fromTo(sectionsRightOrder, {
        //     x: 400,
        //     opacity: 0
        // }, {
        //     delay: duration,
        //     duration: .7,
        //     x: 0,
        //     opacity: 1,
        //     stagger: .5,
        //     ease: "power1.inOut"
        // })
    }, []);

    const goToTab = (tabTitle: string) => {
        const defaultTabs = getDefaultTabs();
        const newTab = defaultTabs.find(tab => tab.title == tabTitle);

        handleAction(0, "addTab", newTab);
    }

    const mainSections = [
        {
            name: "Portfolio",
            onClick: () => goToTab("Portfolio"),
            order: 1
        },
        {
            name: "Skills",
            onClick: () => goToTab("Skills"),
            order: isMobile ? 3 : 2
        },
        {
            name: "CV",
            onClick: () => { handleAction(2, "openWindow") },
            order: isMobile ? 2 : 3
        },
        {
            name: "Contact",
            onClick: () => { handleAction(3, "openWindow") },
            order: 4
        },
    ];

    return (
        <div className="welcome" style={{ gap: isMobile ? "50px" : "300px" }}>
            <div className="welcome-header">
                <Title text="I am" size="small" />
                <Title text="Mikaël Léger" size="big" transform="upper" effect="shadow" />
                <Title text="Full-Stack Developer Junior" size="small" />
            </div>
            <div className="welcome-content">
                <div className="welcome-content-section">
                    <Title text="Welcome to my portfolio!" size="medium" />
                </div>
                <div className="welcome-content-description">
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
            <div className="welcome-sections" style={{ scale: isMobile ? ".8" : "1" }}>
                {mainSections.map(section => (
                    <div
                        className="welcome-sections-section"
                        onClick={section.onClick}
                        style={{ order: section.order }}
                        key={section.name}>
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