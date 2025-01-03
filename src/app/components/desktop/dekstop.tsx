import { RefObject, useEffect } from "react";
import Window, { WindowProps } from "../window/window";
import WindowRef from "@/app/interfaces/window-ref.interface";
import TabInterface from "@/app/interfaces/tab.interface";
import Shortcut from "../shortcut/shortcut";

import "./dekstop.scss";

type DekstopProps = {
    windows: WindowProps[];
    setWindowRef: (id: number, ref: WindowRef) => void;
    windowRefs: RefObject<Record<number, WindowRef>>;
    getDefaultTabs: () => TabInterface[];
    desktopOpenActions: (action: string, payload?: any) => void;
};

export default function Dekstop({ windows, setWindowRef, windowRefs, getDefaultTabs, desktopOpenActions }: DekstopProps) {
    const shortcuts = [
        {
            title: "Welcome Page",
            iconPath: "/browsers/edge.png",
            position: { top: 200, left: 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Welcome - Mikaël Léger" })
        },
        {
            title: "Portfolio",
            position: { top: 200, left: 350 },
            iconPath: "/browsers/edge.png",
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Portfolio" })
        },
        {
            title: "Skills",
            iconPath: "/browsers/edge.png",
            position: { top: 350, left: 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 0, name: "Skills" })
        },
        {
            title: "CV",
            iconPath: "/icons/pdf.png",
            position: { top: 100, right: 200 },
            onClick: () => desktopOpenActions("openWindow", { id: 2 })
        },
        {
            title: "Contact me",
            iconPath: "/icons/mail.png",
            position: { top: 500, right: 300 },
            onClick: () => desktopOpenActions("openWindow", { id: 3 })
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