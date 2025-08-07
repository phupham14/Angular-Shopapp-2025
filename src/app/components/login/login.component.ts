import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { HttpResponse } from '@angular/common/http'; 
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';
import { UserResponse } from 'src/app/responses/user/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm !: NgForm;
  phoneNumber: string = ''; //4529374455
  password: string = ''; //Dbc@12345

  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | null = null;
  userResponse?: UserResponse

  constructor(
    private userService: UserService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    debugger
    this.roleService.getRoles().subscribe({
      next: (response: HttpResponse<Role[]>) => {
        this.roles = response.body || [];
        this.selectedRole = this.roles.length > 0 ? this.roles[0] : null; // Set default role if available
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching roles:', error);
      }
    });
  }

  onPhoneChange() {
    console.log('Phone typed:', this.phoneNumber);
  }

  login() {
    const loginDTO = new LoginDTO({
      phoneNumber: this.phoneNumber,
      password: this.password,
      role: this.selectedRole?.id ?? 1
    });

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const { token } = response;
        console.log('Token:', token);

        if (this.rememberMe) {
          this.tokenService.setToken(token); // Lưu token vào TokenService
          debugger
          this.userService.getUserDetails(token).subscribe({
            next: (response: any) => {
              debugger;
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              this.router.navigate(['/']);
            },

            error: (error: any) => {
              debugger
              alert(error.error.message)
            },
            complete: () => {
              debugger
            }
          });
        }
      },
      error: (error: any) => {
        debugger
        console.error('Error during login:', error);
        alert('Đăng nhập thất bại: ' + error.message);
      },
      complete: () => {
        debugger
        alert('Đăng nhập thành công');
      }
    });
  }

}
