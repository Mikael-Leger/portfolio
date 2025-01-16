import { RefObject, useEffect, useRef, useState } from "react";

import Window, { WindowProps } from "../window/window";
import WindowRef from "@/app/interfaces/window-ref.interface";
import TabInterface from "@/app/interfaces/tab.interface";
import Shortcut from "../shortcut/shortcut";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";

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
    const { language, getTextsByComponent } = useLanguage();

    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("desktop");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }

    if (texts.length === 0) {
        return;
    }

    const shortcuts = [
        {
            title: getText(0),
            position: { top: isMobile ? 50 : 200, left: isMobile ? 50 : 200 },
            iconPath: "/browsers/edge.png",
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Projects" })
        },
        {
            title: getText(1),
            iconPath: "/browsers/edge.png",
            position: { top: isMobile ? 175 : 200, left: isMobile ? 50 : 350 },
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Skills" })
        },
        {
            title: getText(2),
            iconPath: "/icons/pdf.png",
            position: { top: isMobile ? 50 : 100, right: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 2 })
        },
        {
            title: getText(3),
            iconPath: "/icons/portfolio.png",
            position: { top: isMobile ? 300 : 300, right: isMobile ? 50 : 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 4 })
        },
        {
            title: getText(4),
            iconPath: "/icons/mail.png",
            position: { top: isMobile ? 425 : 500, right: isMobile ? 50 : 300 },
            onClick: () => desktopOpenActions("openWindow", { id: 3 })
        },
        {
            title: "Licenses.txt",
            iconPath: "/icons/notepad.png",
            position: { top: isMobile ? 425 : 500, left: isMobile ? 50 : 200 },
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
        </div>
    );
}