import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export { generateTokenAndSetCookie };
