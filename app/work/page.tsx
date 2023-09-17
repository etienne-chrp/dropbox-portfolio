import DbxThumbnail from "@/components/dbx_thumbnail";
import { AppConstants } from "@/utils/constants";
import { listFolder } from "@/utils/dbx/api_client"
import { SharedLink } from "@/utils/dbx/common";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const folderList = await listFolder(SharedLink, AppConstants.WORK_FOLDER_PATH);
  const works = await Promise.all(
    folderList.entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(async folder => {
        const path = `${AppConstants.WORK_FOLDER_PATH}/${folder.name}`
        const mainImagePath = `${path}/${AppConstants.WORK_IMG_FOLDER_NAME}/${AppConstants.WORK_MAIN_IMG_NAME}`;

        let mainImageThumbnail = await DbxThumbnail(SharedLink, mainImagePath, "max-h-64");

        return {
          folder: folder,
          path: path,
          mainImagePath: mainImagePath,
          mainImageThumbnail: mainImageThumbnail
        };
      }))

  return (
    <main>
      <div className="flex flex-row flex-wrap">
        {
          works.map(work => {
            return (
              <div key={work.folder.name} className="basis-full sm:basis-[calc(33.33%)] m-auto sm:m-0 p-4 mt-2 mb-2 flex flex-col items-center">
                <div className="grow flex m-auto items-center">
                  <Link href={`/work/${work.folder.name}`}>
                    {work.mainImageThumbnail}
                  </Link>
                </div>
                <div className="mt-2 h-16">{work.folder.name}</div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}

