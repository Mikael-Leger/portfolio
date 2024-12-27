import { useContext, useEffect, useState } from "react";
import gsap from "gsap";

import CommandLine from "../interfaces/command-line.interface";
import Preferences from "../interfaces/preferences.interface";
import { getFormattedDate } from "../services/date.service";
import UsernameContext from "../contexts/username-context";

const BASE_TIME_WAIT = 0;
// const BASE_TIME_WAIT = 80;

const BASE_DELAY = 0;
// const BASE_DELAY = 800;

export default function useCommand(type: string, lines: CommandLine[] | undefined, id?: number, onFinish?: () => void, preferences?: Preferences, ip?: string) {
    const username = useContext(UsernameContext) as string;

    const [contentNodes, setContentNodes] = useState<React.ReactNode[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("~");
    const [ipFormatted, setIpFormatted] = useState<string>();
    const [isSimulationStarted, setIsSimulationStarted] = useState(false);

    useEffect(() => {
        if (ip == null || id == null) {
            return;
        }

        const ipFormatted = ip.replaceAll('.', '-');
        setIpFormatted(ipFormatted);
    }, [ip, id]);

    const isCommand = (type === 'command');
    if (!isCommand) {
        return { isNotCommand: true };
    }

    const animateOpenCommand = () => {
        const timeline = gsap.timeline();
        timeline.fromTo(document.querySelector(`.window-command-${id}`), {
            opacity: 0,
            y: '40vh',
            x: '40vw',
        }, {
            duration: BASE_DELAY / 1000,
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            ease: "sine.in"
        });

        return timeline.totalDuration();
    }

    const waitFor = async (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const waitRandom = async (baseMs: number = 0) => {
        if (process.env.DEV_ANIMATION_SPEED == 'fast') {
            return waitFor(0);
        }
        const min = (BASE_TIME_WAIT / 4) + baseMs;
        const max = BASE_TIME_WAIT + baseMs;
        return waitFor((Math.random() * (max - min) + min));
    }

    const startSimulation = async () => {
        if (!ipFormatted || !lines) {
            return null;
        }
        const animationDuration = animateOpenCommand();
        await waitFor(animationDuration * 1000);

        await waitFor(BASE_DELAY);

        const loginOutput = "Login as: "
        const loginText = `${username}\n`;
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

        const formattedDate = getFormattedDate();
        const lastLogintext = `Last login: ${formattedDate} from ${ip}\n`;

        let path = '~';

        if (process.env.DEV_ANIMATION_SPEED == 'none') {
            await waitFor(BASE_TIME_WAIT * 5);
        }

        await simulateDisplay(<><img className="logo-icon" src="/icons/linux.png" />{loginOutput}</>);
        await simulateWriting(loginText);

        await simulateDisplay(<><img className="logo-icon" src="/icons/linux.png" />{authText}</>);

        await simulateDisplay(imgAsciiText);

        await simulateDisplay(lastLogintext);

        for (const line of lines) {
            if (line.command != null) {
                const userAndPath = `[${username}@${ipFormatted} ${path}]$ `;
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
        if (process.env.DEV_ANIMATION_SPEED == 'none') {
            await waitFor(BASE_TIME_WAIT);
        }

        setContentNodes(prevContentNodes => {
            const updatedContent = [...prevContentNodes, node];
            return updatedContent;
        });
    }

    const simulateWriting = async (text: string) => {
        if (process.env.DEV_ANIMATION_SPEED == 'none') {
            await waitFor(BASE_TIME_WAIT);
        }
        for (let i = 0; i < text.length; i++) {
            setContentNodes(prevContentNodes => {
                const updatedContent = [...prevContentNodes, text.charAt(i) as string];
                return updatedContent;
            });
            await waitRandom();
        }
    }

    return { contentNodes, currentPath, ipFormatted, isSimulationStarted, setIsSimulationStarted, startSimulation, animateOpenCommand };
}