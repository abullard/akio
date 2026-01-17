import type { OptionDefinition } from 'command-line-args';

export type Package = {
    name: string;
    version: string;
};

export interface ScriptsDescribed {
    name: string;
    version: string;
    scripts: Record<string, string>;
    scriptDescriptions: Record<string, string>;
    isRoot: boolean;
}

export type PackageScriptsAndDescriptions = ScriptsDescribed[];

export interface UsageOptionDefintions extends OptionDefinition {
    description?: string;
}

export type Options = {
    input: boolean;
    format: boolean;
    descriptions: boolean;
    pin: boolean;
    searchValue?: string;
    targetPackage?: string;
};

export type PackageJsonContents = {
    default: {
        scriptDescriptions?: Record<string, string>;
        scripts?: Record<string, string>;
        name: string;
        version: string;
    };
};
