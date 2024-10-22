import { Injectable } from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {map, take} from 'rxjs/operators';
import {SessionService} from './session.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private session: SessionService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot):
      | boolean
      | UrlTree
      | Promise<boolean | UrlTree>
      | Observable<boolean | UrlTree> {
      return this.session.auth.pipe(
          take(1),
          map(user => {
              const isAuth = !!user;
              if (isAuth) {
                  return true;
              }
              return this.router.createUrlTree(['/auth/login']);
          })

      );
  }


}
