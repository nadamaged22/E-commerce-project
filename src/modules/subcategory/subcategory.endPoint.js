import { roles } from "../../middleware/auth.js";

export const endpoints={
    subcategoryCrud:[roles.admin]
}