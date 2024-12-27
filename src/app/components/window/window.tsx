import { forwardRef, Ref, RefObject, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";

import CommandLine from "@/app/interfaces/command-line.interface";
import PreferencesContext from "@/app/contexts/preferences-context";
import Preferences from "@/app/interfaces/preferences.interface";
import Tab from "../tab/tab";
import useBrowser from "../../hooks/browser";
import useCommand from "@/app/hooks/command";
import IPContext from "@/app/contexts/ip-context";
import Bar from "../bar/bar";
import TabInterface from "@/app/interfaces/tab.interface";
import WindowDetails from "@/app/interfaces/window-details.interface";
import WindowRef from "@/app/interfaces/window-ref.interface";
import { useIsReduced } from "@/app/contexts/is-reduced";
import UsernameContext from "@/app/contexts/username-context";

import "./window.scss";

export type WindowProps =
	| {
		window_id: number;
		type: "browser";
		zIndex: number;
		tabs: TabInterface[];
		removeTab: (index: number) => void;
		lines?: never;
		onFinish?: () => void;
		hide?: boolean;
		onAction: (action: string, payload?: any) => void;
		setWindowRef?: (id: number, ref: WindowRef) => void;
		windowRefs?: React.RefObject<Record<number, WindowRef>>;
	}
	| {
		window_id: number;
		type: "command";
		zIndex: number;
		lines: CommandLine[];
		tabs?: never;
		removeTab?: never;
		onFinish?: () => void;
		hide?: boolean;
		onAction: (action: string) => void;
		setWindowRef?: (id: number, ref: WindowRef) => void;
		windowRefs?: React.RefObject<Record<number, WindowRef>>;
	};


interface WindowDivProps extends React.HTMLProps<HTMLDivElement> {
	$preferences: Preferences;
	$zIndex: number;
};

const WindowDiv = styled.div<WindowDivProps>`
  border-color: ${props => props.$preferences.color?.backgroundColor};
  z-index: ${props => props.$zIndex}
`;

let idCounter = 0;

export default function Window({ type, zIndex, tabs, lines, onFinish, removeTab, onAction, windowRefs, setWindowRef, hide = false }: WindowProps) {
	const preferences = useContext(PreferencesContext) as Preferences;
	const ip = useContext(IPContext) as string;
	const username = useContext(UsernameContext) as string;

	const [id, setId] = useState<number>();
	const [windowIconPath, setWindowIconPath] = useState<string>("");
	const [isMaximized, setIsMaximized] = useState<boolean>(true);
	const [isReducing, setIsReducing] = useState<boolean>(false);
	const [isIncreasing, setIsIncreasing] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [windowDetails, setWindowDetails] = useState<WindowDetails>({
		width: '60vw',
		height: '60vh',
		offsetX: 250,
		offsetY: 250,
		cursorStartX: 0,
		cursorStartY: 0,
		initialOffsetX: 0,
		initialOffsetY: 0
	});
	const { isReduced, setIsReduced } = useIsReduced();

	const windowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (id == null || !setWindowRef) {
			return;
		}
		const windowLogic = {
			type,
			zIndex,
			tabs,
			lines,
		}

		if (windowRefs && windowRefs.current[id]) {
			windowRefs.current[id] = { windowLogic, browserLogic, commandLogic };
		} else {
			setWindowRef(id, { windowLogic, browserLogic, commandLogic });
		}

	}, [id, type, zIndex, tabs, lines, setWindowRef, windowRefs]);

	const generatedId = useMemo(() => {
		if (process.env.NODE_ENV == 'production') return idCounter++;
		return idCounter++ / 2;
	}, []);

	useEffect(() => {
		if (generatedId != null) {
			setId(generatedId);
		}
	}, [generatedId]);

	useEffect(() => {
		if (windowRef && windowRef.current) {
			if (!isMaximized) {
				windowRef.current.style.left = `${windowDetails.offsetX}px`;
				windowRef.current.style.top = `${windowDetails.offsetY}px`;
			}
		}
	}, [windowDetails]);

	useEffect(() => {
		if (windowRef && windowRef.current) {
			if (isMaximized) {
				gsap.to(document.querySelector(`.window-${type}-${id}`), {
					duration: .2,
					left: 0,
					top: 0,
					width: '100vw',
					minHeight: '100vh',
					ease: "sine.in"
				});
			} else {
				gsap.to(document.querySelector(`.window-${type}-${id}`), {
					duration: .2,
					left: `${windowDetails.offsetX}px`,
					top: `${windowDetails.offsetY}px`,
					width: windowDetails.width,
					minHeight: windowDetails.height,
					ease: "sine.in"
				});
			}
		}
	}, [isMaximized]);

	useEffect(() => {
		if (id != null && isReducing) {
			const timeline = gsap.timeline();
			const newLeft = -28 + (id * 16) + 'vw';
			timeline.to(document.querySelector(`.window-${type}-${id}`), {
				duration: .7,
				scale: 0.1,
				left: newLeft,
				top: '40vh',
				width: isMaximized ? '' : '100vw',
				minHeight: isMaximized ? '' : '100vh',
				ease: "sine.in"
			});
			timeline.to(document.querySelector(`.window-${type}-${id} .window-reduced-logo`), {
				duration: .2,
				opacity: .8,
				ease: "sine.in"
			});

			const totalDuration = timeline.totalDuration();
			setTimeout(() => {
				setIsReducing(false);
				setIsReduced(true);
			}, totalDuration * 1000);
		}
	}, [isReducing]);

	useEffect(() => {
		if (id != null && isIncreasing) {
			const newLeft = (isMaximized) ? 0 : windowDetails.offsetX;
			const newTop = (isMaximized) ? 0 : windowDetails.offsetY;

			const timeline = gsap.timeline();
			timeline.to(document.querySelector(`.window-${type}-${id} .window-reduced-logo`), {
				duration: .2,
				opacity: 0,
				ease: "sine.in"
			});
			const oldLeft = -28 + (id * 16) + 'vw';
			timeline.fromTo(document.querySelector(`.window-${type}-${id}`), {
				left: oldLeft,
				top: "40vh",
			}, {
				duration: .7,
				scale: 1,
				left: newLeft,
				top: newTop,
				width: isMaximized ? '' : '60vw',
				minHeight: isMaximized ? '' : '60vh',
				ease: "sine.in"
			});

			const totalDuration = timeline.totalDuration();
			setTimeout(() => {
				setIsIncreasing(false);
			}, totalDuration * 1000);
		}
	}, [isIncreasing]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (isMaximized) return;

		setIsDragging(true);
		setWindowDetails(prevWindowDetails => {
			const updatedWindow = {
				...prevWindowDetails,
				cursorStartX: e.clientX,
				cursorStartY: e.clientY
			};
			return updatedWindow;
		});
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging && windowRef.current) {
			setWindowDetails(prevWindowDetails => {
				const updatedWindow = {
					...prevWindowDetails,
					offsetX: e.clientX - prevWindowDetails.cursorStartX + prevWindowDetails.initialOffsetX,
					offsetY: e.clientY - prevWindowDetails.cursorStartY + prevWindowDetails.initialOffsetY
				};
				return updatedWindow;
			});
		}
	};

	const handleMouseUp = () => {
		setWindowDetails(prevWindowDetails => {
			const updatedWindow = {
				...prevWindowDetails,
				initialOffsetX: prevWindowDetails.offsetX,
				initialOffsetY: prevWindowDetails.offsetY
			};
			return updatedWindow;
		});
		setIsDragging(false);
	};

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	const browserLogic = useBrowser(type, hide, windowIconPath, tabs, id, preferences) as WindowRef["browserLogic"];

	const [activeTabTmp, setActiveTabTmp] = useState<{ index: number, remove: boolean }>();

	useEffect(() => {
		if (browserLogic && browserLogic.activeTab && activeTabTmp) {
			const newActiveTab = (browserLogic.activeTab == activeTabTmp.index) ? 0 : browserLogic.activeTab - 1;
			browserLogic.setActiveTab?.(newActiveTab);

			if (activeTabTmp.remove && removeTab) {
				onAction("removeTab");
				removeTab(activeTabTmp.index);
			}

		}
	}, [activeTabTmp])

	const removeTabWindow = (index: number) => {
		if (browserLogic) {
			setActiveTabTmp({
				index: index,
				remove: true
			});
		}
	}

	const commandLogic = useCommand(type, lines, id, onFinish, preferences, ip) as WindowRef["commandLogic"];

	useEffect(() => {
		if (browserLogic && browserLogic.browserIconPath != null) {
			setWindowIconPath(browserLogic.browserIconPath);

		} else if (commandLogic && !commandLogic.isNotCommand) {
			setWindowIconPath("/icons/linux.png");
		}
	}, [browserLogic]);

	useEffect(() => {
		if (commandLogic && !commandLogic.isSimulationStarted && commandLogic.ipFormatted != null && id != null) {
			commandLogic.setIsSimulationStarted?.(true);
			commandLogic.startSimulation?.();
		}
	}, [commandLogic]);

	if (hide || !windowIconPath) {
		return <></>;
	}

	const handleWindowClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isReduced) {
			return;
		}
		// e.stopPropagation();
		increaseWindow();
	}

	const handleWindowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isReduced) {
			return;
		}
		onAction("putWindowOnTop");
	}

	const increaseWindow = () => {
		setIsReduced(false);
		setIsIncreasing(true);
	}

	const actionsList = [
		{
			name: "reduce",
			onClick: () => setIsReducing(true)
		},
		{
			name: "minimize",
			onClick: () => setIsMaximized(false),
			hide: !isMaximized
		},
		{
			name: "maximize",
			onClick: () => setIsMaximized(true),
			hide: isMaximized
		},
		{
			name: "close",
			onClick: () => { }
		}
	];

	if (type == "browser" && (!tabs || tabs.length == 0) || !browserLogic || !commandLogic) {
		return <></>;
	}

	return (
		<WindowDiv
			className={`window window-${type} window-${type}-${id}`}
			$preferences={preferences}
			$zIndex={zIndex}
			onMouseDown={handleWindowMouseDown}
			onClick={handleWindowClick}
			ref={windowRef}>
			<div
				className="window-header"
				onMouseDown={handleMouseDown}
				style={{ "backgroundColor": preferences.color?.backgroundColor, "color": preferences.color?.textColor }}>
				<div className="window-header-left">
					{!browserLogic.isNotBrowser && browserLogic.switchTab && tabs && (
						<>
							<img className="window-header-left-logo logo-icon" src={windowIconPath} />
							<div className="window-header-left-tabs">
								{tabs.map((tabValue, idx) => {
									if (tabValue.logoPath == null) {

									}
									return (
										<Tab
											preferences={preferences}
											logoPath={tabValue.logoPath}
											title={tabValue.title}
											active={browserLogic.activeTab == idx}
											index={idx}
											onclick={() => browserLogic.switchTab?.(idx)}
											removeTab={removeTabWindow}
											key={idx} />
									);
								})}
							</div>
						</>
					)}
					{!commandLogic.isNotCommand && (
						<>
							<img className="window-header-left-logo logo-icon" src={windowIconPath} />
							<div className="window-header-left-text" >
								{username}@ip-{commandLogic.ipFormatted}:{commandLogic.currentPath}
							</div>
						</>
					)}
				</div>
				<div className="window-header-actions">
					{
						actionsList.map(action => {
							if (action.hide) return null;
							return (
								<div
									className="window-header-actions-action"
									key={action.name}
									style={{ "backgroundColor": preferences.color?.backgroundColor }}
									onClick={() => action.onClick()}>
									<img
										className={`window-header-actions-action-${action.name} logo-icon`}
										src={`/icons/${action.name}.png`}
										style={{ filter: preferences.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
								</div>
							);
						})
					}
				</div>
			</div>
			{!browserLogic.isNotBrowser && tabs && browserLogic.activeTab != null && (
				<Bar preferences={preferences} tabs={tabs} activeTab={browserLogic.activeTab} />
			)}
			{!browserLogic.isNotBrowser && tabs && browserLogic.activeTab != null && browserLogic.isCurrentTabPortfolio && (
				<div className={`window-content browser-content browser-${preferences.theme} ${browserLogic.isCurrentTabPortfolio() ? "special-bg" : ''}`}>
					{tabs[browserLogic.activeTab].content}
				</div>
			)}
			{!commandLogic.isNotCommand && commandLogic.contentNodes && (
				<div className={`window-content command-content`}>
					{commandLogic.contentNodes.map((node, idx) => (
						<span key={idx}>{node}</span>
					))}
				</div>
			)}
			{(isReducing || isReduced || isIncreasing) && (
				<div className="window-reduced">
					<img className="window-reduced-logo" src={windowIconPath} />
				</div>
			)}
		</WindowDiv>
	);
}