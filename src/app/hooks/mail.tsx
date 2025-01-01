import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function useMail(animateCreateWindow: () => number, type: string, hide: boolean, windowIconPath: string, id?: number) {
    const prevState = useRef<{ type: string, hide: boolean, id: number, windowIconPath: string }>(null);

    useEffect(() => {
        if (type != "mail" || id == null || windowIconPath == "") {
            return;
        }
        const windowMail = document.getElementsByClassName("window-mail");

        if (prevState.current) {
            return;
        }

        // Temporary solution
        prevState.current = { type, hide, id, windowIconPath };

        if (windowMail[0]) {
            animateCreateWindow();

        }

    }, [type, hide, id, windowIconPath]);

    const isMail = (type === 'mail');
    if (!isMail) {
        return { isNotMail: true };
    }

    return {};
}