import { getFileUrl } from "@/utils/dbx/fetch_content_link"

interface ImagePageProps {
    name: string;
    file: string;
    getImgPath: (name: string, imgRelativePath: string) => string;
}

export default async function ImagePage({ name, file, getImgPath }: ImagePageProps) {
    const imgPath = getImgPath(name, file)
    const imgUrl = await getFileUrl(imgPath);

    return (<>
        <picture>
            <img src={imgUrl} alt={file} />
        </picture>
    </>)
}
