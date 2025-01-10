import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function useNotepad(type: string) {
    const isNotepad = (type === 'notepad');
    if (!isNotepad) {
        return { isNotNotepad: true };
    }

    return {};
}