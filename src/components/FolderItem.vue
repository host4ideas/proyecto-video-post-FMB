<template>
    <div v-if="isPlatform('hybrid')">
        <!-- The actual file/folder item with click event -->
        <ion-item @click="itemClicked(item)">
            <ion-icon
                :icon="item.isFile ? documentOutline : folderOutline"
                slot="start"
            />
            {{ item.name }}
        </ion-item>

        <!-- The start/end option buttons for all operations -->
        <ion-item-options side="start">
            <ion-item-option @click="deleteDocument(item)" color="danger">
                <ion-icon :icon="trashOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>

        <ion-item-options side="end">
            <ion-item-option @click="startCopy(item)" color="success">
                <ion-icon :icon="copyOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>
    </div>
    <div v-else>
        <ion-item>
            <ion-item
                @click="itemClicked(item)"
                color="light"
                style="cursor: pointer"
            >
                <ion-icon
                    :icon="item.isFile ? documentOutline : folderOutline"
                    slot="start"
                />
                {{ item.name }}
            </ion-item>
            <!-- Delete -->
            <ion-button slot="end" color="light" @click="deleteDocument(item)">
                <ion-icon
                    :icon="trashOutline"
                    color="danger"
                    slot="icon-only"
                />
            </ion-button>
            <!-- Copy -->
            <ion-button slot="end" color="light" @click="startCopy(item)">
                <ion-icon
                    :icon="copyOutline"
                    color="success"
                    slot="icon-only"
                />
            </ion-button>
        </ion-item>
    </div>
</template>

<script>
import {
    IonIcon,
    IonButton,
    isPlatform,
    IonItemOption,
    IonItemOptions,
    IonItem,
} from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";

export default {
    name: "FolderItem",
    props: ["item", "itemClicked", "deleteDocument", "startCopy"],
    components: {
        IonIcon,
        IonButton,
        IonItemOption,
        IonItemOptions,
        IonItem,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            isChecked: false,
            isDisabled: false,
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
