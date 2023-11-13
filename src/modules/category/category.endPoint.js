import { roles } from "../../middleware/auth.js";

export const endpoints={
    categoryCrud:[roles.admin]
}