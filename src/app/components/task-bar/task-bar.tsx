import { useEffect, useRef } from "react";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";

import "./task-bar.scss";

type TaskBarProps = {
};

export default function TaskBar({ }: TaskBarProps) {
    const { isMobile } = useIsMobile();

    const { getText } = useLanguage("task-bar");

    const restartWebsiteAnimations = () => {
        localStorage.removeItem('first-animation');
        localStorage.removeItem('active-tab');
        localStorage.removeItem('tabs');
        localStorage.removeItem('windows');
        window.location.reload();
    }

    return (
        <div className="task-bar-restart"
            style={{ padding: isMobile ? "5px" : "5px 10px" }}
            onClick={restartWebsiteAnimations}>
            <img className="task-bar-restart-img" src="/icons/restart.png" />
            {!isMobile && (
                <div className="task-bar-restart-button">
                    {getText(0)}
                </div>
            )}
        </div>
    );
}