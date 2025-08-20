// Board Controller

const createNew = async (req, res, next) => {
  try {
    // Logic tạo board mới
    res.status(201).json({ 
      message: "Board created successfully",
      data: req.body 
    });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew
};
