import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const { member } = useSelector((state) => state.members);

    const currentUser = user || member;

    if (loading) return <div>Loading...</div>; // wait for login check

    if (!currentUser) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        switch (currentUser.role) {
            case "admin":
                return <Navigate to="/admin-dashboard/my-area" replace />;
            case "member":
                return <Navigate to="/member-view/studio-menu" replace />;
            case "staff":
                return <Navigate to="/dashboard/my-area" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    // Use children if passed directly (for single route) OR Outlet for nested routes
    return children ? children : <Outlet />;
};

ProtectedRoutes.propTypes = {
    children: PropTypes.node,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoutes;
