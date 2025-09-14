import {userService }from '../../database/index.js'
export async function getUser(req, res) {
  console.log("hello from users");

  res.status(200).send(await userService.getAllUsers());
}
