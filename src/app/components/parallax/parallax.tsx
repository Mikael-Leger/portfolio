"use client"

import { useRef, useEffect, useState, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import "./parallax.scss";

type ParallaxProps = {
    children: React.ReactNode;
};

function Parallax({ children }: ParallaxProps) {
    const [background, setBackground] = useState(20);

    const parallaxRef = useRef(null);
    const mountain3 = useRef(null);
    const mountain2 = useRef(null);
    const mountain1 = useRef(null);
    const stars = useRef(null);
    const sun = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);
            var tl = gsap.timeline({
                defaults: { duration: 1 },
                scrollTrigger: {
                    trigger: parallaxRef.current,
                    start: "top top",
                    end: "5000 bottom",
                    scrub: true,
                    pin: true,
                    onUpdate: (self) => {
                        console.log("onupdate");
                        console.log(self.progress);

                        setBackground(Math.ceil(self.progress * 100 + 20))
                    },
                },
            });
            tl.to(
                mountain3.current,
                {
                    y: "-=80",
                },
                0
            );
            tl.to(
                mountain2.current,
                {
                    y: "-=30",
                },
                0
            );
            tl.to(
                mountain1.current,
                {
                    y: "+=50",
                },
                0
            );
            tl.to(
                stars.current,
                {
                    top: 0,
                },
                0.5
            );
            tl.to(
                sun.current,
                {
                    y: "+=210",
                },
                0
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="parallax-outer">
            <div ref={parallaxRef} style={{ background: `linear-gradient(#0F2B9C, #673D7D ${background}%, #A74A67, #EDFC54 )` }} className='parallax'>
                <img ref={mountain3} className='mountain-3' src="/parallax/mountain-3.svg" />
                <img ref={mountain2} className='mountain-2' src="/parallax/mountain-2.svg" />
                <img ref={mountain1} className='mountain-1' src="/parallax/mountain-1.svg" />
                <img ref={sun} className='sun' src="/parallax/sun.svg" />
                <img ref={stars} className='stars' src="/parallax/stars.svg" />
            </div>
        </div>
    )
}

export default Parallax