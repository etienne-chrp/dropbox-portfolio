import { AppConstants } from "@/utils/constants";
import { getFileUrl } from "@/utils/dbx/fetch_content_link"
import { getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import { Metadata } from "next";

type Props = {
    params: {
        name: string;
        img: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const workName = getNameWithoutOrderPrefix(decodeURIComponent(params.name));
    const imgName = getNameWithoutOrderPrefix(decodeURIComponent(params.img));
    return {
        title: `${imgName} | ${workName}`,
        openGraph: {
            images: [`/work/${params.name}/thumbnail/${params.img}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const workName = decodeURIComponent(params.name);
    const imgName = decodeURIComponent(params.img);

    const imgPath = AppConstants.getWorkImgPath(workName, imgName)
    
    const imgUrl = await getFileUrl(imgPath);

    return (<>
        <picture>
            <img src={imgUrl} alt={imgName} />
        </picture>
    </>)
}