import Preferences from "@/app/interfaces/preferences.interface";
import styled from "styled-components";

interface Tabprops {
    preferences: Preferences;
    logoPath: string;
    title: string;
    active: boolean;
    index: number;
    onclick: (index: number) => void;
    onAction: (action: string, payload?: any) => void;
}

interface TabDivProps extends React.HTMLProps<HTMLDivElement> {
    $active: boolean;
    $preferences: Preferences;
};

const TabDiv = styled.div<TabDivProps>`
    background-color: ${props => props.$active ? props.$preferences.color?.backgroundShadedColor : props.$preferences.color?.backgroundColor};
    transition: background-color 0.3s ease;
`;

export default function Tab({ preferences, logoPath, title, active, index, onclick, onAction }: Tabprops) {
    const removeTabWithoutPropagation = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
        event.stopPropagation();
        onAction("removeTab", index);
    }

    return (
        <TabDiv $active={active} $preferences={preferences} className={`window-header-head-left-tabs-tab ${active ? 'active' : ''}`} onClick={() => onclick(index)}>
            <div className="window-header-head-left-tabs-tab-header">
                <img className="window-header-head-left-tabs-tab-header-logo logo-icon" src={logoPath} />
                <div className="window-header-head-left-tabs-tab-header-text">
                    {title}
                </div>
            </div>
            {index != 0 && (
                <img
                    className="window-header-head-left-tabs-tab-close logo-icon"
                    src="/icons/close_small.png"
                    style={{ filter: preferences?.color?.textColor == 'white' ? 'invert(100%)' : '' }}
                    onClick={(e) => removeTabWithoutPropagation(e, index)} />
            )}
            {active && (
                <div className="window-header-head-left-tabs-tab-neck" style={{ "backgroundColor": preferences?.color?.backgroundShadedColor }} />
            )}
        </TabDiv>
    );
}