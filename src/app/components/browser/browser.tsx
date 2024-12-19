import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";


import "./browser.scss";
import PreferencesContext, { Preferences } from "@/app/contexts/preferences-context";
import Tab from "./tab";
import styled from "styled-components";

type BrowserProps = {
    content: React.ReactNode;
};

interface WindowDetails {
    width: string;
    height: string;
    offsetX: number;
    offsetY: number;
    cursorStartX: number;
    cursorStartY: number;
    initialOffsetX: number;
    initialOffsetY: number;
}

interface BrowserDivProps extends React.HTMLProps<HTMLDivElement> {
    $preferences: Preferences;
    $isMaximized: boolean;
    $windowDetails: WindowDetails;
};

const BrowserDiv = styled.div<BrowserDivProps>`
    border-color: ${props => props.$preferences.color?.backgroundColor};
`;

interface ActionDivProps extends React.HTMLProps<HTMLDivElement> {

}

export default function Browser({ content }: BrowserProps) {
    const preferences = useContext(PreferencesContext);
    const [browserIconPath, setBrowserIconPath] = useState<string>("");
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isMaximized, setIsMaximized] = useState<boolean>(true);
    const [isReduced, setIsReduced] = useState<boolean>(false);
    const [isReducing, setIsReducing] = useState<boolean>(false);
    const [isIncreasing, setIsIncreasing] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [windowDetails, setWindowDetails] = useState<WindowDetails>({
        width: '60vw',
        height: '60vh',
        offsetX: 250,
        offsetY: 250,
        cursorStartX: 0,
        cursorStartY: 0,
        initialOffsetX: 0,
        initialOffsetY: 0
    });
    const browserRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (browserRef && browserRef.current) {
            if (!isMaximized) {
                browserRef.current.style.left = `${windowDetails.offsetX}px`;
                browserRef.current.style.top = `${windowDetails.offsetY}px`;
            }
        }
    }, [windowDetails]);

    useEffect(() => {
        if (browserRef && browserRef.current) {
            if (isMaximized) {
                gsap.to(document.querySelector(".browser"), {
                    duration: .2,
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    ease: "sine.in"
                });
            } else {
                gsap.to(document.querySelector(".browser"), {
                    duration: .2,
                    left: `${windowDetails.offsetX}px`,
                    top: `${windowDetails.offsetY}px`,
                    width: windowDetails.width,
                    height: windowDetails.height,
                    ease: "sine.in"
                });
            }
        }
    }, [isMaximized]);

    useEffect(() => {
        if (isReducing) {
            const timeline = gsap.timeline();
            timeline.to(document.querySelector(".browser"), {
                duration: .7,
                scale: 0.1,
                left: '-28vw',
                top: '40vh',
                width: isMaximized ? '' : '100vw',
                height: isMaximized ? '' : '100vh',
                ease: "sine.in"
            });
            timeline.to(document.querySelector(".browser-reduced-logo"), {
                duration: .2,
                opacity: .8,
                ease: "sine.in"
            });

            const totalDuration = timeline.totalDuration();
            setTimeout(() => {
                setIsReducing(false);
                setIsReduced(true);
            }, totalDuration * 1000);
        }
    }, [isReducing]);

    useEffect(() => {
        if (isIncreasing) {
            const newLeft = (isMaximized) ? 0 : windowDetails.offsetX;
            const newTop = (isMaximized) ? 0 : windowDetails.offsetY;

            const timeline = gsap.timeline();
            timeline.to(document.querySelector(".browser-reduced-logo"), {
                duration: .2,
                opacity: 0,
                ease: "sine.in"
            });
            timeline.fromTo(document.querySelector(".browser"), {
                left: "-28vw",
                top: "40vh",
            }, {
                duration: .7,
                scale: 1,
                left: newLeft,
                top: newTop,
                width: isMaximized ? '' : '60vw',
                height: isMaximized ? '' : '60vh',
                ease: "sine.in"
            });

            const totalDuration = timeline.totalDuration();
            setTimeout(() => {
                setIsIncreasing(false);
            }, totalDuration * 1000);
        }
    }, [isIncreasing]);

    useEffect(() => {
        if (preferences != null && preferences.color != null) {
            const iconPath = getBrowserIconPath();
            setBrowserIconPath(iconPath)
        }
    }, [preferences]);

    useEffect(() => {
        if (browserIconPath != null && process.env.NODE_ENV == 'production') {
            gsap.from(document.querySelector(".browser"), {
                duration: .7,
                opacity: 1,
                scale: 0.2,
                ease: "sine.in"
            });
        }
    }, [browserIconPath]);

    const increaseWindow = () => {
        if (isReduced) {
            setIsReduced(false);
            setIsIncreasing(true);
        }
    }

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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized) return;

        setIsDragging(true);
        const browserRect = browserRef.current?.getBoundingClientRect();
        if (browserRect) {
            setWindowDetails(prevWindowDetails => {
                const updatedWindow = {
                    ...prevWindowDetails,
                    cursorStartX: e.clientX,
                    cursorStartY: e.clientY
                };
                return updatedWindow;
            });
        }
        e.stopPropagation();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && browserRef.current) {
            setWindowDetails(prevWindowDetails => {
                const updatedWindow = {
                    ...prevWindowDetails,
                    offsetX: e.clientX - prevWindowDetails.cursorStartX + prevWindowDetails.initialOffsetX,
                    offsetY: e.clientY - prevWindowDetails.cursorStartY + prevWindowDetails.initialOffsetY
                };
                return updatedWindow;
            });
        }
    };

    const handleMouseUp = () => {
        setWindowDetails(prevWindowDetails => {
            const updatedWindow = {
                ...prevWindowDetails,
                initialOffsetX: prevWindowDetails.offsetX,
                initialOffsetY: prevWindowDetails.offsetY
            };
            return updatedWindow;
        });
        setIsDragging(false);
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    if (browserIconPath == "" || preferences == null || preferences.color == null) {
        return <div>Loading...</div>
    }

    const tabsValue = [
        {
            logoPath: "/vercel.svg",
            title: "Portfolio - Mikaël Léger",
            url: `${window.location.href}home`
        },
        {
            logoPath: "/vercel.svg",
            title: "CV",
            url: `${window.location.href}curriculum-vitae`
        }
    ];

    const actionsList = [
        {
            name: "reduce",
            onClick: () => setIsReducing(true)
        },
        {
            name: "minimize",
            onClick: () => setIsMaximized(false),
            hide: !isMaximized
        },
        {
            name: "maximize",
            onClick: () => setIsMaximized(true),
            hide: isMaximized
        },
        {
            name: "close",
            onClick: () => { }
        }
    ];

    const switchTab = (index: number) => {
        setActiveTab(index);
    }

    return (
        <BrowserDiv
            className="browser"
            $preferences={preferences}
            $isMaximized={isMaximized}
            $windowDetails={windowDetails}
            onClick={increaseWindow}
            ref={browserRef}>
            <div className="browser-window" onMouseDown={handleMouseDown} style={{ "backgroundColor": preferences.color?.backgroundColor, "color": preferences.color?.textColor }}>
                <div className="browser-window-header">
                    <img className="browser-window-header-logo logo-icon" src={browserIconPath} />
                    <div className="browser-window-header-tabs">
                        {tabsValue.map((tabValue, idx) => (
                            <Tab
                                preferences={preferences}
                                logoPath={tabValue.logoPath}
                                title={tabValue.title}
                                active={activeTab == idx}
                                index={idx}
                                onclick={switchTab}
                                key={idx} />
                        ))}
                    </div>
                </div>
                <div className="browser-window-actions">
                    {
                        actionsList.map(action => {
                            if (action.hide) return null;
                            return (
                                <div
                                    className="browser-window-actions-action"
                                    key={action.name}
                                    style={{ "backgroundColor": preferences.color?.backgroundColor }}
                                    onClick={() => action.onClick()}>
                                    <img
                                        className={`browser-window-actions-action-${action.name} logo-icon`}
                                        src={`/${action.name}.png`}
                                        style={{ filter: preferences.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className="browser-bar" style={{ "backgroundColor": preferences.color?.backgroundShadedColor }}>
                <div className="browser-bar-actions">
                    <img className=" logo-icon-actions-back logo-icon" src="/back.png" style={{ filter: (preferences.color?.textColor == 'white' ? 'invert(100%)' : '') + ' brightness(50%)' }} />
                    <img className=" logo-icon-actions-back logo-icon" src="/forward.png" style={{ filter: (preferences.color?.textColor == 'white' ? 'invert(100%)' : '') + ' brightness(50%)' }} />
                    <img className=" logo-icon-actions-back logo-icon" src="/refresh.png" style={{ filter: preferences.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
                </div>
                <div className="browser-bar-url" style={{ "backgroundColor": preferences.color?.backgroundColor }}>
                    {tabsValue[activeTab].url}
                </div>
            </div>
            <div className="browser-content">
                {content}
            </div>
            {(isReducing || isReduced || isIncreasing) && (
                <div className="browser-reduced">
                    <img className="browser-reduced-logo" src={browserIconPath} />
                </div>
            )}
        </BrowserDiv>
    );
}