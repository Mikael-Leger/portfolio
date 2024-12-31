"use client";

import { createRef, RefObject, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

import PageLayout from "./layouts/page-layout";
import CommandLine from "./interfaces/command-line.interface";
import Window, { WindowProps } from "./components/window/window";
import Loading from "./components/loading/loading";
import Portfolio from "./components/portfolio/portfolio";
import TabInterface from "./interfaces/tab.interface";
import WindowRef from "./interfaces/window-ref.interface";
import { IsReducedProvider } from "./contexts/is-reduced";
import TaskBar from "./components/task-bar/task-bar";
import Booting from "./components/booting/booting";
import UserSession from "./components/user-session/user-session";
import Welcome from "./components/welcome/welcome";
import Skills from "./components/skills/skills";
import Dekstop from "./components/desktop/dekstop";

import "./home.scss";

gsap.registerPlugin(CSSRulePlugin);

const speedMap: { [key: string]: number } = {
    none: 0,
    fast: 1500,
};

const BASE_TIME_STARTING = speedMap[process.env.DEV_ANIMATION_SPEED || ""] ?? 4000;

export default function Home() {
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [tabs, setTabs] = useState<TabInterface[]>([]);
    const [windows, setWindows] = useState<WindowProps[]>([]);
    const [newTab, setNewTab] = useState<TabInterface>();
    const [isBooting, setIsBooting] = useState<boolean>(true);
    const [isBooted, setIsBooted] = useState<boolean>(false);

    const windowRefs = useRef<Record<number, WindowRef>>({});
    const lastUpdatedWindowRef = useRef<{ id: number } | null>(null);
    const lastOpenedWindowRef = useRef<{ id: number } | null>(null);
    const newTabIndex = useRef<number>(-1);
    const usedDefaultTabs = useRef<boolean>(false);

    const setWindowRef = (id: number, ref: WindowRef) => {
        windowRefs.current[id] = ref;
    };

    const handleAction = useCallback((id: number, action: string, payload?: any) => {
        const windowRef = windowRefs.current[id];

        if (windowRef) {
            switch (action) {
                case "putWindowOnTop":
                    putWindowOnTop(id);
                    break;
                case "addTab":
                    addTab(payload);
                    break;
                case "removeTab":
                    removeTab(payload);
                case "showPDF":
                    // showPDF();

                    openWindow(id);
                    break;
                default:
                    break;
            }
        } else if (action == "showPDF") {
            addPdf();
        } else {
            console.warn(`No ref found for window ${id}`);
        }
    }, []);

    useEffect(() => {
        const firstAnimation = localStorage.getItem("first-animation");
        setCurrentLocation(window.location.href);

        if (firstAnimation) {
            setIsBooting(false);
        }
    }, []);

    useEffect(() => {
        if (tabs.length === 0) {
            return;
        }
        const tabsLocalStr = JSON.stringify(tabs.map(tab => (
            { title: tab.title, url: tab.url, logoPath: tab.logoPath, defaultTab: tab.defaultTab }
        )));
        localStorage.setItem("tabs", tabsLocalStr);

        if (usedDefaultTabs.current) {
            setWindows(prevWindows => {
                let updatedWindows = [...prevWindows];

                const windowIndex = updatedWindows.findIndex(window => window.window_id == 0);
                updatedWindows[windowIndex].tabs = tabs;

                return updatedWindows;
            });

        } else if (newTab == null) {
            const defaultWindows: WindowProps[] = [];
            defaultWindows.push(
                {
                    window_id: 0,
                    type: "browser",
                    tabs: tabs,
                    removeTab: removeTab,
                    hide: true,
                    zIndex: 0,
                    onAction: (action: string, payload?: any) => handleAction(0, action, payload)
                });
            lastUpdatedWindowRef.current = { id: 0 };
            setWindows(defaultWindows);

            usedDefaultTabs.current = true;

        } else {
            const newActiveTab = tabs.length - 1;
            newTabIndex.current = newActiveTab;
            setWindows(prevWindows => {
                let updatedWindows = [...prevWindows];

                const windowIndex = updatedWindows.findIndex(window => window.window_id == 0);
                updatedWindows[windowIndex].tabs = tabs;

                return updatedWindows;
            });
        }
    }, [tabs]);

    const handleWindowAction = (id: number, action: string, type: string = "", payload: any = {}) => {
        const windowRef = windowRefs.current[id];
        if (windowRef) {
            if (action == "windowLogic") return windowRef.windowLogic;
            switch (type) {
                case "browser":
                    const browserLogic = windowRef.browserLogic;
                    if (!browserLogic) break;

                    type BrowserLogicAction = keyof NonNullable<WindowRef['browserLogic']>;
                    const actionBrowser = action as BrowserLogicAction;

                    if (typeof browserLogic[actionBrowser] === "function") {
                        return (browserLogic[actionBrowser] as (payload?: any) => void)(payload);
                    }
                    return browserLogic[actionBrowser];
                case "command":
                    const commandLogic = windowRef.commandLogic;
                    if (!commandLogic) break;

                    type CommandLogicAction = keyof NonNullable<WindowRef['commandLogic']>;
                    const actionCommand = action as CommandLogicAction;

                    if (typeof commandLogic[actionCommand] === "function") {
                        return (commandLogic[actionCommand] as () => void)();
                    }
                    return commandLogic[actionCommand];
                default:
                    const windowLogic = windowRef.windowLogic;
                    type LogicAction = keyof NonNullable<WindowRef['windowLogic']>;
                    const actionLogic = action as LogicAction;
                    if (typeof windowLogic[actionLogic] === "function") {
                        return (windowLogic[actionLogic] as () => void)();
                    }
                    return windowLogic[actionLogic];
            }
        } else {
            console.warn(`No ref found for window 0`);
        }
    }

    useEffect(() => {
        setWindowsOrder();

        const browserWindow = windows.find(window => window.type == "browser");

        // TODO: use better condition
        if (browserWindow && newTabIndex.current >= 0) {

            handleWindowAction(0, "switchTab", "browser", newTabIndex.current);
            newTabIndex.current = -1;
        }

        const window_id = lastOpenedWindowRef.current?.id;
        if (window_id == null) {
            return;
        }
        const windowRef = windowRefs.current[window_id];

        if (windowRef == null) {
            openWindowById(window_id);

        } else {
            windowRef.windowLogic.animateOpenWindow?.();

        }

        lastOpenedWindowRef.current = null;

    }, [windows]);

    const getWindowsByRefs = (): WindowProps[] => {
        return Object.entries(windowRefs.current).map(([key, value]) => {
            const id = parseInt(key);
            const windowLogic = handleWindowAction(id, "windowLogic") as WindowRef["windowLogic"];
            if (windowLogic.type == "browser") {
                return {
                    window_id: id,
                    type: "browser",
                    zIndex: windowLogic.zIndex,
                    tabs: windowLogic.tabs as TabInterface[],
                    removeTab: removeTab,
                    onAction: (action: string, payload?: any) => handleAction(id, action, payload)
                }
            } else if (windowLogic.type == "pdf") {
                return {
                    window_id: id,
                    type: "pdf",
                    zIndex: windowLogic.zIndex,
                    onAction: (action: string, payload?: any) => handleAction(2, action, payload)
                }
            }
            return {
                window_id: id,
                type: "command",
                zIndex: windowLogic.zIndex,
                lines: windowLogic.lines as CommandLine[],
                hide: windowLogic.hide,
                onAction: (action: string, payload?: any) => handleAction(id, action, payload)
            }
        });
    }

    const putWindowOnTop = (window_id: number) => {
        lastUpdatedWindowRef.current = { id: window_id };

        const windowsByRefs = getWindowsByRefs();

        setWindows(windowsByRefs);
    }

    const setWindowsOrder = () => {
        if (!lastUpdatedWindowRef.current) {
            return;
        }
        const { id } = lastUpdatedWindowRef.current;
        lastUpdatedWindowRef.current = null;

        const higherWindow = windows.reduce((max, current) => (current.zIndex > max.zIndex ? current : max), windows[0]);

        if (higherWindow.zIndex != 0 && higherWindow.window_id == id) {
            return;
        }

        setWindows(prevWindows => {
            let currentWindows = [...prevWindows];

            const updatedWindows = currentWindows.map(item =>
                ({ ...item, zIndex: Math.max(item.zIndex - 100, 0) })
            );

            const windowIndex = updatedWindows.findIndex(window => window.window_id == id);
            updatedWindows[windowIndex].zIndex = windows.length * 100;

            return updatedWindows;
        });
    }

    const showCommand = () => {
        lastUpdatedWindowRef.current = { id: 1 };
        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            updatedWindows.push({
                window_id: 1,
                type: "command",
                lines: linesSection1,
                onFinish: onFirstAnimationFinish,
                zIndex: 0,
                onAction: (action: string, payload?: any) => handleAction(1, action, payload)
            });
            return updatedWindows;
        });
    }

    const showBrowser = () => {
        lastUpdatedWindowRef.current = { id: 0 };

        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            const windowFound = updatedWindows.findIndex(window => window.type == "browser");
            updatedWindows[windowFound].hide = false;
            return updatedWindows;
        });
    }

    const addPdf = () => {
        lastUpdatedWindowRef.current = { id: 2 };
        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            updatedWindows.push({
                window_id: 2,
                type: "pdf",
                zIndex: 0,
                onAction: (action: string, payload?: any) => handleAction(2, action, payload)
            });
            return updatedWindows;
        });

    }

    const showPDF = () => {
        lastUpdatedWindowRef.current = { id: 2 };

        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            const windowFound = updatedWindows.findIndex(window => window.window_id == 2);

            updatedWindows[windowFound].hide = false;

            return updatedWindows;
        });
    }

    const showDesktopAnimation = (beforeHome: CSSRule, timeline: GSAPTimeline, startingDuration = 0, nextDuration = 0) => {
        timeline.to(beforeHome, {
            duration: startingDuration,
            opacity: 1,
            ease: "sine.in"
        });
        timeline.to(".task-bar-restart", {
            duration: nextDuration,
            opacity: 1,
            ease: "sine.in"
        });

        setTimeout(() => {
            setIsBooted(true);
        }, timeline.totalDuration() * 1000);
    }

    useEffect(() => {
        if (currentLocation && !isBooting) {
            const tabsLocalStr = localStorage.getItem("tabs");
            if (tabsLocalStr) {
                const tabsLocal = JSON.parse(tabsLocalStr) as TabInterface[];

                const tabsLocalWithContent = tabsLocal.map(tabLocal => {
                    if (tabLocal.defaultTab) {
                        const defaultTabs = getDefaultTabs();
                        const defaultTabFound = defaultTabs.find(defaultTab => defaultTab.title === tabLocal.title);
                        if (defaultTabFound) return defaultTabFound;
                    }
                    return getNewTab(tabLocal);
                });

                setTabs(tabsLocalWithContent);
            }

            const timeline = gsap.timeline();
            const startingDuration = BASE_TIME_STARTING / 1000;
            const beforeHome = CSSRulePlugin.getRule(".home::before");

            const firstAnimation = localStorage.getItem("first-animation");
            if (firstAnimation) {
                showDesktopAnimation(beforeHome, timeline);
                return;
            };

            showDesktopAnimation(beforeHome, timeline, startingDuration, .2);
        }
    }, [currentLocation, isBooting]);

    useEffect(() => {
        if (isBooted) {

            initializeTabs();

            const firstAnimation = localStorage.getItem("first-animation");
            if (!firstAnimation) {
                setTimeout(() => {
                    showCommand();
                }, 1000);
            } else {
                setTimeout(() => {
                    showBrowser();
                }, 1000);
            }
        }

    }, [isBooted]);

    useEffect(() => {
        if (newTab) {
            const tabFound = tabs.findIndex(tab => tab.title == newTab.title);
            if (tabFound == -1) {
                setTabs(prevTabs => {
                    const updatedTabs = [...prevTabs, newTab];
                    return updatedTabs;
                });
            } else {
                const newTabIndexFound = tabs.findIndex(tab => tab.title == newTab.title);
                handleWindowAction(0, "switchTab", "browser", newTabIndexFound);
            }
        }
    }, [newTab]);

    if (currentLocation == null) {
        return <Loading />;
    }

    const getDefaultTabs = (): TabInterface[] => ([
        {
            defaultTab: true,
            logoPath: "/vercel.svg",
            title: "Welcome - Mikaël Léger",
            url: `${currentLocation}home`,
            content: (
                <Welcome getDefaultTabs={getDefaultTabs} handleAction={handleAction} />
            )
        },
        {
            defaultTab: true,
            logoPath: "/vercel.svg",
            title: "Portfolio",
            url: `${currentLocation}portfolio`,
            content: (
                <Portfolio addTab={addTab} />
            )
        },
        {
            defaultTab: true,
            logoPath: "/vercel.svg",
            title: "Skills",
            url: `${currentLocation}skills`,
            content: (
                <Skills />
            )
        }
    ])

    const initializeTabs = () => {
        const defaultTabs = getDefaultTabs();
        const tabsLocalStr = localStorage.getItem("tabs");
        if (!tabsLocalStr) {
            setTabs(defaultTabs);
        }
    }

    const getNewTab = (tabData: TabInterface): TabInterface => {
        return {
            defaultTab: tabData.defaultTab,
            logoPath: tabData.logoPath,
            title: tabData.title,
            url: tabData.url,
            content: (
                <iframe
                    src={tabData.url}>
                </iframe>
            )
        };
    }

    const addTab = (tabData: TabInterface) => {
        if (tabData.defaultTab) {
            const defaultTabs = getDefaultTabs();
            const defaultTabFound = defaultTabs.find(defaultTab => defaultTab.title === tabData.title);
            if (defaultTabFound) {
                defaultTabFound.url = `${window.location.href}${defaultTabFound?.url}`;

                setNewTab(defaultTabFound);
            }
        } else {
            const openTab = getNewTab(tabData);

            setNewTab(openTab);
        }

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

    const onFirstAnimationFinish = () => {
        showBrowser();
    }

    const openWindow = (window_id: number) => {
        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            const windowFound = updatedWindows.find(window => window.window_id == window_id)
            if (windowFound) {
                windowFound.hide = false;
            }
            return updatedWindows;
        });
        putWindowOnTop(window_id);

        lastOpenedWindowRef.current = { id: window_id };
    }

    const closeWindow = (window_id: number) => {
        const windowRef = windowRefs.current[window_id];
        windowRef.windowLogic.animateHideWindow?.();
    }

    const openWindowById = (id: number) => {
        switch (id) {
            case 0:
                showBrowser();
                break;
            case 2:
                showPDF();
                break;
            default:
                break;
        }
    }

    const desktopOpenActions = (action: string, payload?: any) => {
        switch (action) {
            case "openWindow":
                openWindow(payload);
                break;
            case "closeWindow":
                closeWindow(payload);
                break;
            default:
                break;
        }
    }

    const homeTemplate = () => {
        if (isBooting) {
            return <Booting onFinish={() => setIsBooting(false)} />;
        }

        return (
            <div className="home">
                {isBooted ? (
                    <Dekstop
                        windows={windows}
                        setWindowRef={setWindowRef}
                        windowRefs={windowRefs}
                        getDefaultTabs={getDefaultTabs}
                        desktopOpenActions={desktopOpenActions} />
                ) : (
                    <div className="home-session">
                        <UserSession />
                    </div>
                )}
                <TaskBar />
            </div>
        )
    }

    return (
        <PageLayout>
            <IsReducedProvider>
                {homeTemplate()}
            </IsReducedProvider>
        </PageLayout>
    );
}
