import { Colors } from 'src/formatting/colors';

export type NpmPackageMeta = {
    name: string;
    'dist-tags': Record<keyof DistributionTags, string>;
};

type DistributionTags = {
    latest: string;
};

const npmRegistryUrl = (pkgName: string): string => `https://registry.npmjs.org/${encodeURIComponent(pkgName)}`;

const fetchNpmMeta = async (pkgName: string): Promise<NpmPackageMeta | undefined> => {
    const res = await fetch(npmRegistryUrl(pkgName));

    if (!res.ok) {
        return undefined;
    }

    return res.json() as Promise<NpmPackageMeta>;
};

export const fetchLatestVersion = async (pkgName: string): Promise<string | undefined> => {
    try {
        const meta = await fetchNpmMeta(pkgName);
        return meta?.['dist-tags'].latest;
    } catch (error) {
        console.warn(error);
        console.warn(`${Colors.yellow}Failed to fetch npm metadata for ${pkgName}.`);
        return undefined;
    }
};
