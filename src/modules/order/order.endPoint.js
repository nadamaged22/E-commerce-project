import { roles } from "../../middleware/auth.js";

export const endpoints={
   OrderCrud:[roles.user,roles.admin]
}