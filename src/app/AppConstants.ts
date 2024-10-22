export class AppConstants {
  constructor() {
  }

  public static BASE_URL = 'https://apix.kantaputki.fi';
  // public static CHANGE_THIS_URL = 'http://api.pianto.io';
  public static API = {
    LOGIN: AppConstants.BASE_URL + '/v1/auth/login',
    REGISTER: AppConstants.BASE_URL + '/v1/auth/register',
    FORGOT: AppConstants.BASE_URL + '/v1/auth/forgot-password',
    NEW_PASSWORD: AppConstants.BASE_URL + '/v1/auth/reset-password',
    All_USERS: AppConstants.BASE_URL + '/v1/users',
    All_SETTINGS: AppConstants.BASE_URL + '/v1/settings',
    All_SERVICES: AppConstants.BASE_URL + '/v1/services',
    All_COUPONS: AppConstants.BASE_URL + '/v1/coupons',
    All_ORDERS: AppConstants.BASE_URL + '/v1/orders',
    MY_ORDERS: AppConstants.BASE_URL + '/v1/orders/me',
    CANCEL_ORDER: AppConstants.BASE_URL + '/v1/orders/cancel',
    PLACE_ORDERS: AppConstants.BASE_URL + '/v1/orders/place',
    CONFIRM_ORDERS: AppConstants.BASE_URL + '/v1/orders/confirm',
    All_PRICING: AppConstants.BASE_URL + '/v1/pricing',
    All_CHARGES: AppConstants.BASE_URL + '/v1/charges',
    // All_EXTRAS: AppConstants.CHANGE_THIS_URL + '/v1/extras',
    All_EXTRAS: AppConstants.BASE_URL + '/v1/extras',
    SILENT_REGISTER: AppConstants.BASE_URL + '/v1/auth/registerSilent',
    APPLY_COUPON:  AppConstants.BASE_URL + '/v1/coupons/applyCoupon',
    ALL_SLOTS:  AppConstants.BASE_URL + '/v1/services/slots',
    EXT_ORDER:  AppConstants.BASE_URL + '/v1/orders/ext',
    All_REVIEWS: AppConstants.BASE_URL + '/v1/reviews',
    FUTURE_SLOTS: AppConstants.BASE_URL + '/v1/services/futureSlots',

  };

 public static selectedService;
}
