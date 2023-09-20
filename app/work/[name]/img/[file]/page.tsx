import { AppConstants } from "@/utils/constants";
import { getFileUrl } from "@/utils/dbx/fetch_content_link"
import { getNameWithoutOrderPrefix, getNameWithoutExtensionSuffix } from "@/utils/nameFormat";
import { Metadata } from "next";

type Props = {
    params: {
        name: string;
        file: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const workName = getNameWithoutOrderPrefix(decodeURIComponent(params.name));
    const imgName = getNameWithoutExtensionSuffix(getNameWithoutOrderPrefix(decodeURIComponent(params.file)));
    return {
        title: `${imgName} | ${workName}`,
        openGraph: {
            images: [`/work/${params.name}/thumbnail/${params.file}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const workName = decodeURIComponent(params.name);
    const imgName = decodeURIComponent(params.file);

    const imgPath = AppConstants.getWorkImgPath(workName, imgName)
    
    const imgUrl = await getFileUrl(imgPath);

    return (<>
        <picture>
            <img src={imgUrl} alt={imgName} />
        </picture>
    </>)
}