import { useRef, useEffect, useState, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Title from "../title/title";
import { Breakpoint, useIsMobile } from "@/app/contexts/mobile-context";
import { PlanetBaseStyle, Planets } from "@/app/interfaces/planet.interface";

import "./parallax.scss";

type ParallaxProps = {
    firstText?: string;
    secondText?: string;
    moon: RefObject<null>;
    portfolioRef: RefObject<null>;
};

function Parallax({ firstText, secondText, portfolioRef, moon }: ParallaxProps) {
    const { isMobile, getBreakpointValue } = useIsMobile();

    const [background, setBackground] = useState(20);
    const [shootingStarOffset, setShootingStarLength] = useState(-500);

    const parallaxRef = useRef(null);
    const firstTextRef = useRef(null);
    const secondTextRef = useRef(null);
    const shootingStar = useRef<SVGLineElement | null>(null);
    const shootingStar2 = useRef<SVGLineElement | null>(null);
    const earth = useRef(null);
    const jupiter = useRef(null);
    const mars = useRef(null);
    const pluto = useRef(null);
    const uranus = useRef(null);

    const imagesLoaded = useRef(0);

    useEffect(() => {
        if (moon.current == null || portfolioRef.current == null) {
            return;
        }

        const ctx = gsap.context(() => {
            if (moon.current == null || portfolioRef.current == null) {
                return;
            }

            const images = Array.from(
                (portfolioRef.current as HTMLDivElement).querySelectorAll("img.planet")
            ) as HTMLImageElement[];

            images?.forEach((img) => {
                img.onload = () => {
                    imagesLoaded.current++;
                    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);
                    if (isMobile) {
                        ScrollTrigger.normalizeScroll({
                            allowNestedScroll: true,
                            lockAxis: false,
                            type: "touch,wheel,pointer",
                        });
                    }

                    const endParallax = isMobile ? "1600" : "2000";

                    if (imagesLoaded.current === images.length) {
                        const timeline = gsap.timeline({
                            defaults: { duration: 1 },
                            scrollTrigger: {
                                trigger: parallaxRef.current,
                                start: "top top",
                                end: `${endParallax} bottom`,
                                scrub: true,
                                pin: true,
                                onUpdate: (self) => {
                                    setBackground(Math.ceil(self.progress * 100 + 20))
                                    setShootingStarLength(-500 - (self.progress * 3000));
                                },
                            },
                        });
                        if (firstTextRef.current != null) {
                            const titleText = (firstTextRef.current as HTMLDivElement).getElementsByClassName("title")[0];
                            timeline.to(
                                titleText,
                                {
                                    // y: () => getTextHeight("first"),
                                    // scale: .2,
                                    // opacity: 0
                                    text: secondText
                                },
                                0
                            );
                        }
                        timeline.set(
                            shootingStar.current,
                            {
                                strokeDasharray: 200,
                                strokeDashoffset: 500
                            })
                        timeline.to(
                            shootingStar.current,
                            {
                                duration: 2,
                                ease: "power2.out"
                            },
                            0
                        );
                        timeline.fromTo(
                            earth.current,
                            {
                                translate: "(-50%, 0)",
                                rotate: 0
                            },
                            {
                                translate: "(-50%, 0)",
                                rotate: "+=120"
                            },
                            0
                        );
                        timeline.to(
                            jupiter.current,
                            {
                                y: "+=50",
                                x: "-=50",
                            },
                            0
                        );
                        timeline.to(
                            pluto.current,
                            {
                                motionPath: {
                                    path: [
                                        { x: vwToPx(-35), y: -50 },
                                        { x: vwToPx(-70), y: 0 }
                                    ],
                                    curviness: 1.5,
                                },
                                rotate: -45
                            },
                            0
                        );
                        timeline.to(
                            mars.current,
                            {
                                y: "+=300",
                                x: "+=150",
                            },
                            0
                        );
                        timeline.to(
                            uranus.current,
                            {
                                y: "+=50",
                                x: "+=50",
                            },
                            0
                        );
                        const rocketTimeline = gsap.timeline();
                        let tmpY = 0;
                        let tmpY2 = -50;
                        let tmpY3 = 210;
                        let tmpGap = isMobile ? 200 : 0;
                        // First details
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                x: 0,
                                y: tmpY,
                                opacity: 0,
                                rotate: 50
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "center center",
                                    end: "300% center",
                                    toggleActions: "restart none none none",
                                    scrub: true
                                },
                                motionPath: {
                                    path: [
                                        { x: 200, y: tmpY2 },
                                        { x: 285, y: tmpY3 }
                                    ],
                                    curviness: 1.5,
                                },
                                rotate: "+=85",
                                opacity: 1
                            }
                        );
                        tmpY = tmpY3;
                        tmpY2 = tmpY + 210;
                        tmpY3 = tmpY2 + 880 - tmpGap;
                        let tmpX = isMobile ? -40 : 100;
                        let tmpX2 = isMobile ? 10 : 150;
                        let tmpX3 = isMobile ? 110 : 400;
                        // Image
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                x: 285,
                                y: tmpY
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "300% center",
                                    end: "900% center",
                                    toggleActions: "restart none none none",
                                    scrub: true,
                                },
                                motionPath: {
                                    path: [
                                        { x: tmpX, y: tmpY2 },
                                        { x: tmpX, y: tmpY3 },
                                    ],
                                    curviness: 0,
                                },
                            }
                        );
                        tmpY = tmpY3;
                        let tmpY4 = tmpY + tmpGap;
                        tmpY2 = tmpY4 + 100;
                        tmpY3 = tmpY2 + 300;
                        // Moon below
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                x: tmpX,
                                y: tmpY
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "900% center",
                                    end: "1100% center",
                                    toggleActions: "restart none none none",
                                    scrub: true,
                                },
                                motionPath: {
                                    path: [
                                        { x: tmpX, y: tmpY4 },
                                        { x: tmpX2 + 50, y: tmpY2 },
                                        { x: tmpX3, y: tmpY3 },
                                    ],
                                    curviness: 1.5,
                                },
                            }
                        );
                        tmpY = tmpY3;
                        tmpY2 = tmpY + 400 - tmpGap;
                        tmpY3 = tmpY2;
                        // Backflip
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                rotate: 135,
                                x: tmpX3,
                                y: tmpY
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "1100% center",
                                    end: "1300% center",
                                    toggleActions: "restart none none none",
                                    scrub: true,
                                },
                                motionPath: {
                                    path: [
                                        { x: tmpX3, y: tmpY2 },
                                    ],
                                    curviness: 0,
                                },
                                rotate: "+=180"
                            }
                        );
                        tmpY = tmpY3;
                        tmpY2 = tmpY + 200 + tmpGap;
                        tmpY3 = tmpY2;
                        // Land on moon
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                x: tmpX3,
                                y: tmpY,
                                zIndex: 0
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "1300% center",
                                    end: "1400% center",
                                    toggleActions: "restart none none none",
                                    scrub: true,
                                },
                                motionPath: {
                                    path: [
                                        { x: tmpX3, y: tmpY2 },
                                    ],
                                    curviness: 0,
                                },
                                zIndex: 1
                            }
                        );
                        tmpY = tmpY3;
                        // Rocket pin
                        rocketTimeline.fromTo(
                            "#rocket",
                            {
                                x: tmpX3,
                                y: tmpY,
                                opacity: 1,
                                zIndex: 1
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "1400% center",
                                    end: "1900% center",
                                    toggleActions: "restart none reverse none",
                                    scrub: true,
                                    pin: "#rocket",
                                    pinSpacing: false
                                },
                                opacity: .5
                            }
                        );
                        // Moon pin
                        rocketTimeline.fromTo(
                            moon.current,
                            {
                                opacity: 1
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: "1400% center",
                                    end: "1900% center",
                                    toggleActions: "restart none reverse none",
                                    scrub: true,
                                    pin: moon.current,
                                    pinSpacing: false
                                },
                                opacity: .5
                            }
                        );

                        gsap.fromTo(
                            "#me",
                            {
                                opacity: 0,
                                y: 300
                            },
                            {
                                scrollTrigger: {
                                    trigger: ".portfolio-header",
                                    start: `300% center`,
                                    end: `500% center`,
                                    toggleActions: "restart none reverse none",
                                    scrub: true,
                                },
                                opacity: .7,
                                y: 0
                            }
                        );

                        animateTexts(2, 1, 150, 100, {
                            x: 300,
                            opacity: 0
                        });

                        animateTexts(3, 3, 700, 100, {
                            x: 300,
                            opacity: 0
                        });

                        animateTexts(4, 6, 1400, 85, {
                            y: 100,
                            clipPath: "inset(100% 0 0 0)",
                            opacity: 0
                        });
                    }
                };
            });
        });

        return () => ctx.revert();
    }, [moon.current, portfolioRef.current]);

    const vwToPx = (vw: number) => (window.innerWidth * vw) / 100;

    const animateTexts = (length: number, start: number, base: number, gap: number, from: { x?: number; y?: number; clipPath?: string; opacity?: number }) => {
        [...Array(length)].forEach((_, i) => {
            const selector = `portfolio-content-text-${i + start}`;
            const elem = document.getElementsByClassName(selector)[0];
            const newFrom = { ...from };

            if (elem && elem.classList.contains("text-reversed") && from.x != null) {
                newFrom.x = -from.x;
            }

            gsap.fromTo(elem,
                newFrom,
                {
                    scrollTrigger: {
                        trigger: ".portfolio-header",
                        start: `${base + (i * gap)}% center`,
                        end: `${base + gap + (i * gap)}% center`,
                        toggleActions: "restart none reverse none"
                    },
                    y: 0,
                    x: 0,
                    clipPath: "inset(-50% -50px -50px -50px)",
                    opacity: 1
                }
            );
        });
    }

    const responsivePlanetsStyle: Planets[] = [
        {
            ref: earth,
            name: "earth",
            base: {
                width: {
                    default: 400,
                    unit: "px",
                    gap: 250,
                },
                bottom: {
                    default: -15,
                    unit: "%",
                    gap: -22,
                },
                left: {
                    default: 50,
                    unit: "%",
                },
                transform: "translateX(-50%)"
            },
            zIndex: 7
        },
        {
            ref: jupiter,
            name: "jupiter",
            base: {
                width: {
                    default: 400,
                    unit: "px",
                    gap: 100,
                },
                bottom: {
                    default: 0,
                    unit: "%",
                    gap: -5,
                },
                left: {
                    default: -20,
                    unit: "%"
                },
            },
            zIndex: 5
        },
        {
            ref: mars,
            name: "mars",
            base: {
                width: {
                    default: 300,
                    unit: "px",
                    gap: 50,
                },
                bottom: {
                    default: 35,
                    unit: "%",
                    gap: -1,
                },
                left: {
                    default: -25,
                    unit: "%",
                    gap: 3,
                }
            },
            zIndex: 6
        },
        {
            ref: pluto,
            name: "pluto",
            base: {
                width: {
                    default: 100,
                    unit: "px",
                    gap: 10,
                },
                bottom: {
                    default: 85,
                    unit: "%",
                    gap: -2,
                },
                right: {
                    default: 5,
                    unit: "%",
                    gap: 1
                }
            },
            zIndex: 3
        },
        {
            ref: uranus,
            name: "uranus",
            base: {
                width: {
                    default: 150,
                    unit: "px",
                    gap: 50,
                },
                bottom: {
                    default: 35,
                    unit: "%",
                    gap: -2,
                },
                right: {
                    default: -5,
                    unit: "%",
                    gap: -1,
                }
            },
            zIndex: 2
        },
    ];

    const getTextHeight = (text: string): string => {
        const gapIndex = getBreakpointValue();

        let height = 500;
        if (gapIndex == 0) {
            height += 0;
        } else if (gapIndex == 1) {
            height += 50;
        } else if (gapIndex == 2) {
            height += 100;
        } else if (gapIndex == 3) {
            height += 100;
        } else if (gapIndex == 4) {
            height += 50;
        }

        let indent = "0";
        if (text === "first") {
            indent = `+=${height}`;
        } else {
            indent = `-=${height}`;
        }

        return indent;
    }

    const getPlanetStyle = (name: string) => {
        const planet = responsivePlanetsStyle.find(planet => planet.name === name);
        if (!planet) return;

        const gapIndex = getBreakpointValue();

        const style: PlanetBaseStyle = {
            width: `${planet.base.width.default as number + ((planet.base.width.gap ?? 0) * gapIndex)
                }${planet.base.width.unit}`,
            zIndex: planet.zIndex ?? 0,
        }

        if (planet.base.bottom != null) {
            style.bottom = `${planet.base.bottom.default as number + ((planet.base.bottom.gap ?? 0) * gapIndex)
                }${planet.base.bottom.unit}`
        }
        if (planet.base.left != null) {
            style.left = `${planet.base.left.default as number + ((planet.base.left.gap ?? 0) * gapIndex)
                }${planet.base.left.unit}`
        }
        if (planet.base.right != null) {
            style.right = `${planet.base.right.default as number + ((planet.base.right.gap ?? 0) * gapIndex)
                }${planet.base.right.unit}`
        }
        if (planet.base.transform != null) {
            style.transform = planet.base.transform;
        }

        return style;
    }

    const getPlanets = () => {
        return responsivePlanetsStyle.map(responsivePlanetsStyle => {
            return <img
                ref={responsivePlanetsStyle.ref}
                className={`planet ${responsivePlanetsStyle.name}`}
                src={`/parallax/planets/${responsivePlanetsStyle.name}.webp`}
                style={getPlanetStyle(`${responsivePlanetsStyle.name}`)}
                key={responsivePlanetsStyle.name} />
        })
    }

    return (
        <div className="parallax-outer">
            <div
                ref={parallaxRef}
                className='parallax'
                style={{ background: `linear-gradient(#030512, #0e1e5c ${background}%, #6d74ff,rgb(216, 208, 102))` }}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute" }}>
                    <line
                        ref={shootingStar}
                        x1="-750" y1="0"
                        x2="100%" y2="300"
                        style={{ stroke: "white", strokeWidth: 2, strokeDasharray: "200, 3000", strokeDashoffset: `${shootingStarOffset}px` }} />
                    <line
                        ref={shootingStar2}
                        x1="-1250" y1="1500"
                        x2="60%" y2="0"
                        style={{ stroke: "white", strokeWidth: 2, strokeDasharray: "200, 3000", strokeDashoffset: `${shootingStarOffset * 1.2}px` }} />
                </svg>
                {firstText && (
                    <div className="parallax-text-first" ref={firstTextRef}>
                        <Title text={firstText} size="big" transform="upper" effect="shadow" futurist />
                    </div>
                )}
                <div className="planet-container">
                    {getPlanets()}
                </div>
            </div>
        </div>
    )
}

export default Parallax