## How It Works

After the user navigates to Tab 1 (Photos), they can tap/click on the camera button to open up the device's camera. After taking or selecting a photo, it's stored permanently into the device's filesystem. When the user reopens the app at a later time, the photo images are loaded from the filesystem and displayed again in the gallery. The user can tap on a photo to be presented with the option to remove the photo.

In Tab 2 (File Explorer), the user can see all the uploaded files and folders. They can tap/click on the + button to open a menu to select wether they want to create a folder, or upload a file or folder with content.

## Feature Overview

* App framework: [Vue](https://vuejs.org/)
* UI components: [Ionic Framework](https://ionicframework.com/docs/components)
  * Camera button: [Floating Action Button (FAB)](https://ionicframework.com/docs/api/fab)
  * Photo Gallery display: [Grid](https://ionicframework.com/docs/api/grid)
  * Delete Photo dialog: [Action Sheet](https://ionicframework.com/docs/api/action-sheet)
* Native runtime: [Capacitor](https://capacitorjs.com)
  * Taking photos: [Camera API](https://capacitorjs.com/docs/apis/camera)
  * Writing photo to the filesystem: [Filesystem API && Directory API](https://capacitorjs.com/docs/apis/filesystem)

## Project Structure

* Tab1 (Photos) (`src/views/Tab1.vue`): Photo Gallery UI and basic logic.
* usePhotoGallery Hook (`src/composables/usePhotoGallery.ts`): Logic encapsulating Capacitor APIs, including Camera and Filesystem.
* Tab2 (File Explorer) (`src/views/Tab2.vue`): File explorer.

## How to Run

> Note: It's highly recommended to follow along with the [tutorial guide](https://ionicframework.com/docs/vue/your-first-app), which goes into more depth, but this is the fastest way to run the app.

0) Install Ionic if needed: `npm install -g @ionic/cli`.
1) Clone this repository.
2) In a terminal, change directory into the repo: `cd photo-gallery-capacitor-vue`.
3) Install all packages: `npm install`.
4) Run on the web: `ionic serve`.
5) Run on iOS or Android: See [here](https://ionicframework.com/docs/building/running).

## How to build

0) Add android if needed: `ionic capacitor add android` or `ionic capacitor add ios`.
1) With each change Ionic apps must be built into web assets: `ionic capacitor copy android` or `ionic capacitor copy ios`.
2) With each change Ionic apps must be built into web assets: `ionic capacitor build android` or `ionic capacitor build ios`.

> If you have [Android Studio](https://developer.android.com/studio) installed, step 2 will open it up to debug your app.
