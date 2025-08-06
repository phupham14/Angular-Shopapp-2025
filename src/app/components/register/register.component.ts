import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router'; 
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm !: NgForm;
  phone: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  address: String;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(private Http: HttpClient, private UserService: UserService, private router: Router) {
    this.phone = '';
    this.password = '';
    this.confirmPassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18); // Default to 18 years ago
  }
  onPhoneChange() {
    console.log('Phone typed:', this.phone);
  }
  onRegister() {
    const message = 'phone: ' + this.phone +
                 ', password: ' + this.password +
                 ', confirmPassword: ' + this.confirmPassword + 
                 ', fullName: ' + this.fullName + 
                 ', address: ' + this.address +
                 ', isAccepted: ' + this.isAccepted +
                 ', dateOfBirth: ' + this.dateOfBirth;
    //alert(message);
    const registerDTO: RegisterDTO = {
      "fullName": this.fullName,
      "phone" : this.phone,
      "address" : this.address,
      "password" : this.password,
      "confirmPassword" : this.confirmPassword,
      "dateOfBirth" : this.dateOfBirth, 
      "facebook_account_id" : 0,
      "google_account_id" : 0,
      "role_id" : 1
    }
    this.UserService.register(registerDTO).subscribe({
      next: (response: HttpResponse<any>) => {
        debugger
        this.router.navigate(['/login']);
        console.log('Registration successful:', response);
      },
      error: (error: any) => {
        debugger
        console.error('Error during registration:', error);
        alert('Đăng ký thất bại, error: ' + error.message);
      },
      complete: () => {
        // Có thể thêm xử lý khi hoàn thành nếu cần
        debugger
        alert('Đăng ký thành công');
        
      }
    })
  }
  checkPasswordMatch() {
    const confirmPasswordControl = this.registerForm.form.controls['confirmPassword'];
    if (this.password !== this.confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }

  checkAge() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const dobControl = this.registerForm.form.controls['dob'];

    if (age < 14) {
      dobControl.setErrors({ age: true });
    } else {
      dobControl.setErrors(null);
    }
  }

}
