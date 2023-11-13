import { roles } from "../../middleware/auth.js";

export const endpoints={
    CartCrud:[roles.user,roles.admin]
}