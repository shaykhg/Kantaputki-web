import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AppConstants} from '../AppConstants';
import {SessionService} from './session.service';
import {Services} from '../shared/models/Services';
import {LoginResponse} from '../shared/models/LoginResponse';
import {catchError} from 'rxjs/operators';
import {User} from '../shared/models/UserDetail';
import {Order, Orders} from '../shared/models/Orders';
import {Charges} from '../shared/models/Charges';
import {Register} from '../shared/models/Register';
import {Discount} from '../shared/models/Discount';
import {Slots} from '../shared/models/Slots';
import {Extra, Extras} from '../shared/models/Extras';
import {Review, Reviews} from '../shared/models/Reviews';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to make the API calls,
 * this service sets the auth header by default and this can be disabled
 * from constructor and setToken function
 */
export class APIService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private session: SessionService) {
    this.headers = new HttpHeaders();
    this.setHeaders();
  }

  setHeaders(){
    this.headers = this.headers.set('Authorization', 'Bearer ' + this.session.getToken());
    console.log('headers are set here in api service', this.headers);
  }


  /**
   * To set the token after initialisation of the service, could be useful when user is not logged in
   * and then when he logins this function can be called to add token
   * @param token this contains the user email and password
   */
  setToken(token: string) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Authorization', 'Bearer ' + token);
  }

  /**
   * To Login a user
   * @param body this contains the user email and password
   */
  login(body: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AppConstants.API.LOGIN, body).pipe(catchError(this.handleError));
  }
  /**
   * To Register.ts a user
   * @param body this is the object which contains user info such as email, password, name etc.
   */
  register(body: any) {
    return this.http.post<any>(AppConstants.API.REGISTER, body);
  }

  /** Get a user information based on his id
   * @param userId User id to identify user
   */
  // getUser(userId: string): Observable<User> {
  //   return this.http.get<User>(AppConstants.API.GET_USER + userId);
  // }
  //


  getAllServices(): Observable<Services> {
    return this.http.get<Services>(AppConstants.API.All_SERVICES);
  }

  getAllReviewsType(): Observable<Extras> {
    return this.http.get<Extras>(AppConstants.API.All_EXTRAS + '?type=review');
  }

  postReview(body): Observable<Review> {
    return this.http.post<Review>(AppConstants.API.All_REVIEWS + '?type=review', body);
  }

  getAllSearchInExtras(body): Observable<Extra[]> {
    return this.http.post<Extra[]>(AppConstants.API.All_EXTRAS + '/search', body);
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(AppConstants.API.All_USERS + '/' + id, {headers: this.headers});
  }

  updateUser(id, body): Observable<User> {
    return this.http.put<User>(AppConstants.API.All_USERS + '/' + id, body, {headers: this.headers});
  }

  getMyOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(AppConstants.API.MY_ORDERS, {headers: this.headers});
  }

  cancelOrder(id: string): Observable<Orders> {
    return this.http.get<Orders>(AppConstants.API.CANCEL_ORDER + '?id=' + id, {headers: this.headers});
  }


  placeOrder(body): Observable<Order> {
    return this.http.post<Order>(AppConstants.API.PLACE_ORDERS, body, {headers: this.headers});
  }

  placeOrderConfirm(body): Observable<Order> {
    return this.http.post<Order>(AppConstants.API.CONFIRM_ORDERS, body, {headers: this.headers});
  }

  getAllCharges(): Observable<Charges> {
    return this.http.get<Charges>(AppConstants.API.All_CHARGES);
  }

  registerNewUser(body): Observable<Register>{
    return this.http.post<Register>(AppConstants.API.SILENT_REGISTER, body);
  }

  forgotPassword(body): Observable<any>{
    return this.http.post(AppConstants.API.FORGOT, body);
  }
  newPassword(body , token): Observable<any>{
    return this.http.post(AppConstants.API.NEW_PASSWORD + '?token=' + token, body);
  }
  applyCoupon(body): Observable<Discount>{
    return this.http.post<Discount>(AppConstants.API.APPLY_COUPON, body);
  }
  getSlots(body): Observable<Slots[]>{
    return this.http.post<Slots[]>(AppConstants.API.ALL_SLOTS, body);
  }
  getFutureSlots(body): Observable<Slots[]>{
    return this.http.post<Slots[]>(AppConstants.API.FUTURE_SLOTS, body);
  }

  getUserSlots(id): Observable<any>{
    return this.http.get<any>(AppConstants.API.ALL_SLOTS + '/' + id);
  }

  getFutureUserSlots(id): Observable<any>{
    return this.http.get<any>(AppConstants.API.FUTURE_SLOTS + '/' + id);
  }

  getOrder(id): Observable<Order> {
    return this.http.get<Order>(AppConstants.API.All_ORDERS + '/' + id, {headers: this.headers});
  }

  postExtOrder(id, body): Observable<any> {
    return this.http.post<any>(AppConstants.API.EXT_ORDER + '?id=' + id, body, {headers: this.headers});
  }

  putExtOrder(id, body): Observable<any> {
    return this.http.put<any>(AppConstants.API.EXT_ORDER, body,  {headers: this.headers});
  }

  // Error Handling
  handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 401) {
        errorMessage = 'Your password id incorrect or you do not have access to this resource!';
        // Now you can show error if you know about it already!
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }


}
