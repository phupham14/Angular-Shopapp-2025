import { Role } from "src/app/models/role";

export interface UserResponse {
    id: number;
    fullname: string;
    address: string;
    date_of_birth: Date;
    facebookId: number;
    googleId: number;
    is_active: boolean;
    role: Role;
}