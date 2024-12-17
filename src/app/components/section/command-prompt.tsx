"use client";

import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

import IPContext from "@/app/contexts/ip-context";
import CommandLine from "@/app/interfaces/command-line.interface";

import "./command-prompt.scss";

type SectionProps = {
    lines: CommandLine[];
};

export default function CommandPrompt({lines}: SectionProps) {
    const ip = useContext(IPContext);
    const [contentNodes, setContentNodes] = useState<React.ReactNode[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("~");

    useEffect(() => {
        if (ip != null) {
            const timeline = gsap.timeline();
            timeline.from(document.querySelector(".command-prompt"), {
                duration: .7,
                opacity: 0,
                scale: 0.2,
                y: '40vh',
                x: '40vw',
                ease: "sine.in"
            });

            startSimulation();
        }
    }, [ip]);

    if (ip == null) {
      return <div>...</div>;
    }

    const ipFormatted = ip.replaceAll('.', '-');

    const waitFor = async (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const waitRandom = async (baseMs: number = 0) => {
        if (process.env.NODE_ENV == 'development') {
            return waitFor(0);
        }
        const min = 50 + baseMs;
        const max = 200 + baseMs;
        return waitFor((Math.random() * (max - min) + min));
    }

    const startSimulation = async () => {
        const loginOutput = "Login as: "
        const loginText = "dev-user\n";
        const authText = "Authenticating with public key \"portfolio-key\"\n";
        const imgAsciiText =
                " ,     #_\n"
            + " ~\\_  ####_        Full-Stack Developer\n"
            + "~~  \\_#####\\\n"
            + "~~     \\###|\n"
            + "~~       \\#/ ___   @Mikael-Leger\n"
            + " ~~       V~' '->\n"
            + "  ~~~         /\n"
            + "    ~~._.   _/\n"
            + "       _/ _/\n"
            + "     _/m/'\n";

        const date = new Date();
        const formattedDate = date.toLocaleString('en-US', { weekday: 'short' })
            + " " + date.toLocaleString('en-US', { month: 'short' })
            + " " + date.getDate()
            + " " + date.toLocaleTimeString('en-US', { hour12: false })
            + " " + date.getFullYear();
        const lastLogintext = `Last login: ${formattedDate} from ${ip}\n`;

        await waitFor(1000);

        await simulateDisplay(<><img className="command-prompt-logo" src="/linux.png"/>{loginOutput}</>);
        await simulateWriting(loginText);

        await simulateDisplay(<><img className="command-prompt-logo" src="/linux.png"/>{authText}</>);

        await simulateDisplay(imgAsciiText);

        await simulateDisplay(lastLogintext);

        for (const line of lines) {
            if (line.command != null) {
                const userAndPath = `[dev-user@${ipFormatted} ${currentPath}]$ `;
                await simulateDisplay(userAndPath);
                await simulateWriting(`${line.command}\n`);
            }
            if (line.result) {
                const nodeToDisplay = line.doNotBackToLine ? line.result : (
                    <>
                        {line.result}
                        <br/>
                    </>
                );
                await simulateDisplay(nodeToDisplay);
            }
            if (line.newPath) {
                setCurrentPath(line.newPath);
            }
        }
    }

    const simulateDisplay = async (node: React.ReactNode) => {
        setContentNodes(prevContentNodes => {
            const updatedContent = [...prevContentNodes, node];
            return updatedContent;
        });
    }

    const simulateWriting = async (text: string) => {
        await waitRandom(600);
        for (let i = 0; i < text.length; i++) {
            setContentNodes(prevContentNodes => {
                const updatedContent = [...prevContentNodes, text.charAt(i) as string];
                return updatedContent;
            });
            await waitRandom();
        }
    }

    return (
        <div className="command-prompt">
            <div className="command-prompt-window">
                <div className="command-prompt-window-header">
                    <img className="command-prompt-window-header-logo command-prompt-logo" src="/linux.png"/>
                    <div className="command-prompt-window-header-text">
                        dev-user@ip-{ipFormatted}:{currentPath}
                    </div>
                </div>
                <div className="command-prompt-window-actions">
                    <img className="command-prompt-window-actions-reduce command-prompt-logo" src="/reduce.png"/>
                    <img className="command-prompt-window-actions-maximize command-prompt-logo" src="/maximize.png"/>
                    <img className="command-prompt-window-actions-close command-prompt-logo" src="/close.png"/>
                </div>
            </div>
            <div className="command-prompt-content">
                {contentNodes.map((node, idx) => (
                    <span key={idx}>{node}</span>
                ))}
            </div>
        </div>
    );
}