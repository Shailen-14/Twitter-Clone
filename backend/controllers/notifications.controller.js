import Notifications from "../models/notifications.model.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notifications.find({ to: userId })
      .select("-to")
      .populate("from", "-password");

    await Notifications.updateMany({ to: userId }, { $set: { read: true } });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(`Error in getNotifications controller" ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notifications.deleteMany({ to: userId });

    return res
      .status(200)
      .json({ message: "Notifications Deleted Successfully" });
  } catch (error) {
    console.log(`Error in deleteNotifications controller" ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

export { getNotifications, deleteNotifications };
