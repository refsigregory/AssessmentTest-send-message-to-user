import UserModel from "./../models/userModel";

export const findAll = async (req: any, res: any) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.findAll({ limit, offset: skip });

    res.status(200).json({
      status: "success",
      users: users,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const createUser = async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, birthday, location } = req.body;

    const User = await UserModel.create({
      firstName,
      lastName,
      email,
      birthday,
      location
    });

    res.status(201).json({
      status: "success",
      data: {
        User,
      },
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "failed",
        message: "User with that title already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const result = await UserModel.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.UserId,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User with that ID not found",
      });
    }

    const User = await UserModel.findByPk(req.params.UserId);

    res.status(200).json({
      status: "success",
      data: {
        User,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const deleteUser = async (req: any, res: any) => {
  try {
    const result = await UserModel.destroy({
      where: { id: req.params.UserId },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User with that ID not found",
      });
    }

    return res.status(202).json({
      status: "success",
      message: "User deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/*
export const findUser = async (req: any, res: any) => {
  try {
    const User = await UserModel.findByPk(req.params.UserId);

    if (!User) {
      return res.status(404).json({
        status: "fail",
        message: "User with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        User,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
 */