
  export interface User {
    address: string;
    lastName: string;
    slots: [];
    active: boolean;
    blocked: boolean;
    country: string;
    rate: number;
    role: string;
    email: string;
    name: string;
    id: string;
    city: object;
    postcode: string;
    phone: string;
    password: string;
    calendar: string;
  }
  export interface AllUser {
    results: User[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }
