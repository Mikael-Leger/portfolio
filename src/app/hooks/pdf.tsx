import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

export default function usePdf(animateCreateWindow: () => number, type: string, hide: boolean, windowIconPath: string, id?: number) {

    useEffect(() => {
        if (type != "pdf" || id == null || windowIconPath == "") {
            return;
        }
        const windowPdf = document.getElementsByClassName("window-pdf");

        if (windowPdf[0]) {
            animateCreateWindow();

        }

    }, [type, hide, id, windowIconPath]);

    const isPdf = (type === 'pdf');
    if (!isPdf) {
        return { isNotPdf: true };
    }

    return {};
}