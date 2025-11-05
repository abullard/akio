import { formatError } from 'src/formatting/format-output';

export type NpmPackageMeta = {
    name: string;
    'dist-tags': Record<keyof DistributionTags, string>;
};

type DistributionTags = {
    latest: string;
};

const npmRegistryUrl = (pkgName: string): string => `https://registry.npmjs.org/${encodeURIComponent(pkgName)}`;

const fetchNpmMeta = async (pkgName: string): Promise<NpmPackageMeta> => {
    const res = await fetch(npmRegistryUrl(pkgName));
    if (!res.ok) formatError(`Failed to fetch npm metadata for ${pkgName}: ${res.status}`);
    return res.json() as Promise<NpmPackageMeta>;
};

export const fetchLatestVersion = async (pkgName: string): Promise<string> => {
    const meta = await fetchNpmMeta(pkgName);
    const latest = meta['dist-tags'].latest;

    return latest;
};
