import { SharedLink } from "./common"
import { getFolder } from "./api_client";

async function getRedirectUrl(url: string) {
    const response = await fetch(url, { redirect: "manual" });

    if (response.status != 302)
        throw (`There was an issue while getting redirect url: ${response.status} - ${response.statusText}`)

    const location = response.headers.get("location");
    if (!location)
        throw (`There was an issue while getting redirect url: location is empty`)

    return location;
}

export const getFileUrl = async (imgPath: string) => {
    const imgFolderMetadata = await getFolder(SharedLink, imgPath);

    const imgDlUrl = new URL(imgFolderMetadata.url)
    imgDlUrl.searchParams.delete("dl");
    imgDlUrl.searchParams.append("dl", "1");

    return await getRedirectUrl(imgDlUrl.href);
}

