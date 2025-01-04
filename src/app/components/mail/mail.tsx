import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

import Loading from "../loading/loading";
import FormContact from '@/app/interfaces/form-contact.interface';

import "./mail.scss";

type MailProps = {
    onAction: (action: string, payload?: any) => void;
};

export default function Mail({ onAction }: MailProps) {
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

    useEffect(() => {
        if (mailStatus?.status != null) {
            setIsLoading(false);
        }

    }, [mailStatus?.status]);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'object':
                if (value.length === 0) {
                    return 'Please enter an object';
                }
                if (value.length > 50) {
                    return 'Object cannot exceed 50 characters';
                }
                break;
            case 'email':
                if (value.length === 0) {
                    return 'Please enter an email';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email';
                }
                break;
            case 'message':
                if (value.length === 0) {
                    return 'Please write a message';
                }
                if (value.length > 1000) {
                    return 'Object cannot exceed 1000 characters';
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

    return (
        <div className="mail">
            <form className="mail-container" style={{ opacity: isLoading || mailStatus != null ? .5 : 1 }} onSubmit={handleSubmit}>
                <div className="mail-container-header">
                    New message
                </div>
                <div className="mail-container-recipient">
                    To: <div className="mail-container-recipient-name">Mikaël Léger</div>
                </div>
                <div className="mail-container-sender" style={{ border: errors.email && "1px solid red" }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading || mailStatus != null} />
                    {errors.email && <div className='mail-error'>{errors.email}</div>}
                </div>
                <div className="mail-container-object" style={{ border: errors.object && "1px solid red" }}>
                    <input
                        type="text"
                        name="object"
                        placeholder="Object"
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
                        send
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
                                    E-mail sent with success
                                    <br />
                                    I will answer you quicly
                                </>

                            )}
                            {mailStatus?.status === "error" && (
                                <>
                                    Error sending e-mail
                                    <br />
                                    Try to contact me on <span className="blue-link"
                                        onClick={() => window.open("https://www.linkedin.com/in/mika%C3%ABl-l%C3%A9ger-6934a3165/", '_blank')}>
                                        LinkedIn
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="mail-message-container-options">
                            <div className="mail-message-container-options-option" onClick={() => setMailStatus(null)}>
                                {mailStatus?.status === "ok" && (
                                    "Write another one"
                                )}
                                {mailStatus?.status === "error" && (
                                    "Try again"
                                )}
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