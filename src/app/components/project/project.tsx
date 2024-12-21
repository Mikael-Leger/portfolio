import { useEffect } from "react";
import gsap from "gsap";

import ProjectInterface from "@/app/interfaces/project.interface";

import "./project.scss";

type ProjectProps = {
    item: ProjectInterface;
    showProjectModal: (project: ProjectInterface) => void;
};

export default function Project({ item, showProjectModal }: ProjectProps) {
    return (
        <div className="project" onClick={() => showProjectModal(item)}>
            <img className="project-img" src={item.img} />
            <div className="project-title">
                {item.name}
            </div>
        </div>
    );
}