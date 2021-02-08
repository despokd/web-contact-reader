import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/contacts",
    name: "Home",
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () => import("@/views/Contacts.vue"),
  },
  {
    path: "/companies",
    name: "Companies",
    component: () => import("@/views/Companies.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
