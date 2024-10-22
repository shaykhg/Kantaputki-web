
  export interface User {
    active: boolean;
    blocked: boolean;
    country: string;
    rate: number;
    role: string;
    email: string;
    name: string;
    id: string;
  }

  export interface Access {
    token: string;
    expires: Date;
  }

  export interface Refresh {
    token: string;
    expires: Date;
  }

  export interface Tokens {
    access: Access;
    refresh: Refresh;
  }

  export interface Register {
    user: User;
    tokens: Tokens;
  }
