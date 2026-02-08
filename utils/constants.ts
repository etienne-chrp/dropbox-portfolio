export class AppConstants {
    static readonly WORK_FOLDER_PATH = '/work';
    static readonly WORK_IMG_FOLDER_NAME = 'img';
    static readonly WORK_MAIN_IMG_NAME = '000 main.jpg';
    static readonly WORK_DESCRIPTION_NAME = 'description.md';
    static readonly WORK_INFO_NAME = 'info.md';
    static readonly ART_FOLDER_PATH = '/art';
    static readonly ART_IMG_FOLDER_NAME = 'img';
    static readonly ART_MAIN_IMG_NAME = '000 main.jpg';
    static readonly ART_DESCRIPTION_NAME = 'description.md';
    static readonly ART_INFO_NAME = 'info.md';
    static readonly ABOUT_FOLDER_PATH = '/about';
    static readonly ABOUT_NAME = 'about.md';

    static getWorkImgFolderPath(workName: string) {
        return `${AppConstants.WORK_FOLDER_PATH}/${workName}/${AppConstants.WORK_IMG_FOLDER_NAME}`
    }

    static getWorkImgPath(workName: string, imgRelativePath: string) {
        return `${AppConstants.WORK_FOLDER_PATH}/${workName}/${AppConstants.WORK_IMG_FOLDER_NAME}/${imgRelativePath}`
    }

    static getWorkMainImgPath(workName: string) {
        return `${AppConstants.WORK_FOLDER_PATH}/${workName}/${AppConstants.WORK_IMG_FOLDER_NAME}/${AppConstants.WORK_MAIN_IMG_NAME}`
    }

    static getWorkDescriptionPath(workName: string) {
        return `${AppConstants.WORK_FOLDER_PATH}/${workName}/${AppConstants.WORK_DESCRIPTION_NAME}`
    }

    static getWorkInfoPath(workName: string) {
        return `${AppConstants.WORK_FOLDER_PATH}/${workName}/${AppConstants.WORK_INFO_NAME}`
    }

    static getArtImgFolderPath(artName: string) {
        return `${AppConstants.ART_FOLDER_PATH}/${artName}/${AppConstants.ART_IMG_FOLDER_NAME}`
    }

    static getArtImgPath(artName: string, imgRelativePath: string) {
        return `${AppConstants.ART_FOLDER_PATH}/${artName}/${AppConstants.ART_IMG_FOLDER_NAME}/${imgRelativePath}`
    }

    static getArtMainImgPath(artName: string) {
        return `${AppConstants.ART_FOLDER_PATH}/${artName}/${AppConstants.ART_IMG_FOLDER_NAME}/${AppConstants.ART_MAIN_IMG_NAME}`
    }

    static getArtDescriptionPath(artName: string) {
        return `${AppConstants.ART_FOLDER_PATH}/${artName}/${AppConstants.ART_DESCRIPTION_NAME}`
    }

    static getArtInfoPath(artName: string) {
        return `${AppConstants.ART_FOLDER_PATH}/${artName}/${AppConstants.ART_INFO_NAME}`
    }

    static getAboutPath() {
        return `${AppConstants.ABOUT_FOLDER_PATH}/${AppConstants.ABOUT_NAME}`
    }
};