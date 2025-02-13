import { useEffect, useState } from "react";
import gsap from "gsap";

import ProjectInterface from "@/app/interfaces/project.interface";
import { useIsAnyReduced } from "@/app/contexts/is-reduced";
import { useIsMobile } from "@/app/contexts/mobile-context";
import { useLanguage } from "@/app/contexts/language-context";

import "./project.scss";

type ProjectProps = {
    item: ProjectInterface;
    showProjectInModal: (project: ProjectInterface) => void;
};

export default function Project({ item, showProjectInModal }: ProjectProps) {
    const { isAnyReduced } = useIsAnyReduced();
    const { isMobile } = useIsMobile();
    const { language } = useLanguage();

    const img = item.name === "MFC" ? `/projects/mfc_${language}.png` : item.img;

    return (
        <div className="project" onClick={() => showProjectInModal(item)} style={{ cursor: isAnyReduced ? 'initial' : 'pointer' }}>
            {item.img && (
                <img
                    className="project-img"
                    src={img}
                    style={{ width: isMobile ? '40vw' : '20vw' }}
                    onError={(e) => {
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