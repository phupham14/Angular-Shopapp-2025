import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apigetRoles = `${environment.apiBaseUrl}/roles`; // phải trùng khớp với key ở environment.ts
  constructor(private http: HttpClient) { }
  getRoles() {
    return this.http.get<any[]>(this.apigetRoles, { observe: 'response' });
  }
}