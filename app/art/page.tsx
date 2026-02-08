import FolderGallery from "@/components/FolderGallery";

  export const dynamic = 'force-dynamic'

  export default async function Page() {
    return (
      <FolderGallery
        folderPath="/art"
        routePrefix="art"
        imgFolderName="img"
        mainImgName="000 main.jpg"
        itemAspectRatio="aspect-4/5"
      />
    )
  }