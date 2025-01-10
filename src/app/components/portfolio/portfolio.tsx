import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import TabInterface from "@/app/interfaces/tab.interface";
import Parallax from "../parallax/parallax";
import Title from "../title/title";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { PlanetBaseStyle, Planets } from "@/app/interfaces/planet.interface";

import "./portfolio.scss";

type PortfolioMainPageProps = {
    desktopOpenActions?: (action: string, payload?: any) => void;
};

export default function PortfolioMainPage({ desktopOpenActions }: PortfolioMainPageProps) {
    const { isMobile } = useIsMobile();

    const portfolioRef = useRef(null);
    const moon = useRef(null);

    const mainSections = [
        {
            name: "Projects",
            description: "Discover my work and expertise",
            onClick: () => { desktopOpenActions?.("openWindow", { id: 0 }) },
            logoPath: "/icons/projects.png"
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

    const handleSectionClick = (e: React.MouseEvent<HTMLDivElement>, callback: () => void) => {
        callback();
    }

    const getMoonWidth = () => {
        const value = isMobile ? 300 : 500;
        return `${value}px`;
    }

    return (
        <div className="portfolio" ref={portfolioRef}>
            <Parallax firstText="Mikaël Léger" secondText="Full-Stack Developer Junior" moon={moon} portfolioRef={portfolioRef} />
            <div className="portfolio-header">
                <Title text="Welcome to my portfolio!" size={isMobile ? "small" : "medium"} futurist />
            </div>
            <div id="rocket" className="rocket-ship">
                <img src="parallax/rocket.png" />
            </div>
            <div className="portfolio-content first-content">
                <div className="portfolio-content-text" style={{ marginTop: isMobile ? "-180px" : "0" }}>
                    <div className={`portfolio-content-text-1 ${isMobile ? "text-reversed" : ""}`}>
                        French developer<img className="logo-icon" src="/icons/baguette.png" />
                    </div>
                    <div className={`portfolio-content-text-2 ${isMobile ? "text-reversed" : ""}`}>
                        Based in Belgium<img className="logo-icon" src="/icons/fries.png" />
                    </div>
                </div>
                <div className="portfolio-content-me">
                    <img id="me" className='me' src="/parallax/me.png" />
                    <div className="portfolio-content-me-quote">
                        (Keep scrolling to help me climb!)
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
                <div className="portfolio-content-moon" style={{ width: getMoonWidth() }}>
                    <img ref={moon} className='planet moon' src="/parallax/planets/moon.webp" />
                </div>
            </div>
            <div className="portfolio-content second-content">
                <div className="portfolio-content-text">
                    <div className={`portfolio-content-text-6`}>
                        Always aim for the moon!
                    </div>
                    <div className={`portfolio-content-text-7`}>
                        Likes acquiring new knowledge
                    </div>
                    <div className={`portfolio-content-text-8`}>
                        Fast-learner
                    </div>
                    <div className={`portfolio-content-text-9`}>
                        Altruist
                    </div>
                </div>
                <div className="portfolio-content-linear" >
                    <div className="portfolio-content-linear-text">
                        <Title text="Explore and learn more about me below" futurist />
                    </div>
                </div>
            </div>
            <div className="portfolio-content links">
                <div className="portfolio-content-sections">
                    {mainSections.map(section => (
                        <div
                            className="portfolio-content-sections-section"
                            onClickCapture={(e) => handleSectionClick(e, section.onClick)}
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
            <div className="portfolio-footer">
                <div className="portfolio-footer-images">
                    <a href="https://www.flaticon.com/free-icons/linux" title="linux icons">Linux icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/minus-button" title="minus button icons">Minus button icons created by Circlon Tech - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/minimize" title="minimize icons">Minimize icons created by Ranah Pixel Studio - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/maximize" title="maximize icons">Maximize icons created by Ranah Pixel Studio - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by ariefstudio - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by Bingge Liu - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/google-chrome" title="google chrome icons">Google chrome icons created by Pixel perfect - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/mozilla" title="mozilla icons">Mozilla icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/brands-and-logotypes" title="brands and logotypes icons">Brands and logotypes icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/opera" title="opera icons">Opera icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/safari" title="safari icons">Safari icons created by Stockio - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/back-arrow" title="back arrow icons">Back arrow icons created by Ilham Fitrotul Hayat - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Roundicons - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Icon mania - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/refresh" title="refresh icons">Refresh icons created by Arkinasi - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/minimize" title="minimize icons">Minimize icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/external-link" title="external link icons">External link icons created by Bharat Icons - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/restart" title="restart icons">Restart icons created by Nuricon - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/star" title="star icons">Star icons created by Pixel perfect - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/pdf" title="pdf icons">Pdf icons created by Dimitry Miroliubov - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/earth" title="earth icons">Earth icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/creativity" title="creativity icons">Creativity icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/email" title="email icons">Email icons created by ChilliColor - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/tree" title="tree icons">Tree icons created by Freepik - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/project" title="project icons">Project icons created by afitrose - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/france" title="france icons">France icons created by Sudowoodo - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/belgium" title="belgium icons">Belgium icons created by Waveshade_Studios - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/degree" title="degree icons">Degree icons created by Smashicons - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/code" title="code icons">Code icons created by Royyan Wijaya - Flaticon</a>
                    <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">Linkedin icons created by riajulislam - Flaticon</a>
                    <a href="https://fr.freepik.com/search?format=search&last_filter=query&last_value=treenode&query=treenode" title="Freepik">Treenode image provided by www.freepik.com</a>
                </div>
                <div className="portfolio-footer-copyright">
                    © Copyright 2025 - Mikaël LÉGER. Tous droits réservés.
                </div>
            </div>
        </div>
    );
}