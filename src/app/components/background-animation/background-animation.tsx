import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import "./background-animation.scss";

type BackgroundAnimationProps = {
};

export default function BackgroundAnimation({ }: BackgroundAnimationProps) {
    const [circles, setCircles] = useState<{ index: number, size: number, color: string, scale: number }[]>([]);

    const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const directionsRef = useRef<{ dx: number; dy: number }[]>([]);

    const createCircles = () => {
        const nbOfCircles = 50;

        const randomColors = [
            "#96b8eb",
            "#8febe5",
            "#84d984",
            "#c3d175",
            "#cc976c",
            "#de5f59",
            "#8b53c2",
            "#cb6ed4"
        ];

        const randomCircles = [...Array(nbOfCircles)].map((_, i) => {
            const randomSize = getRandomSize();
            const randomColor = getRandomColor(randomColors);

            return {
                index: i,
                size: randomSize,
                color: randomColor,
                scale: 0
            }
        });
        setCircles(randomCircles);
    }

    const getRandomColor = (randomColors: string[]) => {
        const randomIndex = Math.floor(Math.random() * randomColors.length);
        return randomColors[randomIndex];
    }

    const getRandomSize = () => {
        const minWidth = 150;
        const maxWidth = 200;
        return Math.random() * (maxWidth - minWidth) + minWidth;
    };

    const getRandomPosition = () => {
        const halfWidth = (window.innerWidth / 2) - 50;
        const halfHeight = (window.innerHeight / 2) - 50;
        const x = Math.random() * (halfWidth + halfWidth) - halfWidth;
        const y = Math.random() * (halfHeight + halfHeight) - halfHeight;

        return { x, y };
    };

    const getRandomDirection = () => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() / 5 + .2;
        return { dx: Math.cos(angle) * velocity, dy: Math.sin(angle) * velocity };
    };

    const initializeCircles = () => {
        circlesRef.current.forEach((circle, index) => {
            if (circle) {
                const { x, y } = getRandomPosition();
                gsap.set(circle, { x, y });
            }
        });
    };

    const repelCircle = (e: MouseEvent) => {
        circlesRef.current.forEach((circle, index) => {
            if (!circle) return;

            const { left, top, width, height } = circle.getBoundingClientRect();
            const circleCenter = {
                x: left + width / 2,
                y: top + height / 2,
            };

            const dx = circleCenter.x - e.clientX;
            const dy = circleCenter.y - e.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (width / 2)) {
                const angle = Math.atan2(dy, dx);
                const velocity = 1.5;
                directionsRef.current[index] = {
                    dx: Math.cos(angle) * velocity,
                    dy: Math.sin(angle) * velocity,
                };

                gsap.to(circle, {
                    x: `+=${Math.cos(angle) * velocity}`,
                    y: `+=${Math.sin(angle) * velocity}`,
                    duration: 0.5,
                });
            }
        });
    };

    const createAnimation = () => {
        initializeCircles();

        directionsRef.current = circles.map(() => getRandomDirection());

        const moveCircles = () => {
            circlesRef.current.forEach((circle, index) => {
                if (circle) {
                    const bounds = circle.getBoundingClientRect();
                    const { dx, dy } = directionsRef.current[index];

                    if (bounds.left + dx < 0 || bounds.right + dx > window.innerWidth) {
                        directionsRef.current[index].dx *= -1;
                    }
                    if (bounds.top + dy < 0 || bounds.bottom + dy > window.innerHeight) {
                        directionsRef.current[index].dy *= -1;
                    }

                    gsap.to(circle, {
                        x: `+=${directionsRef.current[index].dx}`,
                        y: `+=${directionsRef.current[index].dy}`,
                        duration: 0.03,
                        ease: "none",
                    });
                }
            });

            requestAnimationFrame(moveCircles);
        };

        moveCircles();
    }

    useEffect(() => {
        if (circles.length === 0) return;

        createAnimation();

        window.addEventListener('mousemove', repelCircle);

        return () => {
            window.removeEventListener('mousemove', repelCircle);
        };
    }, [circles]);

    const animateCirclesOnSpawn = () => {
        let stag = 0;
        circlesRef.current.forEach((circle, index) => {
            if (circle) {
                gsap.to(circle, {
                    delay: stag,
                    scale: 1,
                    ease: "bounce.out",
                    duration: 2.5,
                });
            }
            stag += .05;
        });
    }

    useEffect(() => {
        const delay = 1000;
        setTimeout(createCircles, delay);
        setTimeout(animateCirclesOnSpawn, delay + 50);
    }, []);

    const circlesTemplate = () => {
        return circles.map((circle, index) => {
            return (
                <div
                    key={index}
                    className="background-animation-circle"
                    ref={(el) => { if (el) (circlesRef.current[index] = el) }}
                    style={{
                        width: circle.size,
                        height: circle.size,
                        backgroundColor: circle.color,
                        scale: circle.scale
                    }}
                />
            )
        })
    }


    return (
        <div className="background-animation" ref={backgroundRef} >
            {circlesTemplate()}
        </div>
    );
}