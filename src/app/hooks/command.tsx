import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

import CommandLine from "../interfaces/command-line.interface";
import Preferences from "../interfaces/preferences.interface";

export default function useCommand(lines: CommandLine[], id?: number, onFinish?: () => void, preferences?: Preferences, ip?: string) {
    const [contentNodes, setContentNodes] = useState<React.ReactNode[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("~");
    const [ipFormatted, setIpFormatted] = useState<string>();
    const [isSimulationStarted, setIsSimulationStarted] = useState(false);

    useEffect(() => {
        if (ip != null) {
            const ipFormatted = ip.replaceAll('.', '-');
            setIpFormatted(ipFormatted);
            const timeline = gsap.timeline();
            timeline.from(document.querySelector(`.window-command-${id}`), {
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
        if (!ipFormatted) {
            return null;
        }

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

        let path = '~';

        if (process.env.NODE_ENV == 'production') {
            await waitFor(1000);
        }

        await simulateDisplay(<><img className="logo-icon" src="/linux.png" />{loginOutput}</>);
        await simulateWriting(loginText);

        await simulateDisplay(<><img className="logo-icon" src="/linux.png" />{authText}</>);

        await simulateDisplay(imgAsciiText);

        await simulateDisplay(lastLogintext);

        for (const line of lines) {
            if (line.command != null) {
                const userAndPath = `[dev-user@${ipFormatted} ${path}]$ `;
                await simulateDisplay(userAndPath);
                await simulateWriting(`${line.command}\n`);
            }
            if (line.result) {
                const nodeToDisplay = line.doNotBackToLine ? line.result : (
                    <>
                        {line.result}
                        <br />
                    </>
                );
                await simulateDisplay(nodeToDisplay);
            }
            if (line.newPath) {
                path = line.newPath;
                setCurrentPath(line.newPath);
            }
        }

        if (onFinish != null) {
            onFinish();
        }
    }

    const simulateDisplay = async (node: React.ReactNode) => {
        if (process.env.NODE_ENV == 'production') {
            await waitFor(200);
        }
        setContentNodes(prevContentNodes => {
            const updatedContent = [...prevContentNodes, node];
            return updatedContent;
        });
    }

    const simulateWriting = async (text: string) => {
        if (process.env.NODE_ENV == 'production') {
            await waitFor(600);
        }
        for (let i = 0; i < text.length; i++) {
            setContentNodes(prevContentNodes => {
                const updatedContent = [...prevContentNodes, text.charAt(i) as string];
                return updatedContent;
            });
            await waitRandom();
        }
    }

    // if (preferences == null || preferences.color == null) {
    //     return <div>Loading...</div>
    // }

    return { contentNodes, currentPath, ipFormatted, isSimulationStarted, setIsSimulationStarted, startSimulation };
}