import { useEffect } from "react";

import ProjectTechno from "@/app/interfaces/project-techno.interface";
import { useIsReduced } from "@/app/contexts/is-reduced";

import "./stack.scss";

type StackProps = {
    groupsOfItems: ProjectTechno[][];
};

export default function Stack({ groupsOfItems }: StackProps) {
    const { isReduced } = useIsReduced();

    const openTab = (url: string) => {
        if (isReduced) {
            return;
        }
        window.open(url, '_blank');
    }
    return (
        <div className="stack">
            {groupsOfItems.map(groupOfItems => {
                const { groupName } = groupOfItems[0];
                return (
                    <div className={`stack-group group-${groupName}`} key={groupName}>
                        <div className="stack-group-name">
                            {groupName}
                        </div>
                        <div className="stack-group-content">
                            {groupOfItems.map(item => {
                                return (
                                    <div className="stack-group-content-item" key={item.name}>
                                        {item.url ? (
                                            <div className="stack-group-content-item-url" onClick={() => openTab(item.url as string)}>
                                                {item.name}
                                            </div>
                                        ) : (
                                            <div className="stack-group-content-item-name">
                                                {item.name}
                                            </div>
                                        )}
                                        {item.version && (
                                            <div className="stack-group-content-item-version">
                                                {item.version}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}