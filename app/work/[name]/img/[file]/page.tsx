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

    return (
        <ImagePage
            name={workName}
            file={imgName}
            getImgPath={AppConstants.getWorkImgPath}
        />
    )
}