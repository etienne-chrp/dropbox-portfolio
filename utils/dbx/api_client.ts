import { Dropbox, files as dbxFile } from "dropbox"
import { cache } from 'react'
import { dbxClientId, dbxClientSecret, dbxRefreshToken } from "./common";

const dbx = new Dropbox({
    refreshToken: dbxRefreshToken,
    clientId: dbxClientId,
    clientSecret: dbxClientSecret
})

export const revalidate = 600 // revalidate the data at most every minute

export const getFile = cache(async (sharedLink: string, path: string) => {
    return (await dbx.sharingGetSharedLinkFile({ url: sharedLink, path: path }))
});

const getTextFile = cache(async (sharedLink: string, path: string): Promise<string> => {
    const response = await getFile(sharedLink, path);
    let result: any = response.result;
    let binaries: Buffer = result.fileBinary;

    return binaries.toString();
});

export const getTextFileOrErrorMsg = cache(async (sharedLink: string, path: string): Promise<string> => {
    let errorMsg = `Failed to retrieve text file for ${path}`
    let result = undefined
    try {
        result = await getTextFile(sharedLink, path);
    } catch (e) {
        console.error(`${errorMsg}: ${e}`)
    }

    return result ?? errorMsg;
});

export const getFolder = cache(async (sharedLink: string, path: string) => {
    return (await dbx.sharingGetSharedLinkMetadata({ url: sharedLink, path: path })).result
});

export const listFolder = cache(async (sharedLink: string, path: string) => {
    return (await dbx.filesListFolder({ path: path, shared_link: { url: sharedLink } })).result
});

export const getThumbnail = cache(async (sharedLink: string, path: string, size: dbxFile.ThumbnailSize) => {
    return await dbx.filesGetThumbnailV2({
        resource: {
            '.tag': "link",
            url: sharedLink,
            path: path
        },
        size: size
    })
});

export async function getThumbnailBase64(sharedLink: string, path: string) {
    const response = await getThumbnail(sharedLink, path, { ".tag": "w960h640" });
    let result: any = response.result;
    let binaries: Buffer = result.fileBinary;

    const dataImagePrefix = `data:image/png;base64,`
    return `${dataImagePrefix}${binaries.toString('base64')}`
}
