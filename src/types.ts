import { OptionDefinition } from "command-line-args";

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

export type CliOptions = {
    showInput: boolean;
    showFormatting: boolean;
    skipDescriptions: boolean;
    searchValue?: string;
};

export interface UsageOptionDefintions extends OptionDefinition {
    description?: string;
}
