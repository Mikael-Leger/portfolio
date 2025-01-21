"use client";

import { createRef, RefObject, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { useIsMobile } from "./contexts/mobile-context";
import { OverflowY } from "./types/overflow";
import Language from "./components/language/language";
import { useLanguage } from "./contexts/language-context";
import { TextByLanguage } from "./types/language";

import "./home.scss";
import BackgroundAnimation from "./components/background-animation/background-animation";

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
    const [windowsLocal, setWindowsLocal] = useState<Partial<WindowProps[]>>([]);
    const [newTab, setNewTab] = useState<TabInterface | null>();
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
        }
    }, []);

    useEffect(() => {
        const windowsLocalStr = localStorage.getItem("windows");
        if (windowsLocalStr) {
            const windowsLocal: Partial<WindowProps[]> = JSON.parse(windowsLocalStr);
            setWindowsLocal(windowsLocal);
        }

        const firstAnimation = localStorage.getItem("first-animation");
        if (firstAnimation) {
            setIsBooting(false);
        }
    }, []);

    useEffect(() => {
        if (windowsLocal != null) {
            const locationWithoutHash = window.location.href.split("#")[0];
            const newLocation = locationWithoutHash.slice(0, -1) + "#";

            setCurrentLocation(newLocation);
        }
    }, [windowsLocal]);

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
                createDefaultWindow(0, "browser"),
                createDefaultWindow(2, "pdf"),
                createDefaultWindow(3, "mail"),
                createDefaultWindow(4, "portfolio"),
                createDefaultWindow(5, "notepad")
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

    const createDefaultWindow = (windowId: number, type: "pdf" | "browser" | "command" | "mail" | "portfolio" | "notepad"): WindowProps => {
        const windowLocal = windowsLocal.find(windowLocal => windowLocal?.window_id === windowId);

        const defaultWindow: WindowProps = {
            window_id: windowId,
            type: type,
            tabs: type === "browser" ? tabs : undefined,
            removeTab: type === "browser" ? removeTab : undefined,
            zIndex: windowLocal?.zIndex ?? 300 - windowId * 50,
            hide: windowLocal?.hide ?? true,
            onAction: (action: string, payload?: any) => handleAction(windowId, action, payload),
            // ...(windowLocal?.isLocallyReduced != null && { isLocallyReduced: windowLocal.isLocallyReduced }),
            // ...(windowLocal?.isLocallyMaximized != null && { isLocallyMaximized: windowLocal.isLocallyMaximized })
        };

        return defaultWindow;
    };

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
        }
    }

    useEffect(() => {
        if (isBooted) {
            setWindowsToLocal();
        }
        setWindowsOrder();

        if (windows[0]) {
            const higherIndexWindow = windows.reduce((max, current) => (current.zIndex > max.zIndex ? current : max), windows[0]);
            let newOverflowY: OverflowY = "hidden";
            if (higherIndexWindow.window_id === 4) {
                newOverflowY = "auto";
            }

            setOverflowY(newOverflowY);
        }

        const browserWindow = windows.find(window => window.window_id == 0);

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

        windowRef?.windowLogic?.animateOpenWindow?.(listOfReduced.includes(window_id));

        lastOpenedWindowRef.current = null;

    }, [windows]);

    const setWindowsToLocal = () => {
        const filteredList = windows.map(({ window_id, zIndex, hide }) => {
            return ({ window_id, zIndex, hide })
        });

        const filteredListStr = JSON.stringify(filteredList);
        localStorage.setItem("windows", filteredListStr);
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

            const windowIndex = currentWindows.findIndex(window => window.window_id == window_id);
            const tmpZIndex = currentWindows[windowIndex].zIndex - 100;

            const updatedWindows = currentWindows.map(item =>
                ({ ...item, zIndex: item.zIndex == tmpZIndex ? item.zIndex + 100 : item.zIndex })
            );

            if (windowIndex != -1) {
                updatedWindows[windowIndex].zIndex -= 100;
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

            const windowIndex = currentWindows.findIndex(window => window.window_id == id);
            if (windowIndex != -1) {
                const tmpZIndex = currentWindows[windowIndex].zIndex;
                const updatedWindows = currentWindows.map(item =>
                    ({ ...item, zIndex: item.zIndex <= tmpZIndex ? item.zIndex : Math.max(item.zIndex - 100, 0) })
                );
                updatedWindows[windowIndex].zIndex = 500;
                return updatedWindows;
            }

            return prevWindows;
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
            const timeline = gsap.timeline();
            const startingDuration = BASE_TIME_STARTING / 1000;
            const beforeHome = CSSRulePlugin.getRule(".home::before");

            const firstAnimation = localStorage.getItem("first-animation");
            if (firstAnimation) {
                showDesktopAnimation(beforeHome, timeline);
            } else {
                showDesktopAnimation(beforeHome, timeline, startingDuration, .2);
            }
        }
    }, [currentLocation, isBooting]);

    useEffect(() => {
        if (isBooted) {
            const tabsLocalStr = localStorage.getItem("tabs");
            if (tabsLocalStr) {
                const tabsLocal = JSON.parse(tabsLocalStr) as TabInterface[];

                let tabsLocalError = false;

                const tabsLocalWithContent = tabsLocal.map(tabLocal => {
                    if (tabLocal.defaultTab) {
                        const defaultTabs = getDefaultTabs();

                        const defaultTabFound = defaultTabs.find(defaultTab => defaultTab.title === tabLocal.title);

                        if (defaultTabFound) return defaultTabFound;
                        tabsLocalError = true;
                    }
                    return getNewTab(tabLocal);
                });

                if (!tabsLocalError) {
                    setTabs(tabsLocalWithContent);
                } else {
                    localStorage.setItem("active-tab", "0");
                    setTabs(getDefaultTabs());
                }
            } else {
                localStorage.setItem("active-tab", "0");
                setTabs(getDefaultTabs());
            }

            const firstAnimation = localStorage.getItem("first-animation");
            if (!firstAnimation) {
                setTimeout(() => {
                    showCommand();
                }, 1000);
            } else {
                const hash = window.location.hash.slice(1);
                if (hash != "") {
                    setTimeout(() => {
                        openWindow(0);
                        const newTabIndexFound = getDefaultTabs().findIndex(tab => tab.title.toLowerCase() == hash);

                        if (newTabIndexFound != -1) {
                            handleWindowAction(0, "switchTab", "browser", newTabIndexFound);
                        }
                    }, 1000);
                } else {
                    if (windowsLocal != null) return;
                    setTimeout(() => {
                        openWindow(4);
                    }, 1000);
                }
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
            command: `locate portfolio`,
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
        openWindow(4);
        closeWindow(1);
    }

    const openWindow = (window_id: number, tabName: string | null = null) => {
        lastOpenedWindowRef.current = { id: window_id };

        setWindows(prevWindows => {
            const updatedWindows = [...prevWindows];

            const windowFound = updatedWindows.find(window => window.window_id == window_id);

            if (windowFound) {

                windowFound.hide = false;

                if (tabName != null) {
                    const tabFound = windowFound.tabs?.find(tab => tab.title === tabName);

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
        const duration = windowRef.windowLogic.animateHideWindow?.() ?? 0;

        setTimeout(() => {
            setWindows(prevWindows => {
                const updatedWindows = [...prevWindows];
                const windowIndex = windows.findIndex(window => window.window_id === window_id);
                if (windowIndex != -1) {
                    updatedWindows.splice(windowIndex, 1);
                }
                return updatedWindows;
            });

            delete windowRefs.current[window_id];
        }, duration * 1000);
    }

    const closeWindow = (window_id: number) => {
        const windowRef = windowRefs.current[window_id];
        const duration = windowRef.windowLogic.animateHideWindow?.() ?? 0;
        setTimeout(() => {
            setWindows(prevWindows => {
                const updatedWindows = [...prevWindows];
                const windowIndex = windows.findIndex(window => window.window_id === window_id);
                if (windowIndex != -1) {
                    updatedWindows[windowIndex].hide = true;
                }
                return updatedWindows;
            })
        }, duration * 1000);
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
                    <>
                        <div className="home-container">
                            <Dekstop
                                windows={windows}
                                setWindowRef={setWindowRef}
                                windowRefs={windowRefs}
                                getDefaultTabs={getDefaultTabs}
                                desktopOpenActions={desktopOpenActions} />
                        </div>
                        <BackgroundAnimation />
                    </>
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
