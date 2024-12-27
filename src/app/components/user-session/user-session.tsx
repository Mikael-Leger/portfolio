import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import Loading from "../loading/loading";
import UsernameContext from "@/app/contexts/username-context";

import "./user-session.scss";

type UserSessionProps = {
};

gsap.registerPlugin(TextPlugin);

export default function UserSession({ }: UserSessionProps) {
    const username = useContext(UsernameContext) as string;

    useEffect(() => {
        animate();
    }, []);

    const animate = () => {
        const firstAnimation = localStorage.getItem('first-animation');
        if (firstAnimation) {
            return;
        }

        const timeline = gsap.timeline();
        timeline.to(".user-session", {
            duration: .4,
            delay: .1,
            opacity: 1
        });
        timeline.to(".user-session-loading", {
            duration: 0,
            opacity: 0
        });
        timeline.to(".user-session-pass-word-code", {
            duration: 1.5,
            delay: .7,
            text: "**********",
            ease: "sine.inOut"
        });
        timeline.to(".user-session-pass", {
            duration: 0,
            display: "none"
        });
        timeline.to(".user-session-welcome", {
            duration: 0,
            display: "block"
        });
        timeline.to(".user-session-loading", {
            duration: 0,
            opacity: 1
        });
        timeline.to(".user-session", {
            duration: .4,
            delay: .8,
            opacity: 0
        });

        setTimeout(() => {
            localStorage.setItem('first-animation', 'true');
        }, (timeline.totalDuration() * 1000) + 1000);
    }

    return (
        <div className="user-session">
            <div className="user-session-picture">
                <img className="user-session-picture-img" src="/icons/user.png" />
            </div>
            <div className="user-session-name">
                {username}
            </div>
            <div className="user-session-pass">
                <div className="user-session-pass-word" >
                    <div className="user-session-pass-word-code" >
                    </div>
                    <div className="user-session-pass-word-submit" >
                        <img className="user-session-pass-word-submit-img" src="/icons/right_arrow.png" />
                    </div>
                </div>
            </div>
            <div className="user-session-welcome">
                Welcome...
            </div>
            <div className="user-session-loading">
                <Loading />
            </div>
        </div>
    );
}