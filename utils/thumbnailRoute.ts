import { getThumbnail } from "@/utils/dbx/api_client"
import { NextResponse } from "next/server";
import { SharedLink } from "@/utils/dbx/common";

export async function handleThumbnailRequest(
    params: Promise<{ name: string, path: string[] }>,
    getImgPath: (name: string, imgRelativePath: string) => string
) {
    const paramsAwaited = await params

    const uriDecodedName = decodeURIComponent(paramsAwaited.name);
    const imgRelativePath = paramsAwaited.path.map(p => (decodeURIComponent(p))).join('/');

    const imgPath = getImgPath(uriDecodedName, imgRelativePath)
    const thumbnail = await getThumbnail(SharedLink, imgPath, { ".tag": "w2048h1536" })
    let binaries = (thumbnail.result as any).fileBlob as Blob;

    return new NextResponse(await binaries.arrayBuffer(), { headers: {
        'content-type': 'image/jpg',
        'cache-control': 'max-age=600'
    } })
}
