import { AppConstants } from "@/utils/constants";
import { getNameWithoutOrderPrefix, getNameWithoutExtensionSuffix } from "@/utils/nameFormat";
import { Metadata } from "next";
import ImagePage from "@/components/ImagePage";

type Props = {
    params:  Promise<{
        name: string;
        file: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { name, file } = await params

    const artName = getNameWithoutOrderPrefix(decodeURIComponent(name));
    const imgName = getNameWithoutExtensionSuffix(getNameWithoutOrderPrefix(decodeURIComponent(file)));
    return {
        title: `${imgName} | ${artName}`,
        openGraph: {
            images: [`/art/${name}/thumbnail/${file}`],
        },
    }
}

export default async function Page({ params }: Props) {
    const { name, file } = await params

    const artName = decodeURIComponent(name);
    const imgName = decodeURIComponent(file);

    return (
        <ImagePage
            name={artName}
            file={imgName}
            getImgPath={AppConstants.getArtImgPath}
        />
    )
}
