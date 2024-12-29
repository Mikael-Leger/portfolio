import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Project from "../project/project";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectModal from "@/app/interfaces/modal.interface";
import Modal from "../modal/modal";
import Title from "../title/title";
import WindowRef from "@/app/interfaces/window-ref.interface";
import { useIsReduced } from "@/app/contexts/is-reduced";
import personalProjects from "@/app/data/personal_projects.json";
import professionalProjects from "@/app/data/professional_projects.json";
import schoolProjects from "@/app/data/school_projects.json";
import TabInterface from "@/app/interfaces/tab.interface";

import "./portfolio.scss";

type PortfolioProps = {
    addTab: (tabData: TabInterface) => void;
};

export default function Portfolio({ addTab }: PortfolioProps) {
    const [modalData, setModalData] = useState<ProjectModal>({
        isVisible: false
    });
    const { isReduced } = useIsReduced();

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

    useEffect(() => {
        if (!portfolioRef || !modalRef) {
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
    }, [portfolioRef, modalRef, modalData.isVisible])

    const showModal = async (show: boolean) => {
        if (isReduced) {
            return;
        }
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
        if (isReduced) {
            return;
        }

        setModalData({
            isVisible: true,
            item: project
        });
    };

    const groupsOfProjects = [
        {
            title: "Projets personnels",
            projects: personalProjects
        },
        {
            title: "Projets professionnels",
            projects: professionalProjects
        },
        {
            title: "Projets scolaires",
            projects: schoolProjects
        },
    ];

    return (
        <div className="portfolio" ref={portfolioRef}>
            <div className="portfolio-name">
                <Title text="Mikaël Léger - Développeur Full-Stack" size="big" />
            </div>
            <div className="portfolio-container">
                {groupsOfProjects.map(groupOfProjects => (
                    <div className="portfolio-container-group" key={groupOfProjects.title}>
                        <div className="portfolio-container-group-title">
                            <Title text={groupOfProjects.title} effect="shadow" color="purple" />
                        </div>
                        <div className="portfolio-container-group-projects">
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