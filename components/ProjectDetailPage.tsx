import { getTextFileOrErrorMsg, listFolder } from "@/utils/dbx/api_client";
import { SharedLink } from "@/utils/dbx/common";
import Link from "next/link";
import DynamicImage from "@/components/DynamicImage";
import { getNameWithoutExtensionSuffix, getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import ReactMarkdownPortfolio from "@/components/ReactMarkdownPortfolio";

interface ProjectDetailPageProps {
    name: string;
    routePrefix: string;
    getImgFolderPath: (name: string) => string;
    getDescriptionPath: (name: string) => string;
    getInfoPath: (name: string) => string;
    getImgPath: (name: string, img: string) => string;
    mainImgName: string;
}

const ProjectImage = ({ name, img_key, projectName, projectDisplayName, routePrefix, hover, priority, getImgPath }: {
    name: string;
    img_key?: string;
    projectName: string;
    projectDisplayName: string;
    routePrefix: string;
    hover?: boolean;
    priority?: boolean;
    getImgPath: (name: string, img: string) => string;
}) => {
    return (
        <div className="relative">
            <div key={img_key} className={`peer my-4 transition-all ${hover && 'sm:hover:brightness-50'}`}>
                <Link href={getImgPath(projectDisplayName, name)}>
                    <DynamicImage
                        src={`/${routePrefix}/${projectName}/thumbnail/${name}`}
                        alt={getImgPath(projectDisplayName, name)}
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

export default async function ProjectDetailPage({
    name,
    routePrefix,
    getImgFolderPath,
    getDescriptionPath,
    getInfoPath,
    getImgPath,
    mainImgName
}: ProjectDetailPageProps) {
    const descriptionMarkdown = await getTextFileOrErrorMsg(SharedLink, getDescriptionPath(name))
    const infoMarkdown = await getTextFileOrErrorMsg(SharedLink, getInfoPath(name))

    let imgFolder = undefined;
    try {
        imgFolder = await listFolder(SharedLink, getImgFolderPath(name));
    } catch (e) {
        let errorMsg = `There was an error loading the image folder: ${getImgFolderPath(name)}. Is this folder existing?`
        console.error(`${errorMsg}:\n${e}`)
        return (<div>{errorMsg}</div>)
    }
    const imageList = imgFolder.entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(img => img.name.toLowerCase() != mainImgName.toLowerCase());

    return (
        <div className="mt-6">
            <ReactMarkdownPortfolio>{infoMarkdown}</ReactMarkdownPortfolio>
            <ProjectImage name={mainImgName} projectName={name} projectDisplayName={name} routePrefix={routePrefix} getImgPath={getImgPath} priority />
            <ReactMarkdownPortfolio>{descriptionMarkdown}</ReactMarkdownPortfolio>
            <div className="flex flex-col">
                {imageList.map(image => {
                    return (
                        <ProjectImage key={image.name} name={image.name} projectName={name} projectDisplayName={name} routePrefix={routePrefix} getImgPath={getImgPath} hover />
                    )
                })}
            </div>
        </div>
    )
}
