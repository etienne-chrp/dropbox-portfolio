import { AppConstants } from "@/utils/constants";
import { getThumbnail } from "@/utils/dbx/api_client"
import { NextResponse } from "next/server";
import { SharedLink } from "@/utils/dbx/common";

export async function GET(request: Request, { params }: { params: Promise<{ name: string, path: string[] }> }) {
    const paramsAwaited = await params

    const uriDecodedName = decodeURIComponent(paramsAwaited.name);
    const imgRelativePath = paramsAwaited.path.map(p => (decodeURIComponent(p))).join('/');

    const imgPath = AppConstants.getWorkImgPath(uriDecodedName, imgRelativePath)
    const thumbnail = await getThumbnail(SharedLink, imgPath, { ".tag": "w2048h1536" })
    let binaries = (thumbnail.result as any).fileBinary;

    return new NextResponse(binaries.buffer, { headers: { 
        'content-type': 'image/jpg',
        'cache-control': 'max-age=600'
    } })
}
