import { useEffect, useState } from "react";
import Loading from "../loading/loading";

import "./mail.scss";

type MailProps = {
    onAction: (action: string, payload?: any) => void;
};

export default function Mail({ onAction }: MailProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mailSent, setMailSent] = useState<{ status: string } | null>(null);

    const sendMail = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 400));
        setIsLoading(false);
        setMailSent({ status: "ok" });
    }

    const closeMail = () => {
        onAction("closeWindow");
        setMailSent(null)
    }

    return (
        <div className="mail">
            <div className="mail-container" style={{ opacity: isLoading || mailSent != null ? .5 : 1 }}>
                <div className="mail-container-header">
                    New message
                </div>
                <div className="mail-container-recipient">
                    To: <div className="mail-container-recipient-name">Mikaël Léger</div>
                </div>
                <div className="mail-container-sender">
                    <input type="email" placeholder="Email" disabled={isLoading || mailSent != null} />
                </div>
                <div className="mail-container-object">
                    <input type="text" placeholder="Object" disabled={isLoading || mailSent != null} />
                </div>
                <div className="mail-container-message">
                    <textarea placeholder="Message" disabled={isLoading || mailSent != null} />
                </div>
                <div className="mail-container-send">
                    <div className="mail-container-send-button" onClick={sendMail}>
                        send
                    </div>
                </div>
            </div>
            <div className="mail-message">
                {isLoading && (
                    <Loading />
                )}
                {mailSent?.status === "ok" && (
                    <div className="mail-message-container">
                        <div className="mail-message-container-text">
                            <img className="mail-message-container-text-icon" src="/icons/mail.png" />
                            E-mail sent with success!
                        </div>
                        <div className="mail-message-container-options">
                            <div className="mail-message-container-options-option" onClick={() => setMailSent(null)}>
                                Write another one?
                            </div>
                            <div className="mail-message-container-options-option" onClick={closeMail}>
                                Close window
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}