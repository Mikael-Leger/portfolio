import { Preferences } from "@/app/contexts/preferences-context";
import styled from "styled-components";

interface Tabprops {
    preferences: Preferences;
    logoPath: string;
    title: string;
    active: boolean;
    index: number;
    onclick: (index: number) => void;
}

interface TabDivProps extends React.HTMLProps<HTMLDivElement> {
    $active: boolean;
    $preferences: Preferences;
};

const TabDiv = styled.div<TabDivProps>`
    background-color: ${props => props.$active ? props.$preferences.color?.backgroundShadedColor : props.$preferences.color?.backgroundColor};
    transition: background-color 0.3s ease;
`;

export default function Tab({ preferences, logoPath, title, active, index, onclick }: Tabprops) {
    return (
        <TabDiv $active={active} $preferences={preferences} className={`window-header-left-tabs-tab ${active ? 'active' : ''}`} onClick={() => onclick(index)}>
            <div className="window-header-left-tabs-tab-header">
                <img className="window-header-left-tabs-tab-header-logo logo-icon" src={logoPath} />
                <div className="window-header-left-tabs-tab-header-text">
                    {title}
                </div>
            </div>
            <img className="window-header-left-tabs-tab-close logo-icon" src="/close_small.png" style={{ filter: preferences?.color?.textColor == 'white' ? 'invert(100%)' : '' }} />
            {active && (
                <div className="window-header-left-tabs-tab-neck" style={{ "backgroundColor": preferences?.color?.backgroundShadedColor }} />
            )}
        </TabDiv>
    );
}