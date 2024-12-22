import { useEffect, useState } from "react";
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
            {item.img && (
                <img className="project-img" src={item.img} onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/projects/not_found.png";
                }} />
            )}
            <div className="project-title">
                {item.name}
            </div>
        </div>
    );
}