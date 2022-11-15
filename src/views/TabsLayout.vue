<template>
    <ion-page>
        <ion-content>
            <ion-tabs>
                <ion-router-outlet></ion-router-outlet>

                <ion-tab-bar id="tabControl">
                    <ion-tab-button
                        tab="tab1"
                        title="Recent taken photos"
                        href="/tabs/tab1"
                    >
                        <ion-icon :icon="images" style="pointer-events: none" />
                        <ion-label>Recent Photos</ion-label>
                    </ion-tab-button>

                    <ion-tab-button
                        tab="tab2"
                        title="File explorer"
                        href="/tabs/tab2/my-photo-collections"
                    >
                        <ion-icon
                            :icon="fileTray"
                            style="pointer-events: none"
                        />
                        <ion-label>File Explorer</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </ion-tabs>
        </ion-content>
    </ion-page>
</template>

<script setup>
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonContent,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from "@ionic/vue";
import { images, fileTray } from "ionicons/icons";
</script>
