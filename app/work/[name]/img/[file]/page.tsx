import { AppConstants } from "@/utils/constants";
import { getFileUrl } from "@/utils/dbx/fetch_content_link"
import { getNameWithoutOrderPrefix, getNameWithoutExtensionSuffix } from "@/utils/nameFormat";
import { Metadata } from "next";

type Props = {
    params:  Promise<{
        name: string;
        file: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { name, file } = await params

    const workName = getNameWithoutOrderPrefix(decodeURIComponent(name));
    const imgName = getNameWithoutExtensionSuffix(getNameWithoutOrderPrefix(decodeURIComponent(file)));
    return {
        title: `${imgName} | ${workName}`,
        openGraph: {
            images: [`/work/${name}/thumbnail/${file}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const { name, file } = await params

    const workName = decodeURIComponent(name);
    const imgName = decodeURIComponent(file);

    const imgPath = AppConstants.getWorkImgPath(workName, imgName)
    
    const imgUrl = await getFileUrl(imgPath);

    return (<>
        <picture>
            <img src={imgUrl} alt={imgName} />
        </picture>
    </>)
}