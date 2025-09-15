import { prisma } from "./neon.connect.js";
import bcrypt from "bcrypt";

export class UserService {

//creating an new user
  async createUser(username, password, role) {
     username = username;
     password = password;
     role = role;

     // if not exsist user
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
  throw new Error("Username already exists");
    }
// hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    // creating the user in database 
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // אימות משתמש
  async authenticateUser(username, password) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
  throw new Error("Invalid login credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
  throw new Error("Invalid login credentials");
    }

    // החזרה ללא סיסמה
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // קבלת כל המשתמשים
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { forceUpdates: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // קבלת משתמש לפי ID
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        forceUpdates: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            coordinates: true,
            updateDate: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
  throw new Error("User not found");
    }

    return user;
  }

  // עדכון פרטי משתמש
  async updateUser(id, updateData) {
    const { password, ...otherData } = updateData;

    const dataToUpdate = { ...otherData };

    // אם יש סיסמה חדשה - הצפן אותה
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // מחיקת משתמש
  async deleteUser(id) {
    // בדיקה שאין עדכוני מיקום תלויים
    const forceUpdatesCount = await prisma.forceLocation.count({
      where: { updatedById: parseInt(id) },
    });

    if (forceUpdatesCount > 0) {
  throw new Error("Cannot delete user with existing location updates");
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

  return { success: true, message: "User deleted successfully" };
  }
}
