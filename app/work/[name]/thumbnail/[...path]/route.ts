import { AppConstants } from "@/utils/constants";
import { handleThumbnailRequest } from "@/utils/thumbnailRoute";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string, path: string[] }> }) {
    return handleThumbnailRequest(params, AppConstants.getWorkImgPath);
}
