import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import Service from "../pages/Service";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" >
            <Route path="/" element={<Home />}  > 
            <Route path="/" element={<Service />}  > 
            </Route>
            </Route>
            
            {/* Protected Routes */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
    )
);