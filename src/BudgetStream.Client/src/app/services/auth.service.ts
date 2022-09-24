import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  getUser(): Observable<User | null> {
    return this.http.get<any>('/.auth/me?ngsw-bypass').pipe(
      map((user) => {
        if (user.clientPrincipal)
          return {
            documentId: user.clientPrincipal.userId,
            userEmail: user.clientPrincipal.userDetails,
            ...user.clientPrincipal
          } as User;

        return null;
      })
    );
  }

  logout() {
    return this.http.get('/.auth/logout');
  }
}

export class User {
  
}