import DynamicImage from "@/components/DynamicImage";
import { listFolder } from "@/utils/dbx/api_client"
import { SharedLink } from "@/utils/dbx/common";
import { getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import Link from "next/link";

interface FolderGalleryProps {
  folderPath: string;
  routePrefix: string;
  imgFolderName: string;
  mainImgName: string;
  itemAspectRatio?: string;
}

export default async function FolderGallery({
  folderPath,
  routePrefix,
  imgFolderName,
  mainImgName,
  itemAspectRatio
}: FolderGalleryProps) {
  const folderList = await listFolder(SharedLink, folderPath);
  const items = await Promise.all(
    folderList.entries
      .sort((a, b) => b.name.localeCompare(a.name))
      .map(async folder => {
        const path = `${folderPath}/${folder.name}`
        const itemName = getNameWithoutOrderPrefix(folder.name);
        const mainImagePath = `${path}/${imgFolderName}/${mainImgName}`;

        return {
          folder: folder,
          path: path,
          itemName: itemName,
          mainImagePath: mainImagePath,
        };
      }))

  return (
    <main>
      <div className="flex sm:flex-row flex-wrap">
        {
          items.map(item => {
            return (
              <div key={item.folder.name} className="basis-full sm:basis-[calc(33.33%)] m-auto sm:m-0 sm:p-3 my-2 flex flex-col items-center">
                <Link href={`/${routePrefix}/${item.folder.name}`} className={`grow flex m-auto items-center w-full ${itemAspectRatio || "aspect-5/4"}`}>
                  <DynamicImage
                    src={(`/${routePrefix}/${encodeURIComponent(item.folder.name)}/thumbnail/${mainImgName}`)}
                    alt={item.mainImagePath}
                    thumbnail
                    fill
                    priority
                  />
                </Link>
                <div className="mt-2">{item.itemName}</div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
