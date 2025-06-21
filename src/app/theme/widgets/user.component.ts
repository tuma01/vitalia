import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Observable, tap } from 'rxjs';

import { UserRegisterDto } from 'app/services/models';
import { UserService } from '@core/authentication/user.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SessionService } from '@core/authentication/session.service';
import { UserAuthService } from '@core/authentication/user-auth.service';

@Component({
  selector: 'app-user',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <!-- <img class="avatar" *ngIf="(user$ | async)?.avatar; else defaultAvatar" [src]="'data:image/jpeg;base64,' + (user$ | async)?.avatar" width="24" alt="avatar" /> -->

      <img class="matero-user-panel-avatar"
        *ngIf="(user$ | async)?.avatar; else defaultAvatar"
        [src]="'data:image/jpeg;base64,' + (user$ | async)?.avatar"
        alt="avatar"
        width="64"
      />


    </button>

    <ng-template #defaultAvatar>
      <img class="avatar" src="images/avatar-default.jpg" width="24" alt="default avatar" />
    </ng-template>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'profile' | translate }}</span>
      </button>
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>edit</mat-icon>
        <span>{{ 'edit_profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="restore()">
        <mat-icon>restore</mat-icon>
        <span>{{ 'restore_defaults' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule, AsyncPipe, CommonModule],
})
export class UserComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  // private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  // private readonly sessionService = inject(SessionService);
  private readonly userAuthService = inject(UserAuthService);

  user!: UserRegisterDto;

  user$!: Observable<UserRegisterDto | null>;

  ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  logout() {
    this.userAuthService.logout().subscribe();
    // this.sessionService.clearSession();
    // // this.userService.clearUser();
    // // this.router.navigateByUrl('/login');
    // this.router.navigate(['login']);
  }

  restore() {
    window.location.reload();
  }
}
