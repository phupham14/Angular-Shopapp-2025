export class UpdateUserDTO {
    id: number;
    fullname: string;
    address: string;
    phone_number: string;
    password: string;
    retype_password: string;
    date_of_birth: Date;
    role_id: number;
    facebook_account_id: number;
    google_account_id: number;

    constructor(data: any) {
        this.id = data.id;
        this.fullname = data.fullname;
        this.address = data.address;
        this.phone_number = data.phone_number
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.date_of_birth = data.date_of_birth;
        this.role_id = data.role?.id;
        this.facebook_account_id = data.facebook_account_id ?? 0;
        this.google_account_id = data.google_account_id ?? 0;
    }
}