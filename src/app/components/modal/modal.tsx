import { RefObject, useEffect } from "react";
import ProjectModal from "@/app/interfaces/modal.interface";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectTechno from "@/app/interfaces/project-techno.interface";
import Stack from "../stack/stack";
import Status from "@/app/interfaces/status.interface";

import "./modal.scss";

type ModalProps = {
    modalData: ProjectModal;
    addTab: (title: string, url: string, imgPath: string) => void;
    showModal: (show: boolean) => void;
    ref: RefObject<null>;
};

export default function Modal({ modalData, addTab, showModal, ref }: ModalProps) {
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

    const statusTemplate = (status: Status) => {
        return (
            <div className="modal-container-header-status">
                <div className={`modal-container-header-status-type type-${status.type}`} />
                <div className="modal-container-header-status-title">
                    {status.title}
                </div>
            </div>
        )
    }

    const modalTemplate = () => {
        if (modalData.item) {
            return (
                <div className="modal-container" ref={ref}>
                    <div className="modal-container-header">
                        <div className="modal-container-header-title">
                            {modalData.item.name}
                        </div>
                        {modalData.item.status && statusTemplate(modalData.item.status)}
                    </div>
                    <div className="modal-container-content">
                        <div className="modal-container-content-details">
                            <div
                                className="modal-container-content-details-img"
                                onClick={() => addTabFromitem(modalData.item as ProjectInterface)}>
                                <img src={modalData.item.img} />
                                {modalData.item.url && (
                                    <div className="modal-container-content-details-img-open">
                                        <img className="modal-container-content-details-img-open-logo" src="/open.png" />
                                    </div>
                                )}
                            </div>
                            <div className="modal-container-content-details-description">
                                {modalData.item.description}
                            </div>
                        </div>
                        {modalData.item.stack && stackTemplate()}
                    </div>
                    <div className="modal-container-actions">
                        <div className="modal-container-actions-close" onClick={() => showModal(false)}>
                            <img src="/close.png" />
                        </div>
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