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
import Loading from "../loading/loading";
import WindowRef from "@/app/interfaces/window-ref.interface";
import { useIsReduced } from "@/app/contexts/is-reduced";

import "./window.scss";

export type WindowProps =
	| {
		type: "browser";
		tabs: TabInterface[];
		removeTab: (index: number) => void;
		lines?: never;
		onFinish?: () => void;
		hide?: boolean;
		ref?: RefObject<WindowRef>;
	}
	| {
		type: "command";
		lines: CommandLine[];
		tabs?: never;
		removeTab?: never;
		onFinish?: () => void;
		hide?: boolean;
		ref?: never;
	};


interface WindowDivProps extends React.HTMLProps<HTMLDivElement> {
	$preferences: Preferences;
	$isMaximized: boolean;
	$windowDetails: WindowDetails;
};

const WindowDiv = styled.div<WindowDivProps>`
  border-color: ${props => props.$preferences.color?.backgroundColor};
`;

let idCounter = 0;

export const Window = forwardRef<WindowRef, WindowProps>(
	({ type, tabs, lines, onFinish, removeTab, hide = false }, ref) => {

		const preferences = useContext(PreferencesContext) as Preferences;
		const ip = useContext(IPContext) as string;

		const [id, setId] = useState<number>();
		const [windowIconPath, setWindowIconPath] = useState<string>("");
		const [isMaximized, setIsMaximized] = useState<boolean>(true);
		const [isReducing, setIsReducing] = useState<boolean>(false);
		const [isIncreasing, setIsIncreasing] = useState<boolean>(false);
		const [isDragging, setIsDragging] = useState<boolean>(false);
		const { isReduced, setIsReduced } = useIsReduced();
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

		const windowRef = useRef<HTMLDivElement>(null);

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
			e.stopPropagation();
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

		const isBrowser = (type === 'browser');
		const browserLogic = isBrowser ? useBrowser(id, preferences) : null;

		useImperativeHandle(ref, () => ({
			switchTab: browserLogic?.switchTab,
		}));

		const [activeTabTmp, setActiveTabTmp] = useState<{ index: number, remove: boolean }>();

		useEffect(() => {
			if (browserLogic && activeTabTmp) {
				const newActiveTab = (browserLogic.activeTab == activeTabTmp.index) ? 0 : browserLogic.activeTab - 1;
				browserLogic.setActiveTab(newActiveTab);

				if (activeTabTmp.remove && removeTab) {
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

		const isCommand = (type === 'command');
		const commandLogic = isCommand ? useCommand(lines, id, onFinish, preferences, ip) : null;

		useEffect(() => {
			if (browserLogic) {
				setWindowIconPath(browserLogic.browserIconPath);
			} else if (isCommand) {
				setWindowIconPath("/icons/linux.png");
			}
		}, [browserLogic]);

		useEffect(() => {
			if (commandLogic && !commandLogic.isSimulationStarted && commandLogic.ipFormatted != null) {
				commandLogic.setIsSimulationStarted(true);
				const startedWithSuccess = commandLogic.startSimulation();
			}
		}, [commandLogic]);

		if ((commandLogic && !commandLogic.startSimulation) || !windowIconPath || hide) {
			return <Loading />;
		}

		const increaseWindow = () => {
			if (isReduced) {
				setIsReduced(false);
				setIsIncreasing(true);
			}
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

		return (
			<WindowDiv
				className={`window window-${type} window-${type}-${id}`}
				$preferences={preferences}
				$isMaximized={isMaximized}
				$windowDetails={windowDetails}
				onClick={increaseWindow}
				ref={windowRef}>
				<div
					className="window-header"
					onMouseDown={handleMouseDown}
					style={{ "backgroundColor": preferences.color?.backgroundColor, "color": preferences.color?.textColor }}>
					<div className="window-header-left">
						{isBrowser && browserLogic && (
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
												onclick={browserLogic.switchTab}
												removeTab={removeTabWindow}
												key={idx} />
										);
									})}
								</div>
							</>
						)}
						{isCommand && commandLogic && (
							<>
								<img className="window-header-left-logo logo-icon" src={windowIconPath} />
								<div className="window-header-left-text" >
									dev-user@ip-{commandLogic.ipFormatted}:{commandLogic.currentPath}
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
				{isBrowser && browserLogic && (
					<Bar preferences={preferences} tabs={tabs} activeTab={browserLogic.activeTab} />
				)}
				{isBrowser && browserLogic && (
					<div className={`window-content browser-content browser-${preferences.theme}`}>
						{tabs[browserLogic.activeTab].content}
					</div>
				)}
				{isCommand && commandLogic && (
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
);