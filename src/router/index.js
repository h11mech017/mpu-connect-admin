import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/LoginView.vue"
import HomeView from "../views/HomeView.vue"
import CoursesView from "../views/CoursesView.vue"
import AnnouncementsView from "../views/AnnouncementsView.vue"
import AttendanceView from "../views/AttendanceView.vue"
import EventsView from "../views/EventsView.vue"
import ParkingView from "../views/ParkingView.vue"
import LostItemsView from "../views/LostItemsView.vue"
import FilesView from "../views/FilesView.vue"
import AssignmentsView from "../views/AssignmentsView.vue"
import AssignmentView from "../views/AssignmentView.vue"
import AttendancesView from "../views/AttendancesView.vue"

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
            path: '/courses',
            name: 'CoursesView',
            component: CoursesView
        },
        {
            path: '/courses/:courseId/:section/announcements',
            name: 'AnnouncementsView',
            component: AnnouncementsView
        },
        {
            path: '/courses/:courseId/:section/files',
            name: 'FilesView',
            component: FilesView
        },
        {
            path: '/courses/:courseId/:section/assignments',
            name: 'AssignmentsView',
            component: AssignmentsView
        },
        {
            path: '/courses/:courseId/:section/assignments/:assignmentId',
            name: 'AssignmentView',
            component: AssignmentView
        },
        {
            path: '/courses/:courseId/:section/attendance',
            name: 'AttendancesView',
            component: AttendancesView
        },
        {
            path: '/courses/:courseId/:section/attendance/:attendanceId',
            name: 'AttendanceView',
            component: AttendanceView
        }
    ]
})

export default router;