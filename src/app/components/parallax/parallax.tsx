import { useRef, useEffect, useState, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Title from "../title/title";

import "./parallax.scss";

type ParallaxProps = {
    firstText?: string;
    secondText?: string;
};

function Parallax({ firstText, secondText }: ParallaxProps) {
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
            const timeline = gsap.timeline({
                defaults: { duration: 1 },
                scrollTrigger: {
                    trigger: parallaxRef.current,
                    start: "top top",
                    end: "2000 bottom",
                    scrub: true,
                    pin: true,
                    onUpdate: (self) => {
                        setBackground(Math.ceil(self.progress * 100 + 20))
                        setShootingStarLength(-500 - (self.progress * 3000));
                    },
                },
            });
            timeline.to(
                firstTextRef.current,
                {
                    y: "+=500",
                    scale: .2,
                    opacity: 0
                },
                0
            );
            timeline.to(
                secondTextRef.current,
                {
                    y: "-=500",
                    scale: 1,
                    opacity: 1
                },
                0
            );
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
            timeline.to(
                earth.current,
                {
                    rotate: 90
                },
                0
            );
            timeline.to(
                jupiter.current,
                {
                    y: "-=300",
                    x: "+=600",
                },
                0
            );
            timeline.to(
                pluto.current,
                {
                    motionPath: {
                        path: [
                            { x: -600, y: 350 },
                            { x: -1200, y: -50 }
                        ],
                        curviness: 1.5,
                    },
                },
                0
            );
            timeline.to(
                mars.current,
                {
                    motionPath: {
                        path: [
                            { x: 100, y: -150 },
                            { x: 600, y: -300 }
                        ],
                        curviness: 1.5,
                    },
                },
                0
            );
            timeline.to(
                uranus.current,
                {
                    motionPath: {
                        path: [
                            { x: -650, y: -650 },
                            { x: -150, y: -300 }
                        ],
                        curviness: 1.5,
                    },
                    zIndex: 4
                },
                0
            );
            const rocketTimeline = gsap.timeline();
            rocketTimeline.fromTo(
                "#rocket",
                {
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
                            { x: 200, y: -50 },
                            { x: 285, y: 210 }
                        ],
                        curviness: 1.5,
                    },
                    rotate: "+=85",
                    opacity: 1
                }
            );
            rocketTimeline.fromTo(
                "#rocket",
                {
                    x: 285,
                    y: 210
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
                            { x: 100, y: 420 },
                            { x: 100, y: 900 },
                        ],
                        curviness: 0,
                    },
                }
            );
            rocketTimeline.fromTo(
                "#rocket",
                {
                    x: 100,
                    y: 900
                },
                {
                    scrollTrigger: {
                        trigger: ".portfolio-header",
                        start: "900% center",
                        end: "1100% center",
                        toggleActions: "restart none none none",
                        scrub: true,
                        markers: true
                    },
                    motionPath: {
                        path: [
                            { x: 150, y: 1200 },
                            { x: 400, y: 1400 },
                        ],
                        curviness: 1.5,
                    },
                }
            );
            rocketTimeline.fromTo(
                "#rocket",
                {
                    rotate: 135,
                    x: 400,
                    y: 1400
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
                            { x: 400, y: 1700 },
                        ],
                        curviness: 0,
                    },
                    rotate: "+=180"
                }
            );
            rocketTimeline.fromTo(
                "#rocket",
                {
                    x: 400,
                    y: 1700
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
                            { x: 400, y: 1900 },
                        ],
                        curviness: 0,
                    }
                }
            );
            rocketTimeline.fromTo(
                "#rocket",
                {
                    x: 400,
                    y: 1900
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
                }
            );

            rocketTimeline.to(
                "#moon",
                {
                    scrollTrigger: {
                        trigger: ".portfolio-header",
                        start: "1400% center",
                        end: "1900% center",
                        toggleActions: "restart none reverse none",
                        scrub: true,
                        pin: "#moon",
                        pinSpacing: false
                    },
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
            gsap.fromTo(
                ".portfolio-content-quote",
                {
                    opacity: 0,

                },
                {
                    opacity: 1,

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
            animateTexts(4, 6, 1300, 85, {
                y: 100,
                clipPath: "inset(100% 0 0 0)",
                opacity: 0
            });

        });
        return () => ctx.revert();
    }, []);

    const animateTexts = (length: number, start: number, base: number, gap: number, from: { x?: number; y?: number; clipPath?: string; opacity?: number }) => {
        [...Array(length)].forEach((_, i) => {
            gsap.fromTo(`.portfolio-content-text-${i + start}`,
                from,
                {
                    scrollTrigger: {
                        trigger: ".portfolio-header",
                        start: `${base + (i * gap)}% center`,
                        end: `${base + gap + (i * gap)}% center`,
                        toggleActions: "restart none reverse none"
                    },
                    y: 0,
                    x: 0,
                    clipPath: "inset(0% 0 0 0)",
                    opacity: 1
                }
            );
        });
    }

    return (
        <div className="parallax-outer">
            <div ref={parallaxRef} style={{ background: `linear-gradient(#030512, #0e1e5c ${background}%, #6d74ff,rgb(216, 208, 102))` }} className='parallax'>
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
                        <Title text={firstText} size="big" transform="upper" decoration="underline" effect="shadow" />
                    </div>
                )}
                {secondText && (
                    <div className="parallax-text-second" ref={secondTextRef}>
                        <Title text={secondText} size="medium" transform="upper" effect="shadow" />
                    </div>
                )}
                <img ref={earth} className='earth' src="/parallax/planets/earth.png" />
                <img ref={jupiter} className='jupiter' src="/parallax/planets/jupiter.png" />
                <img ref={mars} className='mars' src="/parallax/planets/mars.png" />
                <img ref={pluto} className='pluto' src="/parallax/planets/pluto.png" />
                <img ref={uranus} className='uranus' src="/parallax/planets/uranus.png" />
            </div>
        </div>
    )
}

export default Parallax