import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';

import Loading from "../loading/loading";
import FormContact from '@/app/interfaces/form-contact.interface';
import { useLanguage } from '@/app/contexts/language-context';
import { TextByLanguage } from '@/app/types/language';

import "./mail.scss";

type MailProps = {
    onAction: (action: string, payload?: any) => void;
};

export default function Mail({ onAction }: MailProps) {
    const { language, getTextsByComponent } = useLanguage();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mailStatus, setMailStatus] = useState<{ status: string } | null>(null);
    const [formData, setFormData] = useState<FormContact>({
        object: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        object: '',
        email: '',
        message: '',
    });
    const [texts, setTexts] = useState<TextByLanguage[]>([]);

    useEffect(() => {
        getTexts();
    }, []);

    const getTexts = () => {
        const texts = getTextsByComponent("mail");
        setTexts(texts);
    }

    const getText = (index: number) => {
        return texts[index][language];
    }

    useEffect(() => {
        if (mailStatus?.status != null) {
            setIsLoading(false);
        }

    }, [mailStatus?.status]);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'object':
                if (value.length === 0) {
                    return getText(12);
                }
                if (value.length > 50) {
                    return getText(13);
                }
                break;
            case 'email':
                if (value.length === 0) {
                    return getText(14);
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return getText(15);
                }
                break;
            case 'message':
                if (value.length === 0) {
                    return getText(16);
                }
                if (value.length > 1000) {
                    return getText(17);
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        if (isLoading) {
            return;
        }
        e.preventDefault();

        const newErrors = {
            object: validateField('object', formData.object),
            email: validateField('email', formData.email),
            message: validateField('message', formData.message),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error !== '');
        if (hasErrors) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ object: '', email: '', message: '' });
                setMailStatus({ status: "ok" });

            } else {
                setMailStatus({ status: "error" });

            }

            await new Promise(r => setTimeout(r, 400));
        } catch (e) {
            console.error("Error while sending email");

        }
    }

    const closeMail = () => {
        onAction("closeWindow");
        setMailStatus(null)
    }

    if (texts.length === 0) {
        return;
    }

    return (
        <div className="mail">
            <form className="mail-container" style={{ opacity: isLoading || mailStatus != null ? .5 : 1 }} onSubmit={handleSubmit}>
                <div className="mail-container-header">
                    {getText(0)}
                </div>
                <div className="mail-container-recipient">
                    {getText(1)} : <div className="mail-container-recipient-name">Mikaël Léger</div>
                </div>
                <div className="mail-container-sender" style={{ border: errors.email && "1px solid red" }}>
                    <input
                        type="email"
                        name="email"
                        placeholder={getText(2)}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading || mailStatus != null} />
                    {errors.email && <div className='mail-error'>{errors.email}</div>}
                </div>
                <div className="mail-container-object" style={{ border: errors.object && "1px solid red" }}>
                    <input
                        type="text"
                        name="object"
                        placeholder={getText(3)}
                        value={formData.object}
                        onChange={handleChange}
                        disabled={isLoading || mailStatus != null} />
                    {errors.object && <div className='mail-error'>{errors.object}</div>}
                </div>
                <div className="mail-container-message" style={{ border: errors.message && "1px solid red" }}>
                    <textarea
                        placeholder="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading || mailStatus != null} />
                    {errors.message && <div className='mail-error'>{errors.message}</div>}
                </div>
                <div className="mail-container-send">
                    <button className="mail-container-send-button" type="submit">
                        {getText(4)}
                    </button>
                </div>
            </form>
            <div className="mail-message">
                {isLoading && (
                    <Loading />
                )}
                {mailStatus?.status != null && (
                    <div className="mail-message-container">
                        <div className="mail-message-container-text">
                            <img className="mail-message-container-text-icon" src="/icons/mail.png" />
                            {mailStatus?.status === "ok" && (
                                <>
                                    {getText(5)}
                                    <br />
                                    {getText(6)}
                                </>

                            )}
                            {mailStatus?.status === "error" && (
                                <>
                                    {getText(7)}
                                    <br />
                                    {getText(8)} <span className="blue-link"
                                        onClick={() => window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank')}>
                                        LinkedIn
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="mail-message-container-options">
                            <div className="mail-message-container-options-option" onClick={() => setMailStatus(null)}>
                                {mailStatus?.status === "ok" && getText(9)}
                                {mailStatus?.status === "error" && getText(10)}
                            </div>
                            <div className="mail-message-container-options-option" onClick={closeMail}>
                                {getText(11)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}