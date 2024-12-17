"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Title from "./components/title/title";
import PageLayout from "./layouts/page-layout";

import "./home.scss";
import CommandPrompt from "./components/section/command-prompt";
import CommandLine from "./interfaces/command-line.interface";

export default function Home() {
    const timeline = useRef(gsap.timeline({ paused: true }));
    const [currentLocation, setCurrentLocation] = useState(""); 

    useEffect(() => {
        animateOnPageLoad();
        setCurrentLocation(window.location.href);
    }, []);

    const animateOnPageLoad = () => {
        const firstDuration = .6;

        gsap.from(".title", { duration: firstDuration, y: -50, opacity: 0, ease: "bounce.out" });

    }

    if (currentLocation == null) {
        return <div>. . .</div>
    }

    const linesSection1: CommandLine[] = [
        {
            command: "ls -a",
            result: (
                <>
                    <span className="command-blue">.              </span>
                    <span>.bashrc</span>
                    <br/>
                    <span className="command-blue">..             </span>
                    <span className="command-blue">.ssh</span>
                    <br/>
                    <span>.bash_history  </span>
                    <span>exit</span>
                    <br/>
                    <span>.bash_logout   </span>
                    <span>portfolio</span>
                    <br/>
                    <span>.bash_profile  </span>
                    <span className="command-red">never-open-this.rpm</span>
                </>
            )
        },
        {
            command: "cd portfolio/",
            newPath: "~/portfolio"
        },
        {
            command: "./start-project.sh",
            result: "Building project",
            doNotBackToLine: true
        },
        {
            result: ". ",
            doNotBackToLine: true
        },
        {
            result: ". ",
            doNotBackToLine: true
        },
        {
            result: "."
        },
        {
            result: "Project Portfolio served on port 443"
        },
        {
            command: `xdg-open ${currentLocation}`,
        },
        {
            command: '',
        },
    ]

    return (
        <PageLayout>
            <div className="home">
                <Title timeline={timeline.current}/>
                <CommandPrompt lines={linesSection1}/>
            </div>
        </PageLayout>
    );
}
