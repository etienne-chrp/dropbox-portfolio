import { AppConstants } from "@/utils/constants";
import { getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import { Metadata } from "next";
import ProjectDetailPage from "@/components/ProjectDetailPage";

type Props = {
    params: Promise<{
        name: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsAwaited = await params
    const artName = getNameWithoutOrderPrefix(decodeURIComponent(paramsAwaited.name));
    return {
        title: artName,
        openGraph: {
            images: [`/art/${paramsAwaited.name}/thumbnail/${AppConstants.ART_MAIN_IMG_NAME}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const paramsAwaited = await params
    const uriDecodedName = decodeURIComponent(paramsAwaited.name);

    return (
        <ProjectDetailPage
            name={uriDecodedName}
            routePrefix="art"
            getImgFolderPath={AppConstants.getArtImgFolderPath}
            getDescriptionPath={AppConstants.getArtDescriptionPath}
            getInfoPath={AppConstants.getArtInfoPath}
            getImgPath={AppConstants.getArtImgPath}
            mainImgName={AppConstants.ART_MAIN_IMG_NAME}
        />
    )
}
