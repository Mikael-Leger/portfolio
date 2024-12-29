import TabInterface from "./tab.interface";
import CommandLine from "./command-line.interface";

export default interface WindowRef {
    windowLogic: {
        type: string;
        zIndex: number;
        tabs?: TabInterface[];
        lines?: CommandLine[];
        hide?: boolean;
        removeTab?: (index: number) => void;
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
