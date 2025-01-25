import jwt from "jsonwebtoken";

const secret = "é mole";

export const genereteToken = (payload: object): string => {
  const options = { expiresIn: "100h" };
  const token = jwt.sign(payload, secret, options);

  return token;
};

export const verifyToken = (token: string): any => {
  try {
    const user = jwt.verify(token, secret);
    
    return { isValid: true, user: user };
  } catch (error) {
    return { isValid: false };
  }
};
