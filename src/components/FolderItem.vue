<template>
    <div v-if="isPlatform('hybrid')">
        <!-- The actual file/folder item with click event -->
        <ion-item @click="itemClicked(item)">
            <ion-icon
                :icon="props.item.isFile ? documentOutline : folderOutline"
                slot="start"
            />
            {{ props.item.name }}
        </ion-item>

        <!-- The start/end option buttons for all operations -->
        <ion-item-options side="start">
            <ion-item-option @click="deleteDocument(props.item)" color="danger">
                <ion-icon :icon="trashOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>

        <ion-item-options side="end">
            <ion-item-option
                v-if="props.item.isFile"
                @click="startCopy(props.item)"
                color="success"
            >
                <ion-icon :icon="copyOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>
    </div>
    <div v-else>
        <ion-item>
            <ion-item
                @click="itemClicked(props.item)"
                :title="props.item.isFile ? 'Open file' : 'Open folder'"
                color="light"
                style="cursor: pointer"
            >
                <ion-icon
                    slot="start"
                    style="pointer-events: none"
                    :icon="props.item.isFile ? documentOutline : folderOutline"
                />
                {{ props.item.name }}
            </ion-item>
            <!-- Copy -->
            <ion-button
                v-if="props.item.isFile"
                title="Copy file"
                slot="end"
                color="light"
                @click="startCopy(props.item)"
            >
                <ion-icon
                    color="success"
                    slot="icon-only"
                    style="pointer-events: none"
                    :icon="copyOutline"
                />
            </ion-button>
            <!-- Delete -->
            <ion-button
                slot="end"
                title="Delete item"
                color="light"
                @click="deleteDocument(props.item)"
            >
                <ion-icon
                    color="danger"
                    slot="icon-only"
                    style="pointer-events: none"
                    :icon="trashOutline"
                />
            </ion-button>
        </ion-item>
    </div>
</template>

<script setup>
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
import { defineProps } from "vue";

const props = defineProps([
    "item",
    "itemClicked",
    "deleteDocument",
    "startCopy",
]);
</script>
