import { useEffect } from "react";
import gsap from "gsap";

import ProjectInterface from "@/app/interfaces/project.interface";

import "./project.scss";

type ProjectProps = {
    item: ProjectInterface;
    addTab: (title: string, url: string, imgPath: string) => void;
};

export default function Project({ item, addTab }: ProjectProps) {
    return (
        <div className="project" onClick={() => addTab(item.name, item.url, item.logo)}>
            <img className="project-img" src={item.img} />
            <div className="project-title">
                {item.name}
            </div>
        </div>
    );
}