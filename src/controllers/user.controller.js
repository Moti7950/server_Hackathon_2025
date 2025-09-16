import { checkUserExist } from "../../dal/usersDal.js";

export function checkExists(req, res) {
  const { userName, password } = req.body;
  const userExists = checkUserExist(userName,password)

  return res.status(userExists ? 200 : 404).json({ exists: userExists });
}
