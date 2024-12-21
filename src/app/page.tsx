"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import PageLayout from "./layouts/page-layout";
import CommandLine from "./interfaces/command-line.interface";
import { Window, WindowProps } from "./components/window/window";
import Loading from "./components/loading/loading";
import Portfolio from "./components/portfolio/portfolio";
import TabInterface from "./interfaces/tab.interface";
import WindowRef from "./interfaces/window-ref.interface";

import "./home.scss";

export default function Home() {
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [showBrowser, setShowBrowser] = useState<boolean>(false);
    const [tabs, setTabs] = useState<TabInterface[]>([]);

    const [newTab, setNewTab] = useState<TabInterface>();

    const windowRef = useRef<WindowRef>(null);

    useEffect(() => {
        setCurrentLocation(window.location.href);
    }, []);

    useEffect(() => {
        if (currentLocation) {
            initializeTabs();
        }
    }, [currentLocation]);

    useEffect(() => {
        if (newTab) {
            const tabFound = tabs.findIndex(tab => tab.title == newTab.title);
            if (tabFound == -1) {
                setTabs(prevTabs => {
                    const updatedTabs = [...prevTabs, newTab];
                    return updatedTabs;
                });
            }

            const newActiveTab = (tabFound == -1) ? tabs.length : tabFound;

            if (windowRef.current && windowRef.current.switchTab) {
                windowRef.current.switchTab(newActiveTab);
            }
        }
    }, [newTab]);

    if (currentLocation == null) {
        return <Loading />;
    }

    const initializeTabs = () => {
        const defaultTabs = [
            {
                logoPath: "/vercel.svg",
                title: "Portfolio - Mikaël Léger",
                url: `${currentLocation}home`,
                content: (
                    <Portfolio addTab={addTab} />
                )
            },
            {
                logoPath: "/vercel.svg",
                title: "CV",
                url: `${currentLocation}curriculum-vitae`,
                content: (
                    <>
                        CV
                    </>
                )
            }
        ];
        setTabs(defaultTabs);
    }

    const addTab = (title: string, url: string, imgPath: string) => {
        const openTab = {
            logoPath: imgPath,
            title,
            url,
            content: (
                <iframe
                    src={url}>
                </iframe>
            )
        };
        setNewTab(openTab);
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
    ];

    const removeTab = (index: number) => {
        setTabs(prevTabs => {
            const updatedTabs = [...prevTabs];
            updatedTabs.splice(index, 1);
            return updatedTabs;
        });
    }

    const windows: WindowProps[] = [
        {
            type: "command",
            lines: linesSection1,
            onFinish: () => setShowBrowser(true)
        },
        {
            type: "browser",
            tabs: tabs,
            removeTab: removeTab,
            hide: !showBrowser,
            ref: windowRef as RefObject<WindowRef>
        },
    ];

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
