import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { HttpUtilService } from '../services/http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { environment } from 'src/environments/environment';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;

  private apiConfig = {
    headers: this.httpUtilService.getAuthHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger;
    const userResponse = this.getUserResponseFromLocalStorage();

    if (!userResponse || !userResponse.id) {
      console.error('User response or user ID not found in localStorage.');
      throw new Error(
        'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.'
      );
    }

    debugger;
    return this.http.put(
      `${this.apiUserDetail}/${userResponse?.id}`,
      updateUserDTO,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getUserDetails(token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUserDetail, {}, { headers });
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger;
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse); //conver to a json string
      localStorage.setItem('user', userResponseJSON); //Save to localStorage
      console.log('User response saved to local storage');
    } catch (error) {
      console.error('Error saving user response to local storage: ', error);
    }
  }

  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User Response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error(
        'Error retrieving user response from local storage: ',
        error
      );
      return null;
    }
  }

  getUserIdFromLocalStorage(): number {
    const userStr = localStorage.getItem('userResponse');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || 0; // 0 nếu không có
    }
    return 0;
  }

  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      localStorage.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }
}
