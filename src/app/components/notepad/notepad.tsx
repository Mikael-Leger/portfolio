import { RefObject, useEffect } from "react";

import "./notepad.scss";

type NotepadProps = {
};

export default function Notepad({ }: NotepadProps) {
    return (
        <div className="notepad">
            <div className="notepad-images">
                <a href="https://www.flaticon.com/free-icons/linux" title="linux icons">Linux icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/minus-button" title="minus button icons">Minus button icons created by Circlon Tech - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/minimize" title="minimize icons">Minimize icons created by Ranah Pixel Studio - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/maximize" title="maximize icons">Maximize icons created by Ranah Pixel Studio - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by ariefstudio - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by Bingge Liu - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/google-chrome" title="google chrome icons">Google chrome icons created by Pixel perfect - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/mozilla" title="mozilla icons">Mozilla icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/brands-and-logotypes" title="brands and logotypes icons">Brands and logotypes icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/opera" title="opera icons">Opera icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/safari" title="safari icons">Safari icons created by Stockio - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/back-arrow" title="back arrow icons">Back arrow icons created by Ilham Fitrotul Hayat - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Roundicons - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Icon mania - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/refresh" title="refresh icons">Refresh icons created by Arkinasi - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/minimize" title="minimize icons">Minimize icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/external-link" title="external link icons">External link icons created by Bharat Icons - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/restart" title="restart icons">Restart icons created by Nuricon - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/star" title="star icons">Star icons created by Pixel perfect - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/pdf" title="pdf icons">Pdf icons created by Dimitry Miroliubov - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/earth" title="earth icons">Earth icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/creativity" title="creativity icons">Creativity icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/email" title="email icons">Email icons created by ChilliColor - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/tree" title="tree icons">Tree icons created by Freepik - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/project" title="project icons">Project icons created by afitrose - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/france" title="france icons">France icons created by Sudowoodo - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/belgium" title="belgium icons">Belgium icons created by Waveshade_Studios - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/degree" title="degree icons">Degree icons created by Smashicons - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/code" title="code icons">Code icons created by Royyan Wijaya - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">Linkedin icons created by riajulislam - Flaticon</a>
                <a href="https://www.flaticon.com/free-icons/notepad" title="notepad icons">Notepad icons created by Freepik - Flaticon</a>
                <a href="https://fr.freepik.com/search?format=search&last_filter=query&last_value=treenode&query=treenode" title="Freepik">Treenode image provided by Freepik</a>
                <a href="https://pixabay.com/" title="planet images">Planet images provided by Pixabay</a>
            </div>
            <div className="notepad-copyright">
                © Copyright 2025 - Mikaël LÉGER. Tous droits réservés.
            </div>
        </div>
    );
}