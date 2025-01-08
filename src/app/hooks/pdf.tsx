import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function usePdf(type: string) {
    const isPdf = (type === 'pdf');
    if (!isPdf) {
        return { isNotPdf: true };
    }

    return {};
}