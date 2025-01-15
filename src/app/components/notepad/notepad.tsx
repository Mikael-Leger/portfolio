import { RefObject, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/contexts/language-context";
import { TextByLanguage } from "@/app/types/language";

import "./notepad.scss";

type NotepadProps = {
};

export default function Notepad({ }: NotepadProps) {
    const { language, getTextsByComponent } = useLanguage();

    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("notepad");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }

    const openNewPage = (url: string) => {
        window.open(url, '_blank');
    }

    if (texts.length === 0) {
        return;
    }

    return (
        <div className="notepad">
            <div className="notepad-images">
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/linux")} title="linux icons">Linux {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/minus-button")} title="minus button icons">Minus button {getText(0)} Circlon Tech - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/minimize")} title="minimize icons">Minimize {getText(0)} Ranah Pixel Studio - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/maximize")} title="maximize icons">Maximize {getText(0)} Ranah Pixel Studio - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/close")} title="close icons">Close {getText(0)} ariefstudio - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/close")} title="close icons">Close {getText(0)} Bingge Liu - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/google-chrome")} title="google chrome icons">Google chrome {getText(0)} Pixel perfect - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/mozilla")} title="mozilla icons">Mozilla {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/brands-and-logotypes")} title="brands and logotypes icons">Brands and logotypes {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/opera")} title="opera icons">Opera {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/safari")} title="safari icons">Safari {getText(0)} Stockio - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/back-arrow")} title="back arrow icons">Back arrow {getText(0)} Ilham Fitrotul Hayat - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/next")} title="next icons">Next {getText(0)} Roundicons - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/next")} title="next icons">Next {getText(0)} Icon mania - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/refresh")} title="refresh icons">Refresh {getText(0)} Arkinasi - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/minimize")} title="minimize icons">Minimize {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/external-link")} title="external link icons">External link {getText(0)} Bharat Icons - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/restart")} title="restart icons">Restart {getText(0)} Nuricon - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/user")} title="user icons">User {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/star")} title="star icons">Star {getText(0)} Pixel perfect - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/pdf")} title="pdf icons">Pdf {getText(0)} Dimitry Miroliubov - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/earth")} title="earth icons">Earth {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/creativity")} title="creativity icons">Creativity {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/email")} title="email icons">Email {getText(0)} ChilliColor - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/tree")} title="tree icons">Tree {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/project")} title="project icons">Project {getText(0)} afitrose - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/france")} title="france icons">France {getText(0)} Sudowoodo - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/belgium")} title="belgium icons">Belgium {getText(0)} Waveshade_Studios - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/uk-flag")} title="uk flag icons">Uk flag {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/degree")} title="degree icons">Degree {getText(0)} Smashicons - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/code")} title="code icons">Code {getText(0)} Royyan Wijaya - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/linkedin")} title="linkedin icons">Linkedin {getText(0)} riajulislam - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/notepad")} title="notepad icons">Notepad {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/question")} title="question icons">Question {getText(0)} Freepik - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/arrows")} title="arrows icons">Arrows {getText(0)} Lagot Design - Flaticon</button>
                <button onClick={() => openNewPage("https://www.flaticon.com/free-icons/heart")} title="heart icons">Heart {getText(0)} Vlad Szirka - Flaticon</button>
                <button onClick={() => openNewPage("https://fr.freepik.com/search?format=search&last_filter=query&last_value=treenode&query=treenode")} title="Freepik">Treenode image {getText(1)} Freepik</button>
                <button onClick={() => openNewPage("https://pixabay.com/")} title="planet images">Planet images {getText(1)} Pixabay</button>
            </div>
            <div className="notepad-copyright">
                © Copyright 2025 - Mikaël LÉGER. {getText(2)}
            </div>
        </div>
    );
}