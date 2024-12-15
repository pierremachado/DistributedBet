import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Event from "./pages/Event";

export const router = createBrowserRouter(
  [
    {
      path: "/app",
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