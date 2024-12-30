import { useEffect } from "react";

import "./shortcut.scss";

type ShortcutProps = {
    title: string;
    iconPath: string;
    position: { top: number, left?: number, right?: number };
    onClick: () => void;
};

export default function Shortcut({ title, iconPath, position, onClick }: ShortcutProps) {
    return (
        <div className="shortcut" style={{ top: position.top, left: position.left, right: position.right }} onClick={onClick}>
            <div className="shortcut-img">
                <img src={iconPath} />
            </div>
            <div className="shortcut-title">
                {title}
            </div>
        </div>
    );
}