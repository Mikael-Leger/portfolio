import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function usePortfolio(type: string) {
    const isPortfolio = (type === 'portfolio');
    if (!isPortfolio) {
        return { isNotPortfolio: true };
    }

    return {};
}