import { roles } from "../../middleware/auth.js";

export const endpoints={
    cuponCrud:[roles.admin]
}