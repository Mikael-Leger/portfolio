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
    desktopOpenActions: (action: string) => void;
};

export default function Dekstop({ windows, setWindowRef, windowRefs, getDefaultTabs, desktopOpenActions }: DekstopProps) {
    const shortcuts = [
        {
            title: "Portfolio",
            iconPath: "/browsers/chrome.png",
            position: { top: 200, left: 200 },
            onClick: () => desktopOpenActions("browser")
        },
        {
            title: "CV",
            iconPath: "/icons/pdf.png",
            position: { top: 400, right: 200 },
            onClick: () => desktopOpenActions("pdf")
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
                    getDefaultTabs={getDefaultTabs} />
            ))}
        </div>
    );
}