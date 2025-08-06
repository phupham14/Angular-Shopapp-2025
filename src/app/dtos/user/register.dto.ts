import { IsString, IsNotEmpty, IsPhoneNumber, IsDate } from "class-validator"; 
export class RegisterDTO {
  @IsString()
  fullName: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  address: String;

  @IsDate()
  dateOfBirth: Date;

  facebook_account_id: number = 0; 
  google_account_id: number = 0;
  role_id: number = 1; // Default role_id to 1 if not provided

  constructor(data: any) {
    this.phone = data.phone;
    this.password = data.password;
    this.confirmPassword = data.confirmPassword;
    this.fullName = data.fullName;
    this.address = data.address;
    this.dateOfBirth = data.dateOfBirth;
    this.facebook_account_id = data.facebook_account_id || 0;
    this.google_account_id = data.google_account_id || 0;   
    this.role_id = data.role_id || 1; // Default role_id to 1 if not provided
  }
}