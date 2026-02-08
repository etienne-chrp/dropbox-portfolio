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
    const workName = getNameWithoutOrderPrefix(decodeURIComponent(paramsAwaited.name));
    return {
        title: workName,
        openGraph: {
            images: [`/work/${paramsAwaited.name}/thumbnail/${AppConstants.WORK_MAIN_IMG_NAME}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const paramsAwaited = await params
    const uriDecodedName = decodeURIComponent(paramsAwaited.name);

    return (
        <ProjectDetailPage
            name={uriDecodedName}
            routePrefix="work"
            getImgFolderPath={AppConstants.getWorkImgFolderPath}
            getDescriptionPath={AppConstants.getWorkDescriptionPath}
            getInfoPath={AppConstants.getWorkInfoPath}
            getImgPath={AppConstants.getWorkImgPath}
            mainImgName={AppConstants.WORK_MAIN_IMG_NAME}
        />
    )
}