import FolderGallery from "@/components/FolderGallery";
import { AppConstants } from "@/utils/constants";

export const dynamic = 'force-dynamic'

export default async function Page() {
  return (
    <FolderGallery
      folderPath={AppConstants.WORK_FOLDER_PATH}
      routePrefix="work"
      imgFolderName={AppConstants.WORK_IMG_FOLDER_NAME}
      mainImgName={AppConstants.WORK_MAIN_IMG_NAME}
    />
  )
}
