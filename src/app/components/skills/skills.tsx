import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Title from "../title/title";

import skillsData from "@/app/data/skills.json";
import SkillInterface, { Context } from "@/app/interfaces/skill.interface";
import Tooltip from "../tooltip/tooltip";

import "./skills.scss";

type SkillsProps = {
};

type GroupedSkills = {
    [key: string]: SkillInterface[];
};

export default function Skills({ }: SkillsProps) {
    const [skillsGroups, setSkillsGroups] = useState<GroupedSkills>();
    const [skillsGroupsFiltered, setSkillsGroupsFiltered] = useState<GroupedSkills>();
    const [searchFilter, setSearchFilter] = useState<string>("");

    const groupsAdded = useRef<string[]>([]);

    useEffect(() => {
        const groupedSkills = skillsData.reduce<GroupedSkills>((acc, skillData) => {
            if (!acc[skillData.type]) {
                acc[skillData.type] = [];
            }
            acc[skillData.type].push(skillData);
            return acc;
        }, {});

        for (let group in groupedSkills) {
            groupedSkills[group].sort((a, b) => {
                const favoriteA = a.favorite ? 1 : 0;
                const favoriteB = b.favorite ? 1 : 0;
                return favoriteB - favoriteA;
            });
        }

        setSkillsGroups(groupedSkills);
        setSkillsGroupsFiltered(groupedSkills);
    }, []);

    useEffect(() => {
        if (skillsGroups == null) {
            return;
        }

        animateTree();

    }, [skillsGroups]);

    useEffect(() => {
        animateAdditions();

    }, [skillsGroupsFiltered]);

    useEffect(() => {
        if (!skillsGroups) {
            return
        };

        const groupsDeleted: string[] = [];
        const skillsDeleted: string[] = [];

        const updatedSkillsGroups: GroupedSkills = Object.fromEntries(
            Object.entries(skillsGroups).map(([key, skillList]) => {
                const filteredSkills = skillList.filter(skill => {
                    const searchFilterFormatted = formatteString(searchFilter);
                    const nameFormatted = formatteString(skill.name);
                    const typeFormatted = formatteString(skill.type);
                    const groupNameFormatted = formatteString(key);

                    const condition = (searchFilter == ""
                        || (nameFormatted.includes(searchFilterFormatted)
                            || typeFormatted.includes(searchFilterFormatted))
                        || groupNameFormatted.includes(searchFilterFormatted));

                    if (!condition) {
                        skillsDeleted.push(skill.name);
                    }

                    return condition;
                });

                return [key, filteredSkills];
            })
                .filter(([key, filteredSkills]) => {
                    const condition = filteredSkills.length > 0;
                    if (!condition) {
                        groupsDeleted.push(key as string);
                    }
                    return condition;
                })
        );

        if (skillsGroupsFiltered) {
            groupsAdded.current = Object.keys(updatedSkillsGroups).filter(
                key => !(key in skillsGroupsFiltered)
            );
        }

        const duration = .5;
        animateDeletions(groupsDeleted, duration);

        setTimeout(() => {
            setSkillsGroupsFiltered(updatedSkillsGroups);

        }, duration * 1000);


    }, [searchFilter]);

    const animateTree = () => {
        const timeline = gsap.timeline();
        timeline.fromTo(".skills-header", {
            clipPath: "inset(100% 0 0 0)",
            y: 100,
        }, {
            duration: .4,
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            stagger: .2,
            ease: "power1.inOut"
        })
        const duration = timeline.totalDuration();
        gsap.fromTo(".skills-content-search-input", {
            x: -100,
            opacity: 0
        }, {
            delay: duration,
            duration: .4,
            x: 0,
            opacity: 1
        })
        gsap.fromTo(".skills-content-search-icon", {
            x: 100,
            opacity: 0
        }, {
            delay: duration,
            duration: .4,
            x: 0,
            opacity: 1
        })

        const groups = Array.from(document.getElementsByClassName("skills-content-groups-group")).reverse();

        gsap.to(groups, {
            duration: .2,
            opacity: 1,
            scale: 1,
            stagger: .03,
        });
    }

    const animateDeletions = (groupsDeleted: string[], duration: number) => {
        groupsDeleted.forEach(groupDeleted => {
            const selector = `group-${formatteString(groupDeleted)}`;
            const elements = document.getElementsByClassName(selector);
            if (!elements[0]) return;

            gsap.fromTo(elements, {
                opacity: 1
            }, {
                duration,
                opacity: 0,
                display: "none"
            });
        })
    }

    const animateAdditions = () => {
        groupsAdded.current.forEach(groupAdded => {
            const selector = `group-${formatteString(groupAdded)}`;
            const elements = document.getElementsByClassName(selector);
            if (!elements[0]) return;

            gsap.fromTo(elements, {
                opacity: 0
            }, {
                duration: .5,
                opacity: 1,
                display: "flex"
            });
        })
        groupsAdded.current = [];
    }

    const formatteString = (value: string) => {
        return value.toLowerCase().replaceAll(/[\s\p{P}]/gu, '');
    }

    const highlightText = (text: string, title: boolean = false) => {
        if (searchFilter == "") return text;
        const formattedSearch = formatteString(searchFilter);

        const rootStyles = getComputedStyle(document.documentElement);
        const bgColor = rootStyles.getPropertyValue('--background-node-highlight');

        const parts = text.split(new RegExp(`(${searchFilter})`, 'gi'));
        return parts.map((part, index) => {
            const formattedPart = formatteString(part);

            return formattedPart === formattedSearch ? (
                <span key={index} style={{ backgroundColor: bgColor, padding: title ? '0' : '3px 0' }}>
                    {part}
                </span>
            ) : (
                part
            )
        }
        );
    };

    const resetFilter = () => {
        setSearchFilter("");
    }

    return (
        <div className="skills">
            <div className="skills-header">
                <Title text="Tree skills" size="big" transform="upper" effect="shadow" />
            </div>
            <div className="skills-content">
                <div className="skills-content-search">
                    <input
                        className="skills-content-search-input"
                        type="text"
                        placeholder="Search any skill"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)} />
                    <div className="skills-content-search-icon" onClick={resetFilter}>
                        <img src="/icons/refresh.png" />
                    </div>
                </div>
                <div className="skills-content-groups">
                    {skillsGroups && Object.keys(skillsGroups).map(key => (
                        <div className={`skills-content-groups-group group-${formatteString(key)}`} key={key}>
                            <div className="skills-content-groups-group-title">
                                {highlightText(key, true)}
                            </div>
                            <div className="skills-content-groups-group-container">
                                {skillsGroups[key].map(skill => {
                                    return (
                                        <div className={`skills-content-groups-group-container-skill skill-${formatteString(skill.name)}`} key={skill.name}>
                                            <div className="skills-content-groups-group-container-skill-name">
                                                {skill.favorite && (
                                                    <img className="logo-icon" src="icons/star.png" />
                                                )}
                                                {highlightText(skill.name)}
                                            </div>
                                            <Tooltip text={skill.text as string} context={skill.context as Context} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}