const users = [
  { userName: "yosef123", password: "securePass1" },
  { userName: "admin", password: "admin123" },
];

export function checkUserExists(req, res) {
  const { userName, password } = req.body;
 

  const userExists = users.some(
    // המשתמש קיים ב DB
    (user) => user.userName === userName && user.password === password
  );

  return res.status(userExists ? 200 : 404).json({ exists: userExists });
}
