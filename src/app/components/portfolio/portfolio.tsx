import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Project from "../project/project";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectModal from "@/app/interfaces/modal.interface";
import Modal from "../modal/modal";

import "./portfolio.scss";

type PortfolioProps = {
    addTab: (title: string, url: string, imgPath: string) => void;
};

export default function Portfolio({ addTab }: PortfolioProps) {
    const [modalData, setModalData] = useState<ProjectModal>({
        isVisible: false
    });

    const portfolioRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalData.isVisible) {
            const timeline = gsap.timeline();
            timeline.from(".modal", {
                duration: .4,
                opacity: 0,
                scale: .4,
                ease: "sine.in"
            });
            timeline.from(".stack-group", {
                duration: 1.5,
                opacity: 0,
                scale: .4,
                stagger: .2,
                ease: "elastic.out"
            });
        }
    }, [modalData.isVisible]);

    const useOnClickOutside = <T extends HTMLElement>(
        refOut: RefObject<T | null>,
        refIn: RefObject<T | null>,
        handler: (event: Event) => void
    ) => {
        useEffect(() => {
            if (refOut && refIn) {
                const listener = (event: Event) => {
                    const targetNode = event.target as Node;
                    if (!refOut.current
                        || refOut.current.contains(targetNode)
                        || !refIn.current?.contains(targetNode)) {
                        return;
                    }
                    handler(event);
                };

                document.addEventListener("mousedown", listener);
                document.addEventListener("touchstart", listener);

                return () => {
                    document.removeEventListener("mousedown", listener);
                    document.removeEventListener("touchstart", listener);
                };
            }
        }, [refOut, handler]);
    }

    useOnClickOutside(modalRef, portfolioRef, () => {
        if (modalData.isVisible) showModal(false);
    });

    const showModal = async (show: boolean) => {
        if (!show) {
            gsap.to(".modal", {
                duration: .4,
                opacity: 0,
                scale: .4,
                ease: "sine.in"
            });
            await new Promise(r => setTimeout(r, 400));
        }
        setModalData(prevModalData => {
            const updatedModalData = {
                ...prevModalData,
                isVisible: show
            };
            return updatedModalData;
        });
    }

    const showProjectInModal = (project: ProjectInterface) => {
        setModalData({
            isVisible: true,
            item: project
        });
    };

    const projects: ProjectInterface[] = [
        {
            name: "EX-Change",
            status: {
                title: "online",
                type: "success"
            },
            img: "/projects/exchange.png",
            url: "https://ex-change-currency.vercel.app/",
            logo: "/projects/logo_exchange.png",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.",
            stack: [
                {
                    name: "TypeScript",
                    groupName: "frontend",
                    version: "5.6.2"
                },
                {
                    name: "React",
                    groupName: "frontend",
                    version: "18.3.12"
                },
                {
                    name: "Vite",
                    groupName: "frontend",
                    version: "6.0.1"
                },
                {
                    name: "Python",
                    groupName: "backend",
                    version: "3.12.0"
                },
                {
                    name: "Flask",
                    groupName: "backend",
                    version: "3.1.0"
                },
                {
                    name: "Vercel",
                    groupName: "deploy",
                    url: "https://vercel.com/"
                },
                {
                    name: "Free Currency",
                    groupName: "api",
                    url: "https://freecurrencyapi.com/docs/"
                }
            ]
        },
        {
            name: "ScrimCheck",
            status: {
                title: "online",
                type: "warning",
                details: "API key not valid. Only using mocks as data."
            },
            img: "/projects/scrimcheck.png",
            url: "https://scrim-check.vercel.app/",
            logo: "/projects/logo_scrimcheck.png",
            description: "ScrimCheck est un projet",
            stack: [
                {
                    name: "React",
                    groupName: "frontend",
                    version: "18.2.0"
                },
                {
                    name: "NestJS",
                    groupName: "backend",
                    version: "10.4.15"
                },
                {
                    name: "AWS RDS",
                    groupName: "database",
                    url: "https://aws.amazon.com/fr/rds/"
                },
                {
                    name: "Vercel",
                    groupName: "deploy",
                    url: "https://vercel.com/"
                },
                {
                    name: "AWS EC2",
                    groupName: "deploy",
                    url: "https://aws.amazon.com/fr/ec2/"
                },
                {
                    name: "Riot Games",
                    groupName: "api",
                    url: "https://developer.riotgames.com/"
                }
            ]
        },
        {
            name: "Portfolio",
            status: {
                title: "online",
                type: "success"
            },
            img: "/projects/portfolio.png",
            logo: "/logo_portfolio.png",
            description: "Portfolio",
            stack: [
                {
                    name: "TypeScript",
                    groupName: "frontend",
                    version: "5.0.0"
                },
                {
                    name: "React",
                    groupName: "frontend",
                    version: "19.0.0"
                },
                {
                    name: "Next.js",
                    groupName: "frontend & backend",
                    version: "15.1.0"
                },
                {
                    name: "NestJS",
                    groupName: "backend",
                    version: "10.4.15"
                },
                // {
                //     name: "Vercel",
                //     groupName: "deploy",
                //     url: "https://vercel.com/"
                // },
                // {
                //     name: "AWS EC2",
                //     groupName: "deploy",
                //     url: "https://aws.amazon.com/fr/ec2/"
                // },
            ]
        }
    ];

    return (
        <div className="portfolio" ref={portfolioRef}>
            <div className="portfolio-title">
                Développeur Full-Stack
            </div>
            <div className="portfolio-projects">
                {projects.map(project => (
                    <Project item={project} showProjectInModal={showProjectInModal} key={project.name} />
                ))}
            </div>
            <Modal modalData={modalData} addTab={addTab} showModal={showModal} ref={modalRef} />
        </div>
    );
}