import TabInterface from "./tab.interface";
import CommandLine from "./command-line.interface";

export default interface WindowRef {
    windowLogic: {
        type: string;
        zIndex: number;
        tabs?: TabInterface[];
        lines?: CommandLine[];
        hide?: boolean;
        isReduced?: boolean;
        isMaximized?: boolean;
        removeTab?: (index: number) => void;
        animateHideWindow?: () => number;
        animateOpenWindow?: (isReduced?: boolean) => void;
    }
    browserLogic?: {
        activeTab?: number;
        setActiveTab?: (value: number) => void;
        browserIconPath?: string;
        switchTab?: (value: number) => void;
        animateOpenBrowser?: () => void;
        isNotBrowser?: boolean;
        isCurrentTabPortfolio?: () => boolean;
    },
    commandLogic?: {
        contentNodes?: React.ReactNode[];
        currentPath?: string;
        ipFormatted?: string;
        isSimulationStarted?: boolean;
        setIsSimulationStarted?: (value: boolean) => void;
        startSimulation?: () => void;
        animateOpenCommand?: () => void;
        isNotCommand?: boolean;
    },
    pdfLogic?: {
        isNotPdf?: boolean;
    }
}
