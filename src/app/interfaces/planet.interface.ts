import { RefObject } from "react";

export interface PlanetProperty {
    default: number | string;
    unit: string;
    gap?: number;
}

export interface PlanetBase {
    width: PlanetProperty;
    bottom?: PlanetProperty;
    left?: PlanetProperty;
    right?: PlanetProperty;
    transform?: string;
    marginTop?: PlanetProperty;
    marginLeft?: PlanetProperty;
    marginRight?: PlanetProperty;
}

export interface PlanetBaseStyle {
    width: string;
    zIndex?: number;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
    marginTop?: string;
    marginLeft?: string;
    marginRight?: string;
}

export interface Planets {
    name: string;
    base: PlanetBase;
    ref: RefObject<null>;
    zIndex?: number;
}