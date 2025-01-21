import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Project from "../project/project";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectModal from "@/app/interfaces/modal.interface";
import Modal from "../modal/modal";
import Title from "../title/title";
import WindowRef from "@/app/interfaces/window-ref.interface";
import { useIsAnyReduced } from "@/app/contexts/is-reduced";
import personalProjects from "@/app/data/personal_projects.json";
import professionalProjects from "@/app/data/professional_projects.json";
import schoolProjects from "@/app/data/school_projects.json";
import TabInterface from "@/app/interfaces/tab.interface";
import { useLanguage } from "@/app/contexts/language-context";

import "./projects.scss";

type ProjectsProps = {
    addTab: (tabData: TabInterface) => void;
};

export default function Projects({ addTab }: ProjectsProps) {
    const { isAnyReduced } = useIsAnyReduced();
    const { getText } = useLanguage();


    const [modalData, setModalData] = useState<ProjectModal>({
        isVisible: false
    });

    const projectsRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalData.isVisible) {
            const timeline = gsap.timeline();
            timeline.from(".modal", {
                duration: .2,
                opacity: 0,
                scale: .9,
                ease: "power2.in"
            });
        }
    }, [modalData.isVisible]);

    useEffect(() => {
        if (!projectsRef || !modalRef) {
            return;
        }

        const listener = (event: Event) => {
            {
                const targetNode = event.target as Node | null;

                if (!targetNode) return;

                const classNames = Array.from((targetNode as HTMLElement).classList);
                if (modalData.isVisible && classNames[0] === "modal") {
                    showModal(false);
                }
            }
        }

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [projectsRef, modalRef, modalData.isVisible])

    const getTextByComponent = (index: number) => {
        return getText("projects", index);
    }

    const showModal = async (show: boolean) => {
        if (isAnyReduced) {
            return;
        }
        if (!show) {
            gsap.to(".modal", {
                duration: .2,
                opacity: 0,
                scale: .9,
                ease: "power2.out"
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
        if (isAnyReduced) {
            return;
        }

        setModalData({
            isVisible: true,
            item: project
        });
    };

    const groupsOfProjects = [
        {
            title: getTextByComponent(0),
            projects: personalProjects
        },
        {
            title: getTextByComponent(1),
            projects: professionalProjects
        },
        {
            title: getTextByComponent(2),
            projects: schoolProjects
        },
    ];

    return (
        <div className="projects" ref={projectsRef}>
            <div className="projects-container">
                {groupsOfProjects.map(groupOfProjects => (
                    <div className="projects-container-group" key={groupOfProjects.title}>
                        <div className="projects-container-group-title">
                            <Title text={groupOfProjects.title} effect="shadow" color="purple" transform="upper" />
                        </div>
                        <div className="projects-container-group-projects">
                            {groupOfProjects.projects.map(project => (
                                <Project item={project} showProjectInModal={showProjectInModal} key={project.name} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Modal modalData={modalData} addTab={addTab} showModal={showModal} ref={modalRef} />
        </div>
    );
}