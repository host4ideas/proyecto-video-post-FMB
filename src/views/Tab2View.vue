<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>File Explorer</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">File Explorer</ion-title>
                </ion-toolbar>
            </ion-header>
            <!-- Main content -->
            <FileExplorer :currentFolder="props.folder" />
        </ion-content>
    </ion-page>
</template>

<script setup>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from "@ionic/vue";
import FileExplorer from "@/components/FileExplorer.vue";
import { defineProps } from "vue";

const props = defineProps({
    folder: String,
});
</script>
