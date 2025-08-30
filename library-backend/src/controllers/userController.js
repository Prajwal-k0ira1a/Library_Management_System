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
    const user = await User.findById(req.user._id).select("-password");
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
    const user = await User.findOne({ _id: req.params.id, isActive: true });
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
    const userId = req.params.id;
    const currentUser = req.user;

    // Check if user is trying to delete their own account or if they are a librarian
    if (
      currentUser.role !== "librarian" &&
      currentUser._id.toString() !== userId
    ) {
      return res.status(403).json({
        status: false,
        message: "You can only delete your own account",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: false,
        message: `User with id ${userId} not found`,
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
    const currentUser = req.user;
    const updates = { ...req.body };
    
    // Check if user is trying to update their own profile or if they are a librarian
    if (
      currentUser.role !== "librarian" &&
      currentUser._id.toString() !== userId
    ) {
      return res.status(403).json({
        status: false,
        message: "You can only update your own profile",
      });
    }

    // If not a librarian, prevent role changes
    if (currentUser.role !== "librarian" && updates.role) {
      delete updates.role;
    }

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
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    console.log("User updated:", updatedUser);
    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("User update failed:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { getUsers, getUserById, softDelete, updateUser };
