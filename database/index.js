import { UserService } from "./userService.js";
import { ForceLocationService } from "./forceLocationService.js";
import { IntelligenceService } from "./intelligenceService.js";
import { DashboardService } from "./dashboardService.js";

export const userService = new UserService();
export const forceLocationService = new ForceLocationService();
export const intelligenceService = new IntelligenceService();
export const dashboardService = new DashboardService();