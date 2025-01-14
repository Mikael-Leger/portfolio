import { TextByLanguage } from "../types/language";
import ProjectTechno from "./project-techno.interface";
import Status from "./status.interface";

export default interface ProjectInterface {
    name: string;
    img: string;
    logo: string;
    description: TextByLanguage;
    status?: Status,
    url?: string;
    stack?: ProjectTechno[];
    date?: string;
}