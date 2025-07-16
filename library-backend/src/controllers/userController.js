import { User } from "../models/User.js";
import bcrypt from "bcryptjs";


export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
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

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: `No users with id ${req.params.id} found`,
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: `Error occured while deleting the datat of user ${req.params.id}`,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const password=password.req.getBody;

    
  } catch (error) {}
};
