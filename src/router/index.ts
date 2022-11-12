import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "@/views/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/tabs/tab2",
    },
    {
        path: "/tabs/",
        component: Tabs,
        children: [
            {
                path: "",
                redirect: "tab1",
            },
            {
                path: "tab1",
                name: "Tab1",
                component: () => import("@/views/Tab1.vue"),
            },
            {
                /* This will help us build the navigation inside our app by passing a folder name for the :folder parameter inside the path. */
                path: "tab2/:folder(.*)*",
                name: "Tab2",
                component: () => import("@/views/Tab2.vue"),
                props: ({ params }) => {
                    let newPath;

                    if (params.folder === "") {
                        newPath = ["my-photo-collections"];
                    } else {
                        newPath = params.folder;
                    }

                    return {
                        folder: String(newPath),
                    };
                },
            },
        ],
    },
    {
        // Page not found
        path: "/:pathMatch(.*)*",
        redirect: "/tabs/tab1",
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
