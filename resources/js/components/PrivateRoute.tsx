import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { useLoggedInUser } from "../api/query/userQuery";

const PrivateRoute = ({ component, path, ...rest }: any) => {
    const { user, isLoading } = useLoggedInUser();
    const navigate = useNavigate();

    if (!isLoading && !user) {
        navigate("/");
        return null;
    }

    return <Route path={path} element={component} {...rest} />;
};

export default PrivateRoute;
