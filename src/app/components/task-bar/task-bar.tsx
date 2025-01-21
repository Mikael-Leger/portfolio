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
        <div className="task-bar" style={{ padding: isMobile ? "0 20px" : "0 40px" }}>
            <div className="task-bar-restart" onClick={restartWebsiteAnimations}>
                <img className="task-bar-restart-img" src="/icons/restart.png" />
                {!isMobile && (
                    <div className="task-bar-restart-button">
                        {getText(0)}
                    </div>
                )}
            </div>
            <div className="task-bar-tabs">
            </div>
        </div>
    );
}