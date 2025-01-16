import { useEffect, useRef } from "react";
import gsap from "gsap";

import Parallax from "../parallax/parallax";
import Title from "../title/title";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";

import "./portfolio.scss";

type PortfolioMainPageProps = {
    desktopOpenActions?: (action: string, payload?: any) => void;
};

export default function PortfolioMainPage({ desktopOpenActions }: PortfolioMainPageProps) {
    const { isMobile } = useIsMobile();
    const { getTextByComponent } = useLanguage();

    const portfolioRef = useRef(null);
    const moon = useRef(null);
    const textIndex = useRef(0);

    const handleSectionClick = (e: React.MouseEvent<HTMLDivElement>, callback: () => void) => {
        callback();
    }

    const getMoonWidth = () => {
        const value = isMobile ? 300 : 500;
        return `${value}px`;
    }

    const getText = () => {
        const text = getTextByComponent("portfolio", textIndex.current);
        textIndex.current++;

        return text;
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    textIndex.current = 0;

    const mainSections = [
        {
            name: getText(),
            description: getText(),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 0 }) },
            logoPath: "/icons/projects.png"
        },
        {
            name: getText(),
            description: getText(),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 2 }) },
            logoPath: "/icons/pdf.png"
        },
        {
            name: "Contact",
            description: getText(),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 3 }) },
            logoPath: "/icons/mail.png"
        },
        {
            name: "LinkedIn",
            description: getText(),
            onClick: () => { window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank') },
            logoPath: "/icons/linkedin.png"
        },
    ];

    return (
        <div className="portfolio" ref={portfolioRef}>
            <Parallax firstText={`Mikaël Léger - ${getText()}`} secondText="Full - Stack Developer Junior" moon={moon} portfolioRef={portfolioRef} />
            <div className="portfolio-header">
                <Title text={getText()} size={isMobile ? "small" : "medium"} futurist />
            </div>
            <div className="portfolio-scroll">
                <div className="portfolio-scroll-down">
                    <img className="logo-icon invert" src="/icons/scroll.png" />
                    {getText()}
                    <img className="logo-icon invert" src="/icons/scroll.png" />
                </div>
                <div className="portfolio-scroll-up" onClick={scrollToTop}>
                    <img className="logo-icon invert" src="/icons/backtop.png" />
                    {getText()}
                </div>
            </div>
            <div id="rocket" className="rocket-ship">
                <img src="parallax/rocket.png" />
            </div>
            <div className="portfolio-content first-content">
                <div className="portfolio-content-text" style={{ marginTop: isMobile ? "-180px" : "0" }}>
                    <div className={`portfolio-content-text-1 ${isMobile ? "text-reversed" : ""}`}>
                        {getText()}<img className="logo-icon" src="/icons/baguette.png" />
                    </div>
                    <div className={`portfolio-content-text-2 ${isMobile ? "text-reversed" : ""}`}>
                        {getText()}<img className="logo-icon" src="/icons/fries.png" />
                    </div>
                </div>
                <div className="portfolio-content-me">
                    <img id="me" className='me' src="/parallax/me.png" />
                    <div className="portfolio-content-me-quote">
                        ({getText()})
                    </div>
                </div>
                <div className="portfolio-content-text">
                    <div className="portfolio-content-text-3">
                        {getText()}<img className="logo-icon" src="/icons/degree.png" />
                    </div>
                    <div className="portfolio-content-text-4">
                        {getText()}<img className="logo-icon" src="/icons/webdev.png" />
                    </div>
                    <div className="portfolio-content-text-5">
                        {getText()}<img className="logo-icon" src="/icons/creativity.png" />
                    </div>
                </div>
                <div className="portfolio-content-moon" style={{ width: getMoonWidth() }}>
                    <img ref={moon} className='planet moon' src="/parallax/planets/moon.webp" />
                </div>
            </div>
            <div className="portfolio-content second-content">
                <div className="portfolio-content-text">
                    <div className={`portfolio-content-text-6`}>
                        {getText()}
                    </div>
                    <div className={`portfolio-content-text-7`}>
                        {getText()}
                    </div>
                    <div className={`portfolio-content-text-8`}>
                        {getText()}
                    </div>
                    <div className={`portfolio-content-text-9`}>
                        {getText()}
                    </div>
                </div>
                <div className="portfolio-content-linear" >
                    <div className="portfolio-content-linear-text">
                        <Title text={getText()} futurist />
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
                                    <div className="portfolio-content-sections-section-border-container-title">
                                        {section.name}
                                        <img className="logo-icon" src={section.logoPath} />
                                    </div>
                                    <div className="portfolio-content-sections-section-border-container-description">
                                        {section.description}
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