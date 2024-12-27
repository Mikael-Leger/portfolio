import { useEffect } from "react";

import "./task-bar.scss";

type TaskBarProps = {
};

export default function TaskBar({ }: TaskBarProps) {
    const restartWebsiteAnimations = () => {
        localStorage.removeItem('first-animation');
        window.location.reload();
    }

    return (
        <div className="task-bar">
            <div className="task-bar-restart" onClick={restartWebsiteAnimations}>
                <img className="task-bar-restart-img" src="/icons/restart.png" />
                <div className="task-bar-restart-button">
                    Restart
                </div>
            </div>
            <div className="task-bar-tabs">
            </div>
        </div>
    );
}