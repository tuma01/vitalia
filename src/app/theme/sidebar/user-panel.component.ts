import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserRegisterDto } from 'app/services/models';
import { Observable } from 'rxjs';
import { UserService } from '@core/authentication/user.service';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" routerLink="/profile/overview">
      <!-- Avatar del usuario -->
      <img class="matero-user-panel-avatar"
        *ngIf="(user$ | async)?.avatar; else defaultAvatar"
        [src]="'data:image/jpeg;base64,' + (user$ | async)?.avatar"
        alt="avatar"
        width="64"
      />
      <!-- Imagen por defecto -->
      <ng-template #defaultAvatar>
        <img class="matero-user-panel-avatar" src="images/avatar-default.jpg" alt="default avatar" width="64" />
      </ng-template>

      <div class="matero-user-panel-info">
        <h4>{{ (user$ | async)?.firstName }} {{ (user$ | async)?.lastName }}</h4>
        <h5>{{ (user$ | async)?.email }}</h5>
      </div>
    </div>
  `,
  styleUrl: './user-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule, AsyncPipe, CommonModule],
})
export class UserPanelComponent {
  readonly user$: Observable<UserRegisterDto | null> | undefined;

  constructor(private userService: UserService) {
    this.user$ = this.userService.user$; // ✅ Ahora usamos UserService
  }
}
