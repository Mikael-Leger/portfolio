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
import Favorites from "../favorites/favorites";
import usePdf from "@/app/hooks/pdf";

import "./window.scss";

export type WindowProps =
	| {
		window_id: number;
		type: "browser" | "command" | "pdf";
		zIndex: number;
		onAction: (action: string, payload?: any) => void;
		tabs?: TabInterface[];
		removeTab?: (index: number) => void;
		lines?: CommandLine[];
		onFinish?: () => void;
		hide?: boolean;
		setWindowRef?: (id: number, ref: WindowRef) => void;
		windowRefs?: React.RefObject<Record<number, WindowRef>>;
		getDefaultTabs?: () => TabInterface[];
		desktopOpenActions?: (action: string, payload?: any) => void;
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

export default function Window({ window_id, type, zIndex, tabs, lines, onFinish, removeTab, onAction, windowRefs, setWindowRef, getDefaultTabs, desktopOpenActions, hide = false }: WindowProps) {
	const preferences = useContext(PreferencesContext) as Preferences;
	const ip = useContext(IPContext) as string;
	const username = useContext(UsernameContext) as string;

	// const [window_id, setId] = useState<number>();
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

	const animateOpenWindow = () => {
		if (windowRefs?.current[window_id]) {
			if (isReduced) {
				increaseWindow();
				return;
			} else {
				return;
			}
		}

		const timeline = gsap.timeline();
		timeline.fromTo(`.window-${type}-${window_id}`, {
			opacity: 0,
			scale: .2,
			display: 'none'
		}, {
			duration: .2,
			opacity: 1,
			scale: 1,
			display: 'flex'
		})
		return timeline.totalDuration();
	}

	const animateHideWindow = () => {
		const timeline = gsap.timeline();
		timeline.to(`.window-${type}-${window_id}`, {
			duration: .2,
			opacity: 0,
			scale: .5,
			display: 'none'
		})
		return timeline.totalDuration();
	}

	useEffect(() => {
		if (window_id == null || !setWindowRef) {
			return;
		}
		const windowLogic = {
			type,
			zIndex,
			tabs,
			lines,
			animateOpenWindow,
			animateHideWindow
		}

		if (windowRefs && windowRefs.current[window_id]) {
			windowRefs.current[window_id] = { windowLogic, browserLogic, commandLogic, pdfLogic };
		} else {
			setWindowRef(window_id, { windowLogic, browserLogic, commandLogic, pdfLogic });
		}

	}, [window_id, type, zIndex, tabs, lines, setWindowRef, windowRefs]);

	// const generatedId = useMemo(() => {
	// 	if (process.env.NODE_ENV == 'production') return idCounter++;
	// 	return idCounter++ / 2;
	// }, []);

	// useEffect(() => {
	// 	if (generatedId != null) {
	// 		setId(generatedId);
	// 	}
	// }, [generatedId]);

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
				gsap.to(document.querySelector(`.window-${type}-${window_id}`), {
					duration: .2,
					left: 0,
					top: 0,
					width: '100vw',
					minHeight: '100vh',
					ease: "sine.in"
				});
			} else {
				gsap.to(document.querySelector(`.window-${type}-${window_id}`), {
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
		if (window_id != null && isReducing) {
			const timeline = gsap.timeline();
			const newLeft = -28 + (window_id * 16) + 'vw';
			timeline.to(document.querySelector(`.window-${type}-${window_id}`), {
				duration: .7,
				scale: 0.1,
				left: newLeft,
				top: '40vh',
				width: isMaximized ? '' : '100vw',
				minHeight: isMaximized ? '' : '100vh',
				ease: "sine.in"
			});
			timeline.to(document.querySelector(`.window-${type}-${window_id} .window-reduced-logo`), {
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
		if (window_id != null && isIncreasing) {
			const newLeft = (isMaximized) ? 0 : windowDetails.offsetX;
			const newTop = (isMaximized) ? 0 : windowDetails.offsetY;

			const timeline = gsap.timeline();
			timeline.to(document.querySelector(`.window-${type}-${window_id} .window-reduced-logo`), {
				duration: .2,
				opacity: 0,
				ease: "sine.in"
			});
			const oldLeft = -28 + (window_id * 16) + 'vw';
			timeline.fromTo(document.querySelector(`.window-${type}-${window_id}`), {
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

	const browserLogic = useBrowser(type, hide, windowIconPath, tabs, window_id, preferences) as WindowRef["browserLogic"];

	const commandLogic = useCommand(type, lines, window_id, onFinish, preferences, ip) as WindowRef["commandLogic"];

	const pdfLogic = usePdf(type, hide, windowIconPath, window_id);

	useEffect(() => {
		if (browserLogic && !browserLogic.isNotBrowser && browserLogic.browserIconPath != null) {
			setWindowIconPath(browserLogic.browserIconPath);

		} else if (commandLogic && !commandLogic.isNotCommand) {
			setWindowIconPath("/icons/linux.png");

		} else if (pdfLogic && !pdfLogic.isNotPdf) {
			setWindowIconPath("/icons/pdf.png");

		}
	}, [browserLogic, commandLogic, pdfLogic]);

	useEffect(() => {
		if (commandLogic && !commandLogic.isSimulationStarted && commandLogic.ipFormatted != null && window_id != null) {
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
			hide: !isMaximized || type == "pdf"
		},
		{
			name: "maximize",
			onClick: () => setIsMaximized(true),
			hide: isMaximized
		},
		{
			name: "close",
			onClick: () => {
				desktopOpenActions?.("closeWindow", window_id);
			}
		}
	];

	if ((type == "browser" && (!tabs || tabs.length == 0)) || !browserLogic || !commandLogic || !pdfLogic) {
		return <></>;
	}

	const onActionWindowCheck = (action: string, payload?: any) => {
		if (action === "removeTab" && browserLogic.activeTab != null && browserLogic.activeTab >= payload) {
			const newIndex = browserLogic.activeTab - 1;
			browserLogic.setActiveTab?.(newIndex);
			localStorage.setItem("active-tab", newIndex.toString());
		}
		onAction(action, payload);
	}

	return (
		<WindowDiv
			className={`window window-${type} window-${type}-${window_id}`}
			$preferences={preferences}
			$zIndex={zIndex}
			onMouseDown={handleWindowMouseDown}
			onClick={handleWindowClick}
			ref={windowRef}>
			<div className="window-header" style={{ "color": preferences.color?.textColor }}>
				<div
					className="window-header-head"
					onMouseDown={handleMouseDown}
					style={{ "backgroundColor": preferences.color?.backgroundColor }}>
					<div className="window-header-head-left">
						{!browserLogic.isNotBrowser && browserLogic.switchTab && tabs && (
							<>
								<img className="window-header-head-left-logo logo-icon" src={windowIconPath} />
								<div className="window-header-head-left-tabs">
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
												onAction={onActionWindowCheck}
												key={idx} />
										);
									})}
								</div>
							</>
						)}
						{!commandLogic.isNotCommand && (
							<>
								<img className="window-header-head-left-logo logo-icon" src={windowIconPath} />
								<div className="window-header-head-left-text" >
									{username}@ip-{commandLogic.ipFormatted}:{commandLogic.currentPath}
								</div>
							</>
						)}
						{!pdfLogic.isNotPdf && (
							<>
								<img className="window-header-head-left-logo logo-icon" src={windowIconPath} />
								<div className="window-header-head-left-text" >
									PDF Viewer
								</div>
							</>
						)}
					</div>
					<div className="window-header-head-actions">
						{
							actionsList.map(action => {
								if (action.hide) return null;
								return (
									<div
										className="window-header-head-actions-action"
										key={action.name}
										style={{ "backgroundColor": preferences.color?.backgroundColor }}
										onClick={() => action.onClick()}>
										<img
											className={`window-header-head-actions-action-${action.name} logo-icon`}
											src={`/icons/${action.name}.png`}
											style={{ filter: preferences.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
									</div>
								);
							})
						}
					</div>
				</div>
				{
					!browserLogic.isNotBrowser && tabs && browserLogic.activeTab != null && tabs[browserLogic.activeTab] && (
						<>
							<Bar preferences={preferences} tabs={tabs} activeTab={browserLogic.activeTab} />
							<Favorites preferences={preferences} getDefaultTabs={getDefaultTabs} onAction={onAction} />
						</>
					)
				}
			</div>
			{
				!browserLogic.isNotBrowser && tabs && browserLogic.activeTab != null && browserLogic.isCurrentTabPortfolio && tabs[browserLogic.activeTab] && (
					<div className={`window-content browser-content ${browserLogic.isCurrentTabPortfolio() ? "special-bg" : ''}`}>
						{tabs[browserLogic.activeTab].content}
					</div>
				)
			}
			{
				!commandLogic.isNotCommand && commandLogic.contentNodes && (
					<div className={`window-content command-content`}>
						{commandLogic.contentNodes.map((node, idx) => (
							<span key={idx}>{node}</span>
						))}
					</div>
				)
			}
			{
				!pdfLogic.isNotPdf && (
					<div className="window-content pdf-content">
						<iframe src="/pdf/CV_LEGER_Mikael.pdf" />
					</div>
				)
			}
			{
				(isReducing || isReduced || isIncreasing) && (
					<div className="window-reduced">
						<img className="window-reduced-logo" src={windowIconPath} />
					</div>
				)
			}
		</WindowDiv >
	);
}