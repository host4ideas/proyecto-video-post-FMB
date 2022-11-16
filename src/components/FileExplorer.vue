<template>
    <ion-header>
        <ion-toolbar
            class="toolbar"
            :color="data.copyFile ? 'secondary' : 'primary'"
        >
            <ion-button
                slot="start"
                title="Go back"
                v-if="
                    props.currentFolder != '' &&
                    props.currentFolder !== Global.ROOT_FOLDER
                "
                @click="handleBackButton()"
            >
                <ion-icon :icon="arrowBackCircleOutline" />
            </ion-button>
            <ion-button
                slot="end"
                title="Reload content"
                @click="loadDocuments()"
            >
                <ion-icon :icon="reloadOutline" />
            </ion-button>
            <ion-title>
                <div
                    :class="
                        isHybrid
                            ? 'scrolling-wrapper mobile-scroll'
                            : 'scrolling-wrapper'
                    "
                >
                    {{ props.currentFolder || "File Explorer" }}
                </div>
            </ion-title>
        </ion-toolbar>
    </ion-header>

    <!-- For opening a standard file picker -->
    <input
        hidden
        type="file"
        ref="filepicker"
        @change="fileSelected($event)"
        multiple
    />
    <!-- For opening a directory picker -->
    <input
        hidden
        ref="folderpicker"
        type="file"
        webkitdirectory
        multiple
        @change="folderSelected($event)"
    />

    <!-- Info if the directory is empty -->
    <ion-text
        color="medium"
        v-if="data.folderContent.length == 0"
        class="ion-padding ion-text-center"
    >
        <p>No documents found</p>
    </ion-text>

    <FolderContent
        :folderContent="data.folderContent"
        :itemClicked="itemClicked"
        :deleteDocument="deleteDocument"
        :startCopy="startCopy"
    />

    <!-- Fab to add files & folders -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
            v-if="data.copyFile"
            @click="cancelCopy()"
            color="danger"
            style="margin-bottom: 15px"
        >
            <ion-icon :icon="closeOutline" />
        </ion-fab-button>
        <ion-fab-button>
            <ion-icon :icon="add" />
        </ion-fab-button>
        <ion-fab-list side="top">
            <ion-button
                color="light"
                title="Create folder"
                aria-hidden="true"
                @click="createFolder()"
            >
                <ion-icon :icon="folderOutline" />
            </ion-button>
            <!-- Only workd on web -->
            <ion-button
                v-if="!isHybrid"
                color="light"
                title="Add folder"
                aria-hidden="true"
                @click="addFolder()"
            >
                <ion-icon :icon="fileTrayStackedOutline"></ion-icon>
            </ion-button>
            <ion-button
                color="light"
                title="Add files"
                aria-hidden="true"
                @click="addFiles()"
            >
                <ion-icon :icon="documentOutline" />
            </ion-button>
        </ion-fab-list>
    </ion-fab>
</template>

