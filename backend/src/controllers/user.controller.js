export const getUsers = (req, res) => {
  res.status(200).json({
    message: "Users list API working",
    users: []
  });
};

export const getMe = (req, res) => {
  res.status(200).json({
    message: "My profile API working"
  });
};
