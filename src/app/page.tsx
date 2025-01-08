"use client";

import { createRef, RefObject, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

import PageLayout from "./layouts/page-layout";
import CommandLine from "./interfaces/command-line.interface";
import Window, { WindowProps } from "./components/window/window";
import Loading from "./components/loading/loading";
import Projects from "./components/projects/projects";
import TabInterface from "./interfaces/tab.interface";
import WindowRef from "./interfaces/window-ref.interface";
import TaskBar from "./components/task-bar/task-bar";
import Booting from "./components/booting/booting";
import UserSession from "./components/user-session/user-session";
import Skills from "./components/skills/skills";
import Dekstop from "./components/desktop/dekstop";
import { useIsAnyReduced } from "./contexts/is-reduced";
import { useBodyOverflow } from "./contexts/body-overflow";

import "./home.scss";

gsap.registerPlugin(CSSRulePlugin);

const speedMap: { [key: string]: number } = {
    none: 0,
    fast: 1500,
};

const BASE_TIME_STARTING = speedMap[process.env.DEV_ANIMATION_SPEED || ""] ?? 4000;

export default function Home() {
    const { setOverflowY } = useBodyOverflow();
    const { listOfReduced } = useIsAnyReduced();

    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [tabs, setTabs] = useState<TabInterface[]>([]);
    const [windows, setWindows] = useState<WindowProps[]>([]);
    const [newTab, setNewTab] = useState<TabInterface | null>();
    const [isBooting, setIsBooting] = useState<boolean>(true);
    const [isBooted, setIsBooted] = useState<boolean>(false);

    const windowRefs = useRef<Record<number, WindowRef>>({});
    const lastUpdatedWindowRef = useRef<{ id: number } | null>(null);
    const lastOpenedWindowRef = useRef<{ id: number } | null>(null);
    const lastClosedWindowRef = useRef<{ id: number } | null>(null);
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
                    refreshWindows(id);
                    break;
                case "addTab":
                    addTab(payload);
                    break;
                case "removeTab":
                    removeTab(payload);
                    break;
                case "openWindow":
                    openWindow(id);
                    break;
                case "closeWindow":
                    closeWindow(id);
                    break;
                default:
                    break;
            }
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

        } else {
            const defaultWindows: WindowProps[] = [
                {
                    window_id: 0,
                    type: "browser",
                    tabs: tabs,
                    removeTab: removeTab,
                    zIndex: 300,
                    hide: true,
                    onAction: (action: string, payload?: any) => handleAction(0, action, payload)
                },
                {
                    window_id: 2,
                    type: "pdf",
                    zIndex: 200,
                    hide: true,
                    onAction: (action: string, payload?: any) => handleAction(2, action, payload)
                },
                {
                    window_id: 3,
                    type: "mail",
                    zIndex: 100,
                    hide: true,
                    onAction: (action: string, payload?: any) => handleAction(3, action, payload)
                },
                {
                    window_id: 4,
                    type: "portfolio",
                    zIndex: 400,
                    hide: true,
                    onAction: (action: string, payload?: any) => handleAction(4, action, payload)
                }
            ];

            lastUpdatedWindowRef.current = { id: 4 };
            setWindows(defaultWindows);

            usedDefaultTabs.current = true;
            return;
        }
        if (newTab != null) {
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

        if (windows[0]) {
            const higherIndexWindow = windows.reduce((max, current) => (current.zIndex > max.zIndex ? current : max), windows[0]);
            const newOverflowY = (higherIndexWindow.window_id === 4) ? "auto" : "hidden";
            setOverflowY(newOverflowY);
        }

        const browserWindow = windows.find(window => window.window_id == 0);

        // TODO: use better condition
        if (browserWindow && newTabIndex.current >= 0) {

            handleWindowAction(0, "switchTab", "browser", newTabIndex.current);
            newTabIndex.current = -1;
        }
        const lastClosedId = lastClosedWindowRef.current?.id;
        if (lastClosedId) {
            removeLastFromOrder(lastClosedId);
            lastClosedWindowRef.current = null;
        }

        const window_id = lastOpenedWindowRef.current?.id;
        if (window_id == null) {
            return;
        }
        const windowRef = windowRefs.current[window_id];

        windowRef?.windowLogic?.animateOpenWindow?.(listOfReduced.includes(window_id));

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
                    hide: windowLogic.hide,
                    tabs: windowLogic.tabs as TabInterface[],
                    removeTab: removeTab,
                    onAction: (action: string, payload?: any) => handleAction(id, action, payload)
                }
            } else if (windowLogic.type == "pdf") {
                return {
                    window_id: id,
                    type: "pdf",
                    zIndex: windowLogic.zIndex,
                    hide: windowLogic.hide,
                    onAction: (action: string, payload?: any) => handleAction(id, action, payload)
                }
            } else if (windowLogic.type == "mail") {
                return {
                    window_id: id,
                    type: "mail",
                    zIndex: windowLogic.zIndex,
                    hide: windowLogic.hide,
                    onAction: (action: string, payload?: any) => handleAction(id, action, payload)
                }
            } else if (windowLogic.type == "portfolio") {
                return {
                    window_id: id,
                    type: "portfolio",
                    zIndex: windowLogic.zIndex,
                    hide: windowLogic.hide,
                    onAction: (action: string, payload?: any) => handleAction(id, action, payload)
                }
            }
            return {
                window_id: id,
                type: "command",
                zIndex: windowLogic.zIndex,
                hide: windowLogic.hide,
                lines: windowLogic.lines as CommandLine[],
                onAction: (action: string, payload?: any) => handleAction(id, action, payload)
            }
        });
    }

    const refreshWindows = (window_id: number) => {
        lastUpdatedWindowRef.current = { id: window_id };

        setWindows(prevWindows => {
            return [...prevWindows];
        })
    }

    const removeLastFromOrder = (window_id: number) => {
        setWindows(prevWindows => {
            let currentWindows = [...prevWindows];

            const updatedWindows = currentWindows.map(item =>
                ({ ...item, zIndex: Math.max(item.zIndex + 100, 0) })
            );

            const windowIndex = updatedWindows.findIndex(window => window.window_id == window_id);
            if (windowIndex != -1) {
                updatedWindows[windowIndex].zIndex = 0;
            }

            return updatedWindows;
        });
    }

    const setWindowsOrder = () => {
        if (!lastUpdatedWindowRef.current) {
            return;
        }

        const { id } = lastUpdatedWindowRef.current;

        lastUpdatedWindowRef.current = null;

        const higherWindow = windows.reduce((max, current) => (current.zIndex > max.zIndex ? current : max), windows[0]);

        if (higherWindow && higherWindow.zIndex != 0 && higherWindow.window_id == id) {
            return;
        }
        setWindows(prevWindows => {
            let currentWindows = [...prevWindows];

            const updatedWindows = currentWindows.map(item =>
                ({ ...item, zIndex: Math.max(item.zIndex - 100, 0) })
            );

            const windowIndex = updatedWindows.findIndex(window => window.window_id == id);
            if (windowIndex != -1) {
                updatedWindows[windowIndex].zIndex = windows.length * 100;
            }

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

    const addPortfolio = () => {
        lastUpdatedWindowRef.current = { id: 4 };
        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            updatedWindows.push({
                window_id: 4,
                type: "portfolio",
                zIndex: 0,
                onAction: (action: string, payload?: any) => handleAction(4, action, payload)
            });

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
                    openWindow(4);
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
                setNewTab(null);
            }
        }
    }, [newTab]);
    const getDefaultTabs = (): TabInterface[] => ([
        {
            defaultTab: true,
            logoPath: "/icons/projects.png",
            title: "Projects",
            url: `${currentLocation}projects`,
            content: (
                <Projects addTab={addTab} />
            )
        },
        {
            defaultTab: true,
            logoPath: "/icons/tree.png",
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
        openWindow(0);
    }

    const openWindow = (window_id: number, tabName: string | null = null) => {
        lastOpenedWindowRef.current = { id: window_id };

        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];

            const windowFound = updatedWindows.find(window => window.window_id == window_id);

            if (windowFound) {
                windowFound.hide = false;

                if (tabName != null) {
                    const tabFound = windowFound.tabs?.find(tab => tab.title === tabName)

                    if (tabFound != null) {
                        setNewTab(tabFound);

                    } else {
                        const defaultTabs = getDefaultTabs();
                        const defaultTabFound = defaultTabs.find(defaultTab => defaultTab.title === tabName);

                        setNewTab(defaultTabFound);
                    }
                }
            }
            lastUpdatedWindowRef.current = { id: window_id };

            return updatedWindows;
        });
    }

    const deleteWindow = (window_id: number) => {
        const windowRef = windowRefs.current[window_id];
        windowRef.windowLogic.animateHideWindow?.();
        delete windowRefs.current[window_id];

        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            const windowIndex = windows.findIndex(window => window.window_id === window_id);
            if (windowIndex != -1) {
                updatedWindows.splice(windowIndex, 1);
            }
            return updatedWindows;
        });
    }

    const closeWindow = (window_id: number) => {
        const windowRef = windowRefs.current[window_id];
        windowRef.windowLogic.animateHideWindow?.();
        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];
            const windowIndex = windows.findIndex(window => window.window_id === window_id);
            if (windowIndex != -1) {
                updatedWindows[windowIndex].hide = true;
            }
            lastClosedWindowRef.current = { id: window_id };
            return updatedWindows;
        })
    }

    const desktopOpenActions = (action: string, payload?: any) => {
        switch (action) {
            case "openWindow":
                const { id, name } = payload;
                const windowRef = windowRefs.current[id];

                if (windowRef) {
                    openWindow(id, name);

                } else {
                    switch (id) {
                        case 1:
                            showCommand();
                            break;
                        case 4:
                            addPortfolio();
                            break;
                        default:
                            break;
                    }

                }
                break;
            case "closeWindow":
                if (payload === 4) {
                    deleteWindow(payload);
                } else {
                    closeWindow(payload);
                }
            case "reduce":
                removeLastFromOrder(payload);
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

    if (currentLocation == null) {
        return <Loading />;
    }

    return (
        <PageLayout>
            {homeTemplate()}
        </PageLayout>
    );
}
