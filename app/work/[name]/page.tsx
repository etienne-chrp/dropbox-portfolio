import { AppConstants } from "@/utils/constants";
import { getTextFileOrErrorMsg, listFolder } from "@/utils/dbx/api_client";
import { SharedLink } from "@/utils/dbx/common";
import Link from "next/link";
import ReactMarkdown from 'react-markdown'
import DynamicImage from "@/components/DynamicImage";

export default async function Page({ params }: { params: { name: string } }) {
    const uriDecodedName = decodeURIComponent(params.name);

    const descriptionMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getWorkDescriptionPath(uriDecodedName))
    const infoMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getWorkInfoPath(uriDecodedName))

    let imgFolder = undefined;
    try {
        imgFolder = await listFolder(SharedLink, AppConstants.getWorkImgFolderPath(uriDecodedName));
    } catch (e) {
        let errorMsg = `There was an error loading the image folder: ${AppConstants.getWorkImgFolderPath(uriDecodedName)}. Is this folder existing?`
        console.error(`${errorMsg}:\n${e}`)
        return (<div>{errorMsg}</div>)
    }
    const imageList = imgFolder.entries.filter(img => img.name != AppConstants.WORK_MAIN_IMG_NAME);

    return (
        <div className="mt-8">
            <ReactMarkdown>{infoMarkdown}</ReactMarkdown>
            <div className="mt-4 mb-4">
                <Link href={AppConstants.getWorkMainImgPath(uriDecodedName)}>
                    <DynamicImage
                        src={`/work/${params.name}/thumbnail/${AppConstants.WORK_MAIN_IMG_NAME}`}
                        alt={AppConstants.getWorkMainImgPath(uriDecodedName)}
                        priority={true}
                    />
                </Link>
            </div>
            <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
            <div className="flex flex-col">
                {imageList.map(image => {
                    return (
                        <div key={image.name} className="min-w-fit mb-4 mt-4 items-center">
                            <Link href={AppConstants.getWorkImgPath(uriDecodedName, image.name)}>
                                <DynamicImage
                                    src={`/work/${params.name}/thumbnail/${image.name}`}
                                    alt={AppConstants.getWorkImgPath(uriDecodedName, image.name)}
                                />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}