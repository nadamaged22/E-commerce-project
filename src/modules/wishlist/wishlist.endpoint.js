import { roles } from "../../middleware/auth.js";

export const endpoints={
    WishListCrud:[roles.user]
}