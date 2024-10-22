import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/** This class automatically catches all errors and any action can be taken
 * based on these error for ex : Redirect to login if status is 401 or display data related
 * error message if status code is : 400
 */

@Injectable()


export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {
  }


  static getErrorMessage(error: number): string {
    if (error === 400) {
      // console.log('this is the error in interceptor', error);
      // return  ' Bad Request : The request you sent is not correct.';
      return  'Virheellinen pyyntö: Lähettämäsi pyyntö ei ole oikea.';
    } else if (error === 401) {
      console.log('this is the error in interceptor', error);
      // return  'Unauthorised :Enter a valid email/password or login again';
      return  'Luvaton: Anna kelvollinen sähköpostiosoite / salasana tai kirjaudu uudelleen';
    } else if (error === 403) {
      console.log('this is the error in interceptor', error);

      // return  ' : You do not have rights to perform this action.';
      // return  ' : You do not have rights to perform this action.';
      return  'Sinulla ei ole oikeuksia suorittaa tätä toimintoa.';
    } else if (error === 404) {
      console.log('this is the error in interceptor', error);

      // return  ' : Unable to find the requested item, not found.';
      return  'Pyydettyä kohdetta ei löydy, ei löydy.';
    } else if (error === 405) {
      console.log('this is the error in interceptor', error);

      // return  ' : This operation is not allowed!';
      return  'Tätä toimintoa ei sallita!';
    } else if (error === 500) {
      console.log('this is the error in interceptor', error);

      // return  ' : There is an error occurred while completing this request';
      return  'Tämän pyynnön täyttämisessä tapahtui virhe';
    } else if (error === 502) {
      console.log('this is the error in interceptor', error);

      // return  ' Bad Gateway : There is an error occurred on server side';
      return  'Virheellinen yhdyskäytävä: Palvelinpuolella tapahtui virhe';
    } else if (error === 503) {
      console.log('this is the error in interceptor', error);

      // return  ' Service Unavailable : Requested item is unavailable!';
      return  'Palvelu ei käytettävissä: Pyydetty tuote ei ole käytettävissä!';
    } else if (error === 504) {
      console.log('this is the error in interceptor', error);

      // return  ' Gateway Timeout : Request is taking too long!';
      return  'Yhdyskäytävän aikakatkaisu: Pyyntö kestää liian kauan!';
    } else {
      // return  ' : An unknown error is occurred!';
      return  'Tapahtui tuntematon virhe!';
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
            this.openSnackBarError(errorMsg, '');

          } else {
            console.log('this is server side error');
            errorMsg = HttpErrorInterceptor.getErrorMessage(error.status);
            // we can also show the error message from here
            this.openSnackBarError(errorMsg, '');
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      );

  }

  openSnackBarError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }
}
