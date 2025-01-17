import ProjectTechno from "@/app/interfaces/project-techno.interface";
import { useIsAnyReduced } from "@/app/contexts/is-reduced";

import "./stack.scss";

type StackProps = {
    groupsOfItems: ProjectTechno[][];
};

export default function Stack({ groupsOfItems }: StackProps) {
    const { isAnyReduced } = useIsAnyReduced();

    const getContentStyle = (groupOfItems: ProjectTechno[]) => {
        if (groupOfItems.length > 1) {
            return {};
        }
        return (groupOfItems[0].version != null) ? {} : { marginTop: "-25px" };
    }

    return (
        <div className="stack">
            {groupsOfItems.map(groupOfItems => {
                const { groupName } = groupOfItems[0];
                return (
                    <div
                        className={`stack-group group-${groupName}`}
                        key={groupName}>
                        <div className="stack-group-name">
                            {groupName}
                        </div>
                        <div className="stack-group-content" style={getContentStyle(groupOfItems)}>
                            {groupOfItems.map(item => {
                                return (
                                    <div className="stack-group-content-item" key={item.name}>
                                        <div className="stack-group-content-item-name">
                                            {item.name}
                                        </div>
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