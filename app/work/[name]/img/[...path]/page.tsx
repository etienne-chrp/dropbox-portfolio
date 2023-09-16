import { AppConstants } from "@/utils/constants";
import { getFileUrl } from "@/utils/dbx/fetch_content_link"

export default async function Page({ params }: { params: { name: string, path: string[] } }) {
    const uriDecodedName = decodeURIComponent(params.name);
    const imgRelativePath = params.path.map(p => (decodeURIComponent(p))).join('/');

    const imgPath = AppConstants.getWorkImgPath(uriDecodedName, imgRelativePath)
    
    const imgUrl = await getFileUrl(imgPath);

    return (<>
        <picture>
            <img src={imgUrl} alt={imgRelativePath} />
        </picture>
    </>)
}