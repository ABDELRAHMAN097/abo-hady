import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}