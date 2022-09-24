import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(private auth:AuthService) { }

  user$: Observable<User | null> | undefined;

  ngOnInit(): void {
    this.user$ = this.auth.getUser();
  }

}
