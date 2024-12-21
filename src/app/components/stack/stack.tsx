import { useEffect } from "react";

import "./stack.scss";
import ProjectTechno from "@/app/interfaces/project-techno.interface";

type StackProps = {
    groupsOfItems: ProjectTechno[][];
};

export default function Stack({ groupsOfItems }: StackProps) {
    return (
        <div className="stack">
            {groupsOfItems.map(groupOfItems => {
                return (
                    <div className="stack-group">
                        <div className="stack-group-name">
                            {groupOfItems[0].groupName}
                        </div>
                        <div className="stack-group-content">
                            {groupOfItems.map(item => {
                                return (
                                    <div className="stack-group-content-item" key={item.name}>
                                        {item.url ? (
                                            <div className="stack-group-content-item-url" onClick={() => window.open(item.url, '_blank')}>
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