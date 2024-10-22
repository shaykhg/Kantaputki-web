
  export interface Charges {
    charge: string;
  }

  export interface Service {
    name: string;
  }

  export interface Order {
    serial: string;
    pianoName: string;
    total: number;
    created: Date;
    date: Date;
    _id: string;
    address: string;
    charges: Charges[];
    city: string;
    coupon: string;
    discount: number;
    email: string;
    name: string;
    paymentMethod: string;
    postcode: string;
    service: Service[];
    lastService: string;
    status: string;
    payment: object;
    serviceMan: string;
    subtotal: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Orders {
    results: Order[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }

