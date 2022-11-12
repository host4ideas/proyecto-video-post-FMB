import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "@/views/TabsLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/tabs/tab1",
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
                path: "/tabs/tab1",
                name: "Tab1",
                component: () => import("@/views/Tab1View.vue"),
            },
            {
                path: "/tabs/tab2",
                redirect: "/tabs/tab2/my-photo-collections",
            },
            {
                /* This will help us build the navigation inside our app by passing a folder name for the :folder parameter inside the path. */
                path: "tab2/:folder(.*)*",
                name: "Tab2",
                component: () => import("@/views/Tab2View.vue"),
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
        redirect: "/tabs/tab2/my-photo-collections",
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
