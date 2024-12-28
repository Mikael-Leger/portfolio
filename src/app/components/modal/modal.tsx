import { RefObject, useEffect } from "react";
import ProjectModal from "@/app/interfaces/modal.interface";
import ProjectInterface from "@/app/interfaces/project.interface";
import ProjectTechno from "@/app/interfaces/project-techno.interface";
import Stack from "../stack/stack";
import Status from "@/app/interfaces/status.interface";
import { useIsReduced } from "@/app/contexts/is-reduced";
import TabInterface from "@/app/interfaces/tab.interface";

import "./modal.scss";

type ModalProps = {
    modalData: ProjectModal;
    addTab: (tabData: TabInterface) => void;
    showModal: (show: boolean) => void;
    ref: RefObject<null>;
};

export default function Modal({ modalData, addTab, showModal, ref }: ModalProps) {
    const { isReduced } = useIsReduced();

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
        if (!item.url || isReduced) {
            return;
        }
        addTab({ title: item.name, url: item.url, logoPath: item.logo, defaultTab: false });
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
                                className={`modal-container-content-details-img ${modalData.item.url ? 'link-working' : ''}`}
                                onClick={() => addTabFromitem(modalData.item as ProjectInterface)}>
                                <img src={modalData.item.img} onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "/projects/not_found.png";
                                }} />
                                {modalData.item.url && (
                                    <div className="modal-container-content-details-img-open">
                                        <img className="modal-container-content-details-img-open-logo" src="/icons/open.png" />
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
                            <img src="/icons/close.png" />
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