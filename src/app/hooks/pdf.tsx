import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

export default function usePdf(type: string, hide: boolean, windowIconPath: string, id?: number) {

    useEffect(() => {
        if (type != "pdf" || id == null || windowIconPath == "") {
            return;
        }
        const windowPdf = document.getElementsByClassName("window-pdf");

        if (windowPdf[0]) {
            animateOpenPdf();

        }

    }, [type, hide, id, windowIconPath]);

    const isPdf = (type === 'pdf');
    if (!isPdf) {
        return { isNotPdf: true };
    }

    const animateOpenPdf = () => {
        const timeline = gsap.timeline();

        timeline.fromTo(document.querySelector(`.window-pdf-${id}`), {
            opacity: 0,
            scale: 0.2,
            y: '40vh',
            x: '40vw',
        }, {
            duration: .7,
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            ease: "sine.in"
        });

        return timeline.totalDuration();
    }

    return {};
}