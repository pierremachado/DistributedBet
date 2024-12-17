import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Event from "./pages/Event";
import Home from "./pages/Home";

export const router = createBrowserRouter(
  [
    {
      path: "/home",
      element: <Home />
    },

    {
      path: "/event",
      element: <Event />,
    },
    {
      path: "/",
      element: <Login />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);