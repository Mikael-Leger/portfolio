import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Parallax from "../parallax/parallax";
import Title from "../title/title";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";

import "./portfolio.scss";

type PortfolioMainPageProps = {
    desktopOpenActions?: (action: string, payload?: any) => void;
};

export default function PortfolioMainPage({ desktopOpenActions }: PortfolioMainPageProps) {
    const { isMobile } = useIsMobile();
    const { language, getTextsByComponent } = useLanguage();

    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    const portfolioRef = useRef(null);
    const moon = useRef(null);

    const handleSectionClick = (e: React.MouseEvent<HTMLDivElement>, callback: () => void) => {
        callback();
    }

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("portfolio");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }


    const getMoonWidth = () => {
        const value = isMobile ? 300 : 500;
        return `${value}px`;
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (texts.length === 0) {
        return;
    }

    const mainSections = [
        {
            name: getText(0),
            description: getText(1),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 0 }) },
            logoPath: "/icons/projects.png"
        },
        {
            name: getText(2),
            description: getText(3),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 2 }) },
            logoPath: "/icons/pdf.png"
        },
        {
            name: getText(4),
            description: getText(5),
            onClick: () => { desktopOpenActions?.("openWindow", { id: 3 }) },
            logoPath: "/icons/mail.png"
        },
        {
            name: "LinkedIn",
            description: getText(6),
            onClick: () => { window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank') },
            logoPath: "/icons/linkedin.png"
        },
    ];

    return (
        <div className="portfolio" ref={portfolioRef}>
            <Parallax firstText={`Mikaël Léger`} secondText="Full - Stack Developer Junior" moon={moon} portfolioRef={portfolioRef} />
            <div className="portfolio-header">
                <Title text={getText(7)} size={isMobile ? "small" : "medium"} futurist />
            </div>
            <div className="portfolio-scroll">
                <div className="portfolio-scroll-down">
                    <img className="logo-icon invert" src="/icons/scroll.png" />
                    {getText(8)}
                    <img className="logo-icon invert" src="/icons/scroll.png" />
                </div>
                <div className="portfolio-scroll-up" onClick={scrollToTop}>
                    <img className="logo-icon invert" src="/icons/backtop.png" />
                    {getText(9)}
                </div>
            </div>
            <div id="rocket" className="rocket-ship">
                <img src="parallax/rocket.png" />
            </div>
            <div className="portfolio-content first-content">
                <div className="portfolio-content-text" style={{ marginTop: isMobile ? "-180px" : "0" }}>
                    <div className={`portfolio-content-text-1 ${isMobile ? "text-reversed" : ""}`}>
                        {getText(10)}<img className="logo-icon" src="/icons/baguette.png" />
                    </div>
                    <div className={`portfolio-content-text-2 ${isMobile ? "text-reversed" : ""}`}>
                        {getText(11)}<img className="logo-icon" src="/icons/fries.png" />
                    </div>
                </div>
                <div className="portfolio-content-me">
                    <img id="me" className='me' src="/parallax/me.png" />
                    <div className="portfolio-content-me-quote">
                        ({getText(12)})
                    </div>
                </div>
                <div className="portfolio-content-text">
                    <div className="portfolio-content-text-3">
                        {getText(13)}<img className="logo-icon" src="/icons/degree.png" />
                    </div>
                    <div className="portfolio-content-text-4">
                        {getText(14)}<img className="logo-icon" src="/icons/webdev.png" />
                    </div>
                    <div className="portfolio-content-text-5">
                        {getText(15)}<img className="logo-icon" src="/icons/creativity.png" />
                    </div>
                </div>
                <div className="portfolio-content-moon" style={{ width: getMoonWidth() }}>
                    <img ref={moon} className='planet moon' src="/parallax/planets/moon.webp" />
                </div>
            </div>
            <div className="portfolio-content second-content">
                <div className="portfolio-content-text">
                    <div className={`portfolio-content-text-6`}>
                        {getText(16)}
                    </div>
                    <div className={`portfolio-content-text-7`}>
                        {getText(17)}
                    </div>
                    <div className={`portfolio-content-text-8`}>
                        {getText(18)}
                    </div>
                    <div className={`portfolio-content-text-9`}>
                        {getText(19)}
                    </div>
                </div>
                <div className="portfolio-content-linear" >
                    <div className="portfolio-content-linear-text">
                        <Title text={getText(20)} futurist />
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