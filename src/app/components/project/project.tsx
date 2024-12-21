import { useEffect } from "react";
import gsap from "gsap";

import ProjectInterface from "@/app/interfaces/project.interface";

import "./project.scss";

type ProjectProps = {
    item: ProjectInterface;
    showProjectInModal: (project: ProjectInterface) => void;
};

export default function Project({ item, showProjectInModal }: ProjectProps) {
    return (
        <div className="project" onClick={() => showProjectInModal(item)}>
            <img className="project-img" src={item.img} />
            <div className="project-title">
                {item.name}
            </div>
        </div>
    );
}