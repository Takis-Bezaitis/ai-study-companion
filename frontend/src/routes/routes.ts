import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import RootLayout from "../components/layout/RootLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedLayout from "../components/layout/ProtectedLayout";

const IndexRedirect = lazy(() => import('../pages/IndexRedirect'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Lessons = lazy(() => import('../pages/Lessons'));
const Lesson = lazy(() => import('../pages/Lesson'));
const Quiz = lazy(() => import('../pages/Quiz'));
const Game = lazy(() => import('../pages/Game'));
const Progress = lazy(() => import('../pages/Progress'));
const Settings = lazy(() => import('../pages/Settings'));

export const routes = createBrowserRouter([
    {path: '/', Component: RootLayout, 
        children: [
            { index: true, Component: IndexRedirect }, 
            
            // Auth pages
            {   path: "auth",
                Component: AuthLayout, 
                children: [
                    { path: 'login', Component: Login },
                    { path: 'register', Component: Register }
                ]
            },

            // Protected pages
            { Component: ProtectedLayout, 
                children: [
                    { path: 'dashboard', Component: Dashboard },

                    { path: 'lessons', 
                        children: [
                            { index: true, Component: Lessons },
                            { path: ":lessonId", Component: Lesson, },
                            { path: ":lessonId/quiz", Component: Quiz, },
                            { path: ":lessonId/games", Component: Game, },
                        ],
                    },

                    { path: "progress", Component: Progress, },

                    { path: "settings", Component: Settings, },

                ]
            }
        ]
    }
]);