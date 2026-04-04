const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Invalid Access Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

        // 🔥 Fetch full user from DB
        const user = await UserModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; // now contains studios, permissions, everything
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Access Token Expired" });
        }
        return res.status(401).json({ error: "Invalid Token" });
    }
};


// refresh access Token

const verifyRefreshToken = (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid Refresh Token " })
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
        req.user = {
            _id: decoded._id,
            email: decoded.email,
            role: decoded.role,

        }
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Refresh Token Expired" });
        }
        return res.status(401).json({ error: "Invalid Token" });
    }
}


module.exports = { verifyAccessToken, verifyRefreshToken }