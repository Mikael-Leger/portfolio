import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

import CommandLine from "../interfaces/command-line.interface";
import Preferences from "../interfaces/preferences.interface";
import { getFormattedDate } from "../services/date.service";
import UsernameContext from "../contexts/username-context";

const BASE_TIME_WAIT = 0;
// const BASE_TIME_WAIT = 80;

const BASE_DELAY = 0;
// const BASE_DELAY = 800;

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