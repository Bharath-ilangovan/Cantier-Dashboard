import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" >
            <Route path="/" element={<Home />} />
            {/* Protected Routes */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
    )
);