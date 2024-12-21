import { useEffect } from "react";
import gsap from "gsap";

import Project from "../project/project";
import ProjectInterface from "@/app/interfaces/project.interface";

import "./portfolio.scss";

type PortfolioProps = {
    addTab: (title: string, url: string, imgPath: string) => void;
};

export default function Portfolio({ addTab }: PortfolioProps) {
    const projects: ProjectInterface[] = [
        {
            name: "EX-Change",
            img: "/projects/exchange.png",
            url: "https://ex-change-currency.vercel.app/",
            logo: "/projects/logo_exchange.png"
        },
        {
            name: "ScrimCheck",
            img: "/projects/scrimcheck.png",
            url: "https://scrim-check.vercel.app/",
            logo: "/projects/logo_scrimcheck.png"
        }
    ]

    return (
        <div className="portfolio">
            <div className="portfolio-title">
                Développeur Full-Stack
            </div>
            <div className="portfolio-projects">
                {projects.map(project => (
                    <Project item={project} addTab={addTab} key={project.name} />
                ))}
            </div>
        </div>
    );
}