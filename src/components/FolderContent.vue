<template>
    <ion-list>
        <ion-item-sliding
            v-for="(f, index) in props.folderContent"
            :key="index"
        >
            <FolderItem
                :item="f"
                :itemClicked="props.itemClicked"
                :deleteDocument="props.deleteDocument"
                :startCopy="props.startCopy"
            />
        </ion-item-sliding>
    </ion-list>
</template>

<script setup>
import { IonItemSliding, IonList } from "@ionic/vue";
import FolderItem from "./FolderItem.vue";
import { defineProps } from "vue";

const props = defineProps([
    "folderContent",
    "itemClicked",
    "deleteDocument",
    "startCopy",
]);
</script>
