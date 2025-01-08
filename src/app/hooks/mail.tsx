import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function useMail(type: string) {
    const isMail = (type === 'mail');
    if (!isMail) {
        return { isNotMail: true };
    }

    return {};
}