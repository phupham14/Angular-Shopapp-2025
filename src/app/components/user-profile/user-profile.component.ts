import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserDTO } from 'src/app/dtos/user/update.user.dto';
import { UserResponse } from 'src/app/responses/user/user.response';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  token: string = '';
  UserProfileForm: FormGroup;
  userResponse?: UserResponse;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.UserProfileForm = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.minLength(6)]],
        address: ['', [Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        retypePassword: ['', [Validators.required, Validators.minLength(8)]],
        date_of_birth: [''],
      },
      {
        validators: this.passwordMatchValidator, // custom validator toàn form
      }
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; // "yyyy-MM-dd"
  }


  ngOnInit(): void {
    debugger;
    this.token = this.tokenService.getToken() ?? '';
    this.userService
      .getUserDetails(this.tokenService.getToken() ?? '')
      .subscribe({
        next: (response: any) => {
          debugger;
          this.userResponse = {
            ...response,
            date_of_birth: new Date(response.date_of_birth),
          };
          this.userService.saveUserResponseToLocalStorage(this.userResponse);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          //alert(error.error.message);
        },
      });
  }

  // So sánh mật khẩu
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('retypePassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Submit form
  onSubmit() {
    const user = this.userService.getUserResponseFromLocalStorage();
    if (!user || !user.id) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    if (this.UserProfileForm.valid) {
      debugger
      const updateUserDTO = new UpdateUserDTO({
        id: user.id,
        fullname: this.UserProfileForm.get('fullname')?.value,
        address: this.UserProfileForm.get('address')?.value,
        phone_number: this.UserProfileForm.get('phone_number')?.value,
        password: this.UserProfileForm.get('password')?.value,
        retype_password: this.UserProfileForm.get('retypePassword')?.value,
        date_of_birth: this.formatDate(this.UserProfileForm.get('date_of_birth')?.value),
        role: user.role, // hoặc user.role.id nếu nested
      });

      console.log('Payload gửi lên:', updateUserDTO);

      this.userService.updateUserDetail(this.token, updateUserDTO).subscribe({
        next: (response: any) => {
          debugger
          this.userService.removeUserFromLocalStorage();
          this.tokenService.removeToken();
          alert("Cập nhật thông tin thành công")
        },
        error: (error: any) => {
          debugger
          console.error('Lỗi cập nhật:', error);
          const errorMsg =
            error?.error?.message || error?.message || 'Đã xảy ra lỗi.';
          alert(errorMsg);
        },
      });
    } else {
      if (this.UserProfileForm.hasError('passwordMismatch')) {
        alert('Mật khẩu và mật khẩu gõ lại chưa chính xác');
      }
    }
  }

  onCancel() {
    debugger;
    this.UserProfileForm.reset();
    console.log('Đã huỷ và reset form');
  }

  onUploadPhoto() {
    console.log('Upload ảnh mới');
  }

  onDeletePhoto() {
    console.log('Xoá ảnh đại diện');
  }
}
