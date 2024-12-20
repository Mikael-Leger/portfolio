"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import PageLayout from "./layouts/page-layout";
import CommandLine from "./interfaces/command-line.interface";
import Window, { WindowProps } from "./components/window/window";

import "./home.scss";

export default function Home() {
    const timeline = useRef(gsap.timeline({ paused: true }));
    const [currentLocation, setCurrentLocation] = useState("");
    const [showBrowser, setShowBrowser] = useState(false);

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
                    <br />
                    <span className="command-blue">..             </span>
                    <span className="command-blue">.ssh</span>
                    <br />
                    <span>.bash_history  </span>
                    <span>exit</span>
                    <br />
                    <span>.bash_logout   </span>
                    <span>portfolio</span>
                    <br />
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

    if (typeof window === "undefined") {
        return <div>Loading</div>
    }

    const tabs = [
        {
            logoPath: "/vercel.svg",
            title: "Portfolio - Mikaël Léger",
            url: `${window.location.href}home`,
            content: (
                <>
                    Portfolio
                </>
            )
        },
        {
            logoPath: "/vercel.svg",
            title: "CV",
            url: `${window.location.href}curriculum-vitae`,
            content: (
                <>
                    CV
                </>
            )
        }
    ];

    const windows: WindowProps[] = [
        {
            type: "command",
            lines: linesSection1,
            onFinish: () => setShowBrowser(true)
        },
        {
            type: "browser",
            tabs: tabs,
            hide: !showBrowser
        },
    ]

    return (
        <PageLayout>
            <div className="home">
                {windows.map((window, idx) => (
                    <Window
                        key={idx}
                        {...window} />
                ))}
            </div>
        </PageLayout>
    );
}
