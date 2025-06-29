const express = require("express");
const router = express.Router();
const meetingController = require("../controller/meetingController");

router.post("/generateSignature", meetingController.generateZoomSignature);
router.get("/getAccessToken", meetingController.getZoomSdkAccessToken);
router.get("/createMeeting", meetingController.generateZoomMeeting);

module.exports = router;