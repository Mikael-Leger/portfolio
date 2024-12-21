import { useEffect } from "react";
import ProjectModal from "@/app/interfaces/modal.interface";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectTechno from "@/app/interfaces/project-techno.interface";

import "./modal.scss";
import Stack from "../stack/stack";

type ModalProps = {
    modalData: ProjectModal;
    addTab: (title: string, url: string, imgPath: string) => void;
};

export default function Modal({ modalData, addTab }: ModalProps) {
    if (!modalData.isVisible) return;

    const stackTemplate = () => {
        if (modalData.item && modalData.item.stack) {
            const groupsOfItems: ProjectTechno[][] = Object.values(
                modalData.item?.stack?.reduce((acc: Record<string, ProjectTechno[]>, item: ProjectTechno) => {
                    if (!acc[item.groupName]) {
                        acc[item.groupName] = [];
                    }
                    acc[item.groupName].push(item);
                    return acc;
                }, {})
            );
            return (
                <Stack groupsOfItems={groupsOfItems} />
            );
        }
        return <></>;
    }

    const addTabFromitem = (item: ProjectInterface) => {
        if (item.url) {
            addTab(item.name, item.url, item.logo);
        }
    }

    const modalTemplate = () => {
        if (modalData.item) {
            return (
                <div className="modal-container">
                    <div className="modal-container-header">
                        <div className="modal-container-header-title">
                            {modalData.item.name}
                        </div>
                    </div>
                    <div className="modal-container-content">
                        <div className="modal-container-content-details">
                            <div
                                className="modal-container-content-details-img"
                                onClick={() => addTabFromitem(modalData.item as ProjectInterface)}>
                                <img src={modalData.item.img} />
                                {modalData.item.url && (
                                    <img
                                        className="modal-container-content-details-img-link link-in-img"
                                        src="/link.png" />
                                )}
                            </div>
                            <div className="modal-container-content-details-description">
                                {modalData.item.description}
                            </div>
                        </div>
                        {modalData.item.stack && stackTemplate()}
                    </div>
                </div>
            )
        }
        return <></>;
    }

    return (
        <div className="modal">
            {modalTemplate()}
        </div>
    );
}