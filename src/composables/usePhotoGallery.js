import { ref } from "vue";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { isPlatform, alertController, loadingController } from "@ionic/vue";

export function usePhotoGallery() {
    const photos = ref([]);
    const APP_DIRECTORY = Directory.Documents;
    const ROOT_FOLDER = "my-photo-collections";

    const loading = loadingController.create({});

    const controlLoadingScreen = async (option, message) => {
        const loadingScreen = await loading;
        loadingScreen.message = message;

        if (option === "start") {
            await loadingScreen.present();
            return true;
        } else {
            await loadingScreen.dismiss();
            return false;
        }
    };

    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });

    const savePicture = async (photo, fileName) => {
        let base64Data;
        // "hybrid" will detect Cordova or Capacitor;
        if (isPlatform("hybrid")) {
            const file = await Filesystem.readFile({
                // eslint-disable-next-line
                path: photo.path,
            });
            base64Data = file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            // eslint-disable-next-line
            const response = await fetch(photo.webPath);
            const blob = await response.blob();
            base64Data = await convertBlobToBase64(blob);
        }
        const savedFile = await Filesystem.writeFile({
            path: ROOT_FOLDER + "/" + fileName,
            data: base64Data,
            directory: APP_DIRECTORY,
        });

        if (isPlatform("hybrid")) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
            };
        }
    };

    const takePhoto = async () => {
        try {
            controlLoadingScreen("start", "Loading camera");

            const permissions = await Camera.checkPermissions();

            if (
                permissions.camera === "granted" &&
                permissions.photos === "granted"
            ) {
                controlLoadingScreen("stop", "Loading camera");

                const photo = await Camera.getPhoto({
                    resultType: CameraResultType.Uri,
                    source: CameraSource.Camera,
                    quality: 100,
                });

                let fileName = new Date().getTime();

                const alert = await alertController.create({
                    header: "File name",
                    message: "Please specify the name of the new photo",
                    inputs: [
                        {
                            name: "name",
                            type: "text",
                            placeholder: "new-photo-name",
                        },
                    ],
                    buttons: [
                        {
                            text: "Cancel",
                            role: "cancel",
                        },
                        {
                            text: "Confirm",
                            role: "confirm",
                            handler: (data) => {
                                fileName = data.name;
                            },
                        },
                        {
                            text: "Default name",
                            role: "default",
                        },
                    ],
                });

                await alert.present();

                const { role } = await alert.onDidDismiss();

                if (role !== "cancel") {
                    fileName += ".jpeg";
                    const savedFileImage = await savePicture(photo, fileName);
                    photos.value = [savedFileImage, ...photos.value];
                }

                return;
            }
            Camera.requestPermissions();
        } catch (error) {
            console.warn(error.message);
        } finally {
            controlLoadingScreen("stop", "Loading camera");
        }
    };

    const deletePhoto = async (photo) => {
        try {
            // Remove this photo from the Photos reference data array
            photos.value = photos.value.filter(
                (p) => p.filepath !== photo.filepath
            );

            // delete photo file from filesystem
            const filename = photo.filepath.substr(
                photo.filepath.lastIndexOf("/") + 1
            );

            await Filesystem.deleteFile({
                path: ROOT_FOLDER + "/" + filename,
                directory: APP_DIRECTORY,
            });
        } catch (error) {
            console.warn(error.message);
        }
    };

    return {
        photos,
        takePhoto,
        deletePhoto,
        controlLoadingScreen,
    };
}