<script setup>
// Ionic
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonFab,
    IonFabButton,
    IonFabList,
    IonButton,
    IonText,
    alertController,
    toastController,
    isPlatform,
} from "@ionic/vue";
// Plugins
import { Filesystem } from "@capacitor/filesystem";
import { PreviewAnyFile } from "@ionic-native/preview-any-file";
// Custom components
import FolderContent from "./FolderContent";
// Icons
import {
    add,
    documentOutline,
    folderOutline,
    arrowBackCircleOutline,
    fileTrayStackedOutline,
    closeOutline,
    reloadOutline,
} from "ionicons/icons";
// Vue
import { defineProps, watch, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
// Global
import Global from "../Global";
// Utils
import useUtils from "../composables/useUtils";

const { mkdirHelper, checkRootFolder, convertBlobToBase64 } = useUtils();

const router = useRouter();

const props = defineProps({
    currentFolder: String,
});

const isHybrid = isPlatform("hybrid");

const data = reactive({
    folderContent: [],
    copyFile: null,
});

const filepicker = ref(null);
const folderpicker = ref(null);

/**
 * Load the documents from the actual path (gets it from props)
 */
const loadDocuments = async () => {
    try {
        const folderContent = await Filesystem.readdir({
            directory: Global.APP_DIRECTORY,
            path: props.currentFolder || "",
        });

        // The directory array is just strings
        // We add the information isFile to make life easier
        data.folderContent = folderContent.files.map((file) => {
            if (file.type === "directory") {
                file = {
                    ...file,
                };
            }
            return {
                name: file.name,
                isFile: file.type == "file",
                uri: file.uri.replace("/DOCUMENTS/", ""),
            };
        });

        return data.folderContent;
    } catch (e) {
        // Could be an error because the ROOT folder was deleted
        await checkRootFolder();
        console.log("CURRENT FOLDER: " + props.currentFolder);
        console.log(e.message);
        router.back();
        loadDocuments();
    }
};

/**
 * Copies a file using it's current uri (from) and the clicked folder's uri (to) passed as parameter.
 * @param {File} entry File to copy
 */
const finishCopyFile = async (entry) => {
    try {
        const current =
            props.currentFolder != "" ? `/${props.currentFolder}` : "";

        const fromUri = await Filesystem.getUri({
            directory: Global.APP_DIRECTORY,
            path: `${current}/${data.copyFile.name}`,
        });

        const destUri = await Filesystem.getUri({
            directory: Global.APP_DIRECTORY,
            path: `${current}/${entry.name}/${data.copyFile.name}`,
        });

        await Filesystem.copy({
            from: fromUri.uri,
            to: destUri.uri,
        });
    } catch (error) {
        console.warn(error);
    } finally {
        data.copyFile = null;
        loadDocuments();
    }
};

/**
 * Handles both a document or a folder to delete when delete button is clicked.
 * @param {*} entry File or folder to delete
 */
const deleteDocument = async (entry) => {
    if (entry.isFile) {
        await Filesystem.deleteFile({
            directory: Global.APP_DIRECTORY,
            path: props.currentFolder + "/" + entry.name,
        });
    } else {
        await Filesystem.rmdir({
            directory: Global.APP_DIRECTORY,
            path: props.currentFolder + "/" + entry.name,
            recursive: true, // Removes all files as well!
        });
    }
    loadDocuments();
};

/**
 * Triggers the copy process by modifying the value of copyFile reactive variable, therefore the UI is updated.
 * @param {File} file File or folder to copy.
 */
const startCopy = (file) => {
    data.copyFile = file;
};

/**
 * Cancels the copy process by erasing copyFile variable from memory, therefore the UI is updated.
 */
const cancelCopy = () => {
    data.copyFile = null;
};

function handleBackButton() {
    /*
        Due to history navigation between tabs is problematic.
        e.g.: /tabs/tab3/test/ -> /tab2/ -> /tabs/tab3/test/ -> tab back button -> undefined folder
    */
    let newPath = "";
    const folders = props.currentFolder.split("/");
    // Check if there is a prev folder from the URL
    if (folders[folders.indexOf(folders[folders.length - 2])]) {
        const openedFolder = folders[folders.length - 1];
        newPath = folders.join("/").replace(`/${openedFolder}`, "");
        newPath = encodeURIComponent(newPath);
        router.replace(newPath);
    } else {
        // If there isn`t a prev folder, means the root folder
        newPath = `/tabs/tab2/${Global.ROOT_FOLDER}`;
        router.replace(newPath);
    }
    newPath = null;
}

async function createFolder() {
    const alert = await alertController.create({
        header: "Create folder",
        message: "Please specify the name of the new folder",
        inputs: [
            {
                name: "name",
                type: "text",
                placeholder: "MyDir",
            },
        ],
        buttons: [
            {
                text: "Cancel",
                role: "cancel",
            },
            {
                text: "Create",
                handler: async (data) => {
                    await mkdirHelper(`${props.currentFolder}/${data.name}`);
                },
            },
        ],
    });

    await alert.present();
}

function addFiles() {
    filepicker.value.click();
}

function addFolder() {
    folderpicker.value.click();
}

async function fileSelected($event) {
    const selected = $event.target.files;

    for (let i = 0; i < selected.length; i++) {
        try {
            const base64Data = await convertBlobToBase64(selected[i]);

            await Filesystem.writeFile({
                path: `${props.currentFolder}/${selected[i].name}`,
                data: base64Data,
                directory: Global.APP_DIRECTORY,
            });
        } catch (error) {
            if (error.message === "Maximum call stack size exceeded") {
                const alert = await alertController.create({
                    header: "Error",
                    message: `File <b><i>${selected[i].name}</i></b> is too big`,
                    buttons: [
                        {
                            text: "OK",
                            role: "cancel",
                        },
                    ],
                });

                await alert.present();
                console.log(error.message + " for: " + selected[i].name);
            }
        }
    }
    // Empty input value
    filepicker.value.value = "";
    folderpicker.value.value = "";
    // Reload documents
    this.loadDocuments();
}

/**
 * ONLY FOR WEB
 * For each file (event.target.files) and its webkitRelativePath, create its parent folder(s) and insert the file in that folder.
 */
async function folderSelected($event) {
    // Array of all the elements in the folder but not the included folders
    const files = $event.target.files; // FileList
    // Loop all files
    for (const file of files) {
        try {
            // First check if the file can be processed
            const base64Data = await this.convertBlobToBase64(file);

            // Relative paths per file, we'll use this to know what a file's path
            const relativePaths = file.webkitRelativePath.split("/");
            // Remove the last element (which should be the file's name)
            relativePaths.pop();

            const newPath = props.currentFolder + "/" + relativePaths.join("/");

            // Try to create the folder
            await mkdirHelper(newPath);

            if (base64Data) {
                // Write file
                await Filesystem.writeFile({
                    path: newPath + "/" + file.name,
                    data: base64Data,
                    directory: Global.APP_DIRECTORY,
                });
            }
        } catch (error) {
            console.log(error.message + " For: " + file.name);
        }
    }
    // Empty input value
    filepicker.value.value = "";
    folderpicker.value.value = "";
    // Reload documents
    this.loadDocuments();
}

/**
 * Handles both files and folders. If a file is clicked in web, the file will be downloaded. If a file is clicked in mobile, it will use PreviewAnyFile library to handle the file with 3rd party user apps.
 * @param {File} entry Folder or file to open.
 */
const openFile = async (entry) => {
    if (isHybrid) {
        // Get the URI and use our Cordova plugin for preview
        const fileUri = await Filesystem.getUri({
            directory: Global.APP_DIRECTORY,
            path: entry.uri,
        });

        console.log(fileUri);

        PreviewAnyFile.preview(fileUri.uri)
            .then((res) => console.log(res))
            .catch((error) => console.error(error));
    } else {
        // Browser fallback to download the file
        const file = await Filesystem.readFile({
            directory: Global.APP_DIRECTORY,
            path: entry.uri,
        });

        const alert = await alertController.create({
            message: `<img src="data:;base64,${file.data}"; />`,
            buttons: [
                {
                    text: "Download",
                    handler: () => {
                        const a = document.createElement("a");
                        document.body.appendChild(a);
                        a.setAttribute("style", "display: none");
                        a.href = "data:;base64," + file.data;
                        a.download = entry.name;
                        a.click();
                        a.remove();
                    },
                },
                {
                    text: "Delete",
                    handler: () => {
                        deleteDocument(entry);
                    },
                },
                {
                    text: "Cancel",
                    role: "cancel",
                },
            ],
        });

        await alert.present();
    }
};

/**
 * Function triggered on item click, both files and folders.
 * If there is an ongoing copu process uses the last clicked folder as the new path for the file (calling finishCopyFile(). If a file is clicked, an error message will be shown.
 * If not, it will just open the file (calling openFile()) or folder (router push).
 * @param {File} entry File clicked
 * @returns {null}
 */
const itemClicked = async (entry) => {
    if (data.copyFile) {
        // We can only copy to a folder
        if (entry.isFile) {
            const toast = await toastController.create({
                message: "Select a folder for the operation",
                duration: 2000,
                position: "top",
            });

            await toast.present();
            return;
        }
        // Finish the ongoing operation
        finishCopyFile(entry);
    } else {
        // Open the file or folder
        if (entry.isFile) {
            openFile(entry);
        } else {
            let pathToOpen;
            if (props.currentFolder != "") {
                pathToOpen = props.currentFolder + "/" + entry.name;
            } else {
                pathToOpen = entry.name;
            }
            const folder = encodeURIComponent(pathToOpen);

            router.push(`/tabs/tab2/${folder}`);

            return;
        }
    }
};

watch(data, () => {
    loadDocuments();
});

onMounted(() => {
    checkRootFolder().then(() => {
        loadDocuments();
    });
});
</script>

<style scoped>
@import "../assets/css/fileExplorer.css";
</style>
