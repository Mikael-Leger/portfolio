import ProjectTechno from "./project-techno.interface";
import Status from "./status.interface";

export default interface ProjectInterface {
    name: string;
    img: string;
    logo: string;
    description: string;
    status?: Status,
    url?: string;
    stack?: ProjectTechno[];
}