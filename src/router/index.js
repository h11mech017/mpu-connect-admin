import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/LoginView.vue"
import HomeView from "../views/HomeView.vue"
import CourseView from "../views/AnnouncementsView.vue"
import AssingmentView from "../views/AssingmentView.vue"
import AttendanceView from "../views/AttendanceView.vue"
import EventsView from "../views/EventsView.vue"
import ParkingView from "../views/ParkingView.vue"
import LostItemsView from "../views/LostItemsView.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'LoginView',
            component: LoginView
        },
        {
            path: '/home',
            name: 'HomeView',
            component: HomeView
        },
        {
            path: '/events',
            name: 'EventsView',
            component: EventsView
        },
        {
            path: '/parking',
            name: 'ParkingView',
            component: ParkingView
        },
        {
            path: '/lost-and-found',
            name: 'LostItemsView',
            component: LostItemsView
        },
        {
            path: '/courses/:courseId/:section',
            name: 'CourseView',
            component: CourseView
        },
        {
            path: '/courses/:courseId/:section/assignments/:assignmentId',
            name: 'AssignmentView',
            component: AssingmentView
        },
        {
            path: '/courses/:courseId/:section/attendance/:attendanceId',
            name: 'AttendanceView',
            component: AttendanceView
        }
    ]
})

export default router;