import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function usePortfolio(animateCreateWindow: () => number, type: string, hide: boolean, windowIconPath: string, id?: number) {
    const prevState = useRef<{ type: string, hide: boolean, id: number, windowIconPath: string }>(null);

    useEffect(() => {
        if (type != "portfolio" || id == null || windowIconPath == "") {
            return;
        }
        const windowPortfolio = document.getElementsByClassName("window-portfolio");

        if (prevState.current) {
            return;
        }

        // Temporary solution
        // prevState.current = { type, hide, id, windowIconPath };

        if (windowPortfolio[0]) {
            animateCreateWindow();

        }

    }, [type, hide, id, windowIconPath]);

    const isPortfolio = (type === 'portfolio');
    if (!isPortfolio) {
        return { isNotPortfolio: true };
    }

    return {};
}