import { TextByLanguage } from "../types/language";

export type Context = Partial<Record<'academic' | 'personal' | 'professional', string>>;

export default interface SkillInterface {
    name: string | TextByLanguage;
    type: TextByLanguage;
    text?: TextByLanguage;
    context?: Context;
    favorite?: boolean;
}