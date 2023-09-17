import DbxThumbnail from "@/components/dbx_thumbnail";
import { AppConstants } from "@/utils/constants";
import { getTextFileOrErrorMsg, listFolder } from "@/utils/dbx/api_client";
import { SharedLink } from "@/utils/dbx/common";
import Link from "next/link";
import ReactMarkdown from 'react-markdown'

export default async function Page({ params }: { params: { name: string } }) {
    const uriDecodedName = decodeURIComponent(params.name);

    const descriptionMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getWorkDescriptionPath(uriDecodedName))
    const infoMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getWorkInfoPath(uriDecodedName))

    const thumbnailMainImg = await DbxThumbnail(SharedLink, AppConstants.getWorkMainImgPath(uriDecodedName));

    let imgFolder = undefined;
    try {
        imgFolder = await listFolder(SharedLink, AppConstants.getWorkImgFolderPath(uriDecodedName));
    } catch (e) {
        let errorMsg = `There was an error loading the image folder: ${AppConstants.getWorkImgFolderPath(uriDecodedName)}
        
        Is this folder existing?`
        console.error(`${errorMsg}
        
        ${e}`)

        return (
            <div>{errorMsg}</div>
        )
    }

    const imageList = imgFolder.entries.filter(img => img.name != AppConstants.WORK_MAIN_IMG_NAME);
    const thumbnails = await Promise.all(imageList.map(async image => {
        const thumbnail = await DbxThumbnail(SharedLink, AppConstants.getWorkImgPath(uriDecodedName, image.name));
        return { image: image, thumbnail: thumbnail };
    }))

    return (
        <div className="mt-8">
            <ReactMarkdown>{infoMarkdown}</ReactMarkdown>
            <div className="mt-4 mb-4">
                <Link href={AppConstants.getWorkMainImgPath(uriDecodedName)}>
                    {thumbnailMainImg}
                </Link>
            </div>
            <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
            <div className="flex flex-col">
                {thumbnails.map(thumbnail => {
                    return (
                        <div key={thumbnail.image.name} className="min-w-fit mb-4 mt-4 items-center">
                            <Link href={AppConstants.getWorkImgPath(uriDecodedName, thumbnail.image.name)}>
                                {thumbnail.thumbnail}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}