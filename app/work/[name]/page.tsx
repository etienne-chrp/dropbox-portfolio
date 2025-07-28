import { AppConstants } from "@/utils/constants";
import { getTextFileOrErrorMsg, listFolder } from "@/utils/dbx/api_client";
import { SharedLink } from "@/utils/dbx/common";
import Link from "next/link";
import DynamicImage from "@/components/DynamicImage";
import { getNameWithoutExtensionSuffix, getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import ReactMarkdownPortfolio from "@/components/ReactMarkdownPortfolio";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        name: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsAwaited = await params
    const workName = getNameWithoutOrderPrefix(decodeURIComponent(paramsAwaited.name));
    return {
        title: workName,
        openGraph: {
            images: [`/work/${paramsAwaited.name}/thumbnail/${AppConstants.WORK_MAIN_IMG_NAME}`],
        },
    }
}

const WorkImage = ({ name, img_key, workName, workDisplayName, hover, priority }: {
    name: string, img_key?: string, workName: string, workDisplayName: string, hover?: boolean, priority?: boolean
}) => {
    return (
        <div className="relative">
            <div key={img_key} className={`peer my-4 transition-all ${hover && 'sm:hover:brightness-50'}`}>
                <Link href={AppConstants.getWorkImgPath(workDisplayName, name)}>
                    <DynamicImage
                        src={`/work/${workName}/thumbnail/${name}`}
                        alt={AppConstants.getWorkImgPath(workDisplayName, name)}
                        priority={priority}
                    />
                </Link>
            </div>
            {hover &&
                <div className="sm:peer-hover:block hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none">{getNameWithoutExtensionSuffix(getNameWithoutOrderPrefix(name))}</div>
            }
        </div>
    )
}

export default async function Page({ params }: Props) {
    const paramsAwaited = await params
    const uriDecodedName = decodeURIComponent(paramsAwaited.name);

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
    const imageList = imgFolder.entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(img => img.name.toLowerCase() != AppConstants.WORK_MAIN_IMG_NAME.toLowerCase());

    return (
        <div className="mt-6">
            <ReactMarkdownPortfolio>{infoMarkdown}</ReactMarkdownPortfolio>
            <WorkImage name={AppConstants.WORK_MAIN_IMG_NAME} workName={paramsAwaited.name} workDisplayName={uriDecodedName} priority />
            <ReactMarkdownPortfolio>{descriptionMarkdown}</ReactMarkdownPortfolio>
            <div className="flex flex-col">
                {imageList.map(image => {
                    return (
                        <WorkImage key={image.name} name={image.name} workName={paramsAwaited.name} workDisplayName={uriDecodedName} hover />
                    )
                })}
            </div>
        </div>
    )
}