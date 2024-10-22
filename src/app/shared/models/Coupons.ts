 export interface Coupon {
    enable: boolean;
    _id: string;
    name: string;
    type: string;
    value: string;
    discount: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }
 export interface Coupons {
    results: Coupon[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }


