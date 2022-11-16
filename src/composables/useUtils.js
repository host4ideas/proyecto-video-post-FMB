import Global from "@/Global";
import { Filesystem } from "@capacitor/filesystem";
import { alertController } from "@ionic/vue";

export default function useUtils() {
    /**
     * Helper to create a folder using the path parameter.
     * @param {string} path New path for the new folder.
     * @returns {Promise<boolean>} True if completed, false if an error ocurred
     */
    const mkdirHelper = async (path) => {
        try {
            await Filesystem.mkdir({
                directory: Global.APP_DIRECTORY,
                path: path,
            });
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    };

    /**
     * Check if the dedicated folders for the app exist in Documents
     */
    async function checkRootFolder() {
        try {
            await Filesystem.readdir({
                directory: Global.APP_DIRECTORY,
                path: Global.ROOT_FOLDER,
            });
            console.log("Default folder exists.");
        } catch (error) {
            const alert = await alertController.create({
                header: "Choose root folder",
                message: `No default folder found. Default folder will be created in: <i>${Global.APP_DIRECTORY}/${Global.ROOT_FOLDER}</i>.<br/>
                                If you want to modify your collections, you can do it in the built-in File Explorer or through your smartphone's preferred File Explorer app.`,
                buttons: [
                    {
                        text: "OK",
                        role: "cancel",
                    },
                ],
            });
            await alert.present();
            // Create default
            await mkdirHelper(`${Global.ROOT_FOLDER}`);
            console.log(`Default folder created: ${Global.ROOT_FOLDER}`);
        }
    }

    /**
     * Convert File to base64 string
     */
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    };

    return {
        mkdirHelper,
        checkRootFolder,
        convertBlobToBase64
    };
}
