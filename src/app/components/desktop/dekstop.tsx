import { RefObject, useEffect, useRef, useState } from "react";

import Window, { WindowProps } from "../window/window";
import WindowRef from "@/app/interfaces/window-ref.interface";
import TabInterface from "@/app/interfaces/tab.interface";
import Shortcut from "../shortcut/shortcut";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";
import Language from "../language/language";

import "./dekstop.scss";

type DekstopProps = {
    windows: WindowProps[];
    setWindowRef: (id: number, ref: WindowRef) => void;
    windowRefs: RefObject<Record<number, WindowRef>>;
    getDefaultTabs: () => TabInterface[];
    desktopOpenActions: (action: string, payload?: any) => void;
};

export default function Dekstop({ windows, setWindowRef, windowRefs, getDefaultTabs, desktopOpenActions }: DekstopProps) {
    const { isMobile } = useIsMobile();
    const { getText } = useLanguage("desktop");

    const shortcuts = [
        {
            title: getText(0),
            position: { top: isMobile ? 100 : 150, left: isMobile ? 50 : 200 },
            iconPath: "/browsers/edge.png",
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Projects" })
        },
        {
            title: getText(1),
            iconPath: "/browsers/edge.png",
            position: { top: isMobile ? 225 : 150, left: isMobile ? 50 : 350 },
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Skills" })
        },
        {
            title: getText(2),
            iconPath: "/icons/pdf.png",
            position: { top: isMobile ? 100 : 150, right: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 2 })
        },
        {
            title: getText(3),
            iconPath: "/icons/me.png",
            position: { top: isMobile ? 225 : 300, right: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 4 })
        },
        {
            title: getText(4),
            iconPath: "/icons/mail.png",
            position: { top: isMobile ? 550 : 550, right: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 3 })
        },
        {
            title: getText(5),
            iconPath: "/icons/notepad.png",
            position: { top: isMobile ? 550 : 550, left: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 5 })
        }
    ];

    return (
        <div className="dekstop">
            {shortcuts.map(shortcut => (
                <Shortcut key={shortcut.title}
                    {...shortcut}
                />
            ))}
            {windows.map(window => (
                <Window
                    key={window.window_id}
                    {...window}
                    setWindowRef={setWindowRef}
                    windowRefs={windowRefs}
                    getDefaultTabs={getDefaultTabs}
                    desktopOpenActions={desktopOpenActions} />
            ))}
            <Language />
        </div>
    );
}