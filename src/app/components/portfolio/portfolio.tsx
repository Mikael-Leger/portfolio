import { useEffect, useState } from "react";
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

    const showProjectModal = (project: ProjectInterface) => {
        setModalData({
            isVisible: true,
            item: project
        });
    };

    const projects: ProjectInterface[] = [
        {
            name: "EX-Change",
            img: "/projects/exchange.png",
            url: "https://ex-change-currency.vercel.app/",
            logo: "/projects/logo_exchange.png",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.",
            stack: [
                {
                    name: "TypeScript",
                    groupName: "Frontend",
                    version: "5.6.2"
                },
                {
                    name: "React",
                    groupName: "Frontend",
                    version: "18.3.12"
                },
                {
                    name: "Vite",
                    groupName: "Frontend",
                    version: "6.0.1"
                },
                {
                    name: "Python",
                    groupName: "Backend",
                    version: "3.12.0"
                },
                {
                    name: "Flask",
                    groupName: "Backend",
                    version: "3.1.0"
                },
                {
                    name: "Vercel",
                    groupName: "Environnement",
                    url: "https://vercel.com/"
                },
                {
                    name: "Free Currency",
                    groupName: "API",
                    url: "https://freecurrencyapi.com/docs/"
                }
            ]
        },
        {
            name: "ScrimCheck",
            img: "/projects/scrimcheck.png",
            url: "https://scrim-check.vercel.app/",
            logo: "/projects/logo_scrimcheck.png",
            description: "ScrimCheck est un projet",
            stack: [
                {
                    name: "React",
                    groupName: "Frontend",
                    version: "18.2.0"
                },
                {
                    name: "NestJS",
                    groupName: "Backend",
                    version: "10.4.15"
                },
                {
                    name: "AWS RDS",
                    groupName: "Database",
                    url: "https://aws.amazon.com/fr/rds/"
                },
                {
                    name: "Vercel",
                    groupName: "Environnement",
                    url: "https://vercel.com/"
                },
                {
                    name: "AWS EC2",
                    groupName: "Environnement",
                    url: "https://aws.amazon.com/fr/ec2/"
                },
                {
                    name: "Riot Games",
                    groupName: "API",
                    url: "https://developer.riotgames.com/"
                }
            ]
        },
        {
            name: "Portfolio",
            img: "/projects/portfolio.png",
            logo: "/logo_portfolio.png",
            description: "Portfolio",
            stack: [
                {
                    name: "TypeScript",
                    groupName: "Frontend",
                    version: "5.0.0"
                },
                {
                    name: "React",
                    groupName: "Frontend",
                    version: "19.0.0"
                },
                {
                    name: "Next.js",
                    groupName: "Frontend & Backend",
                    version: "15.1.0"
                },
                {
                    name: "NestJS",
                    groupName: "Backend",
                    version: "10.4.15"
                },
                // {
                //     name: "Vercel",
                //     groupName: "Environnement",
                //     url: "https://vercel.com/"
                // },
                // {
                //     name: "AWS EC2",
                //     groupName: "Environnement",
                //     url: "https://aws.amazon.com/fr/ec2/"
                // },
            ]
        }
    ];

    return (
        <div className="portfolio">
            <div className="portfolio-title">
                Développeur Full-Stack
            </div>
            <div className="portfolio-projects">
                {projects.map(project => (
                    <Project item={project} showProjectModal={showProjectModal} key={project.name} />
                ))}
            </div>
            <Modal modalData={modalData} addTab={addTab} />
        </div>
    );
}