import { roles } from "../../middleware/auth.js";

export const endpoints={
    productCrud:[roles.admin]
}