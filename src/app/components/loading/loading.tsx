import { useEffect } from "react";
import gsap from "gsap";

import "./loading.scss";

type LoadingProps = {
};

export default function Loading({ }: LoadingProps) {
    useEffect(() => {
        const bars = document.getElementsByClassName('loading-bar');

        for (let i = 0; i < bars.length; i++) {
            gsap.to(bars[i], {
                rotation: '+=360',
                duration: 2,
                repeat: -1,
                ease: "power1.out",
                transformOrigin: "center",
                delay: i * .2
            });
        }
    }, []);

    const showBars = () => {
        const bars = [];
        for (let i = 0; i <= 6; i++) {
            const bar = (
                <div className="loading-bar" >
                    <div className="loading-bar-dot" />
                </div>
            )
            bars.push(bar);
        }

        return bars;
    }

    return (
        <div className="loading">
            {showBars()}
        </div>
    );
}