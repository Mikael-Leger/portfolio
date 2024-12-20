import CustomColor from "./custom-color.interface";

export default interface Preferences {
    theme: string;
    color: CustomColor | undefined;
}