import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

// import { AuthService, User } from '@core';
import { UserService } from '@core/authentication/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';
import { UserRegisterDto } from 'app/services/models';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UserAuthService } from '@core/authentication/user-auth.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class ProfileLayoutComponent implements OnInit {
  // private readonly auth = inject(AuthService);
  // private readonly router = inject(Router);
  private readonly userAuthService = inject(UserAuthService);

  readonly user$: Observable<UserRegisterDto | null> | undefined;

  constructor(private userService: UserService) {
      this.user$ = this.userService.user$; // ✅ Ahora usamos UserService
    }

  // user!: UserRegisterDto;

  ngOnInit(): void {
    // this.auth.user().subscribe(user => (this.user = user));
  }

  logout() {
    this.userAuthService.logout().subscribe();
    // this.auth.logout().subscribe(() => {
    //   this.router.navigateByUrl('/auth/login');
    // });
  }
}
