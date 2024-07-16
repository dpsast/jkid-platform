import React from 'react'
import ReactDOM from 'react-dom/client'
import App, {Landing} from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register, {SubmittedPending, AutoPass} from "./Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Landing/>,
      },
      {
        path: "register",
        element: <Register/>,
      },
      {
        path: "submitted-pending",
        element: <SubmittedPending/>
      },
      {
        path: "auto-pass",
        element: <AutoPass/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
