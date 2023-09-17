import DynamicImage from "@/components/DynamicImage";
import { AppConstants } from "@/utils/constants";
import { listFolder } from "@/utils/dbx/api_client"
import { SharedLink } from "@/utils/dbx/common";
import { getNameWithoutOrderPrefix } from "@/utils/nameFormat";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const folderList = await listFolder(SharedLink, AppConstants.WORK_FOLDER_PATH);
  const works = await Promise.all(
    folderList.entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async folder => {
        const path = `${AppConstants.WORK_FOLDER_PATH}/${folder.name}`
        const workName = getNameWithoutOrderPrefix(folder.name);
        const mainImagePath = `${path}/${AppConstants.WORK_IMG_FOLDER_NAME}/${AppConstants.WORK_MAIN_IMG_NAME}`;

        return {
          folder: folder,
          path: path,
          workName: workName,
          mainImagePath: mainImagePath,
        };
      }))

  return (
    <main>
      <div className="flex sm:flex-row flex-wrap">
        {
          works.map(work => {
            return (
              <div key={work.folder.name} className="basis-full sm:basis-[calc(33.33%)] m-auto sm:m-0 sm:p-3 my-2 flex flex-col items-center">
                <Link href={`/work/${work.folder.name}`} className="grow flex m-auto items-center w-full aspect-[5/4]">
                  <DynamicImage
                    src={`/work/${work.folder.name}/thumbnail/${AppConstants.WORK_MAIN_IMG_NAME}`}
                    alt={work.mainImagePath}
                    thumbnail
                    fill
                    priority
                  />
                </Link>
                <div className="mt-2">{work.workName}</div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
