import { getThumbnailBase64 } from "@/utils/dbx/api_client"

export default async function DbxThumbnail(sharedLink: string, path: string, className?: string ) {
    let base64 = undefined
    try {
        base64 = await getThumbnailBase64(sharedLink, path)
    } catch (e) {
        console.error(`Failed to retrieve thumbnail for ${path}: ${e}`)
    }

    return base64 ? (
        <picture>
            <img className={`${className} m-auto`} src={base64} />
        </picture>
    ) : (
        <div>Missing: {path}</div>
    )
}