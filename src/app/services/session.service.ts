import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to keep the things related to Auth,
 * so user info, token and things like that can be kept here
 */
export class SessionService {

  private token: string;
  public user: any;
  public isLoggedIn = false;
  public auth = new BehaviorSubject<boolean>(null);

  constructor(private storage: LocalStorageService, private router: Router) {
    // Get all info from localstorage
    this.init().then(() => {
      console.log('Session service is read!');
    }).catch((e) => {
      console.log('Unable to init session service');
    });
  }

  /**
   * To be used to set token.
   * @param token - The token post received post login.
   */
   setToken(token: string) {
    this.token = token;
    this.storage.setString('token', token);
    this.storage.setBoolean('loggedIn', true);
    this.init();
    console.log('this is token from set token session', this.token);
    // this.initUserData();
  }

  /**
   * To be used to set user.
   * @param user - The user object.
   */
   setUser(user: any) {
    // this.user = user;
    this.storage.saveObject('user', user);
    this.user = this.storage.getObject('user');
    console.log('user is set here in session', this.user);
  }

  /** This function can be used to get token */
  getToken() {
    return this.storage.getString('token');
  }

  /** This function can be used to get user */
  getUser() {
    return this.user;
  }

  /** Logout current user */
  logout() {
    this.isLoggedIn = false;
    this.user = null;
    localStorage.clear();
    this.router.navigateByUrl('/login');

  }

  /** This function is private and should not be used for anything else than init of session service */
  public async init() {
    this.isLoggedIn = await this.storage.getBoolean('loggedIn');
    this.user = await this.storage.getObject('user');
    this.token = await this.getToken();

    // Dummy allowed access intentionally remove this block
    // this.isLoggedIn = true;
    // Remove this block if prod

    this.auth.next(this.isLoggedIn);
    // We can also optionally call refresh token API is available to refresh the token
  }
}
