import ProjectTechno from "./project-techno.interface";

export default interface ProjectInterface {
    name: string;
    img: string;
    logo: string;
    description: string;
    url?: string;
    stack?: ProjectTechno[];
}