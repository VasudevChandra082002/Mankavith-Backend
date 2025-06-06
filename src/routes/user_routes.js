const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticator");
const userController = require("../controller/user_controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/verify-otp", userController.verifyOTP);
router.post("/resend-otp", userController.resendOTP);
router.post("/refreshToken", userController.refreshToken);
router.post("/loginSendOtp", userController.loginSendOtp);
router.post("/verifyLoginOtp", userController.verifyLoginOtp);
router.post("/resendLoginOtp", userController.resendLoginOtp);
router.post("/logout", userController.logout);
router.post("/createAdmin", userController.createAdmin);
router.get("/get/userById/:id", userController.getUserById);
router.get("/get/users",  userController.getAllUsers);
router.delete("/delete/userById/:id", userController.deleteUser);

// Update wishlist (add/remove)
router.post("/update", userController.updateWishlist);

// Get wishlist
router.get("/wishlist/:userId", userController.getWishlist);

// Check if course is in wishlist
router.get("/:userId/:courseId", userController.checkWishlistItem);
router.put("/updateUser/:userId", userController.editUser);
router.get("/get/allEnrolledCourses/:userId", userController.getAllEnrolledCourses);
router.get("/get/ongoingEnrolledCourses/:userId", userController.getOngoingCourses);
router.get("/get/completedEnrolledCourses/:userId", userController.getCompletedCourses);
router.get("/get/notStartedEnrolledCourses/:userId", userController.getNotStartedCourses);
router.post("/createStudent", userController.createStudent);
router.get("/get/all/students", userController.getAllStudents);
module.exports = router;

module.exports = router;
