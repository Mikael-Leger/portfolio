export type Context = Partial<Record<'academic' | 'personal' | 'professional', string>>;

export default interface SkillInterface {
    name: string;
    type: string;
    text?: string;
    context?: Context;
    favorite?: boolean;
}