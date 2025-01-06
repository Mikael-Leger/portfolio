import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import TabInterface from "@/app/interfaces/tab.interface";
import Parallax from "../parallax/parallax";
import Title from "../title/title";

import "./portfolio.scss";

type PortfolioMainPageProps = {
    desktopOpenActions?: (action: string, payload?: any) => void;
};

export default function PortfolioMainPage({ desktopOpenActions }: PortfolioMainPageProps) {
    const mainSections = [
        {
            name: "Portfolio",
            description: "Discover my work and expertise",
            onClick: () => { desktopOpenActions?.("openWindow", { id: 0 }) },
            logoPath: "/icons/portfolio.png"
        },
        {
            name: "CV",
            description: "Prefer a classic PDF format?",
            onClick: () => { desktopOpenActions?.("openWindow", { id: 2 }) },
            logoPath: "/icons/pdf.png"
        },
        {
            name: "Contact",
            description: "Reach me by sending a space-mail",
            onClick: () => { desktopOpenActions?.("openWindow", { id: 3 }) },
            logoPath: "/icons/mail.png"
        },
        {
            name: "LinkedIn",
            description: "Message me on this popular social media",
            onClick: () => { window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank') },
            logoPath: "/icons/linkedin.png"
        },
    ];

    return (
        <div className="portfolio">
            <Parallax firstText="Mikaël Léger" secondText="Full-Stack Developer Junior" />
            <div className="portfolio-header">
                <Title text="Welcome to my portfolio!" size="medium" />
            </div>
            <div id="rocket" className="rocket-ship">
                <img src="parallax/rocket.png" />
            </div>
            <div className="portfolio-content">
                <div className="portfolio-content-text">
                    <div className="portfolio-content-text-1">
                        French developer<img className="logo-icon" src="/icons/baguette.png" />
                    </div>
                    <div className="portfolio-content-text-2">
                        Based in Belgium<img className="logo-icon" src="/icons/fries.png" />
                    </div>
                </div>
                <div className="portfolio-content-me">
                    <img id="me" className='me' src="/parallax/me.png" />
                    <div className="portfolio-content-me-quote">
                        (Just me climbing while you scroll)
                    </div>
                </div>
                <div className="portfolio-content-text">
                    <div className="portfolio-content-text-3">
                        Master degree in Sofwtare Engineering<img className="logo-icon" src="/icons/degree.png" />
                    </div>
                    <div className="portfolio-content-text-4">
                        Passionate about web development<img className="logo-icon" src="/icons/webdev.png" />
                    </div>
                    <div className="portfolio-content-text-5">
                        Loves creativity<img className="logo-icon" src="/icons/creativity.png" />
                    </div>
                </div>
                <div className="portfolio-content-moon">
                    <img id="moon" className='moon' src="/parallax/planets/moon.png" />
                </div>
            </div>
            <div className="portfolio-content">
                <div className="portfolio-content-text">
                    <div className="portfolio-content-text-6">
                        Always aim for the moon!
                    </div>
                    <div className="portfolio-content-text-7">
                        Likes acquiring new knowledge
                    </div>
                    <div className="portfolio-content-text-8">
                        Fast-learner
                    </div>
                    <div className="portfolio-content-text-9">
                        Altruist
                    </div>
                </div>
                <div className="portfolio-content-linear" >
                    <div className="portfolio-content-text">
                        Explore and learn more about me below
                    </div>
                </div>
            </div>
            <div className="portfolio-content links">
                <div className="portfolio-content-sections">
                    {mainSections.map(section => (
                        <div
                            className="portfolio-content-sections-section"
                            onClick={section.onClick}
                            key={section.name}>
                            <div className="portfolio-content-sections-section-border">
                                <div className="portfolio-content-sections-section-border-container">
                                    <div className="portfolio-content-sections-section-border-container-icon">
                                        <img className="logo-icon" src={section.logoPath} />
                                    </div>
                                    <div className="portfolio-content-sections-section-border-container-content">
                                        <div className="portfolio-content-sections-section-border-container-content-title">
                                            {section.name}
                                        </div>
                                        <div className="portfolio-content-sections-section-border-container-content-description">
                                            {section.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}