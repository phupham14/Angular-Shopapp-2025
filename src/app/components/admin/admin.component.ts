import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserResponse } from 'src/app/responses/user/user.response';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  userResponse?:UserResponse | null;
  constructor(
      private userService: UserService,   
      private popoverConfig: NgbPopoverConfig,  
      private tokenService: TokenService,
      private router: Router  
    ) {
      
  }
  ngOnInit(): void {  
    debugger
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
  }
  logOut(): void {
    debugger
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();  
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    this.router.navigate(['/']);
    console.log('User logged out');
  }
}
