const express = require("express");

const authController = require("./../controllers/auth.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", isAuthenticated, authController.getMe);

router.post("/set-cookie-for-refresh-token", authController.setCookieForRefreshToken);
router.get("/get-cookie-for-refresh-token", authController.getCookieForRefreshToken);
router.post("/clear-cookie-for-refresh-token", authController.clearCookieForRefreshToken);
router.get("/refresh-token", authController.refreshToken);

router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
