import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getUsers = async (req, res) => {
  try {
    const user = await User.find({ isActive: true }).select("-password");
    if (!user || user.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No users found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "An error occured while retrieving the users data.",
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error occurred while retrieving profile",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isActive: false });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: `User with id ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      status: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: `Error occured while retrieving data of ${req.params.id}`,
    });
  }
};

// Optionally, change deleteUser to soft delete
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isDeleted: true },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: `No users with id ${req.params.id} found`,
//       });
//     }
//     res.status(200).json({
//       status: true,
//       message: "User soft deleted successfully",
//       data: user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: `Error occured while soft deleting the user ${req.params.id}`,
//       error: error.message,
//     });
//   }
// };

const softDelete = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: false,
        message: `User with id ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      status: true,
      message: "User soft deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error occurred while soft deleting user",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // Handle profile image if uploaded
    if (req.file) {
      updates.profileImage = req.file.path;
    }

    // Handle password update
    if (updates.password) {
      // Hash the new password
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      // If no password provided, remove it from updates
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });
    console.log("User updated:", updatedUser);
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("User update failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getUsers, getUserById, softDelete, updateUser };
