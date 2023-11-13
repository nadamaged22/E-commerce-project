import { roles } from "../../middleware/auth.js";

export const endpoints={
    brandCrud:[roles.admin]
}