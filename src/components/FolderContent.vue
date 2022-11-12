<template>
    <ion-list>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <FolderItem
                :item="f"
                :itemClicked="this.itemClicked"
                :deleteDocument="this.deleteDocument"
                :startCopy="startCopy"
            />
        </ion-item-sliding>
    </ion-list>
</template>

<script>
import { isPlatform, IonItemSliding, IonList } from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";
import FolderItem from "./FolderItem.vue";

export default {
    name: "FolderContent",
    props: ["folderContent", "itemClicked", "deleteDocument", "startCopy"],
    components: {
        IonItemSliding,
        IonList,
        FolderItem,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            // Ionic
            isPlatform,
            // Icons
            trashOutline,
            documentOutline,
            folderOutline,
            copyOutline,
        };
    },
};
</script>
