import { Injectable } from "@angular/core";
import { UserRegisterDto } from "app/services/models";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userConnected = 'vitalia-user';
  private userSubject = new BehaviorSubject<UserRegisterDto | null>(this.getStoredUser());
  readonly user$ = this.userSubject.asObservable(); // Exponer el observable

  constructor() {}

  getUserSnapshot(): UserRegisterDto | null {
    return this.userSubject.getValue();
  }

  async setUser(user: UserRegisterDto): Promise<void> {
    const processedUser = await this.processAvatar(user);
    localStorage.setItem(this.userConnected, JSON.stringify(processedUser));
    this.userSubject.next(processedUser);
  }

  clearUser(): void {
    localStorage.removeItem(this.userConnected);
    this.userSubject.next(null);
  }

  async updateAvatar(newAvatar: string | ArrayBuffer): Promise<void> {
    const user = this.getUserSnapshot();
    if (user) {
      user.avatar = await this.convertAvatar(newAvatar);
      await this.setUser(user);
    }
  }

  getAvatar(): string | null {
    return this.getUserSnapshot()?.avatar || null;
  }

  private async processAvatar(user: UserRegisterDto): Promise<UserRegisterDto> {
    if (user.avatar && typeof user.avatar !== 'string') {
      user.avatar = await this.convertAvatar(user.avatar);
    }
    return user;
  }

  private async convertAvatar(buffer: any): Promise<string> {
    if (typeof buffer === 'string' && buffer.startsWith('data:image')) {
      return buffer; // 🔹 Si ya es Base64, no se convierte de nuevo.
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(new Blob([buffer]));
      reader.onloadend = () => resolve(reader.result as string);
    });
  }

  private getStoredUser(): UserRegisterDto | null {
    const userString = localStorage.getItem(this.userConnected);
    if (!userString) return null;
    return userString ? JSON.parse(userString) : null;
  }
}
