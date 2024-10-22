
  export interface Charge {
    enable: boolean;
    _id: string;
    name: string;
    type: string;
    value: number;
    description: string;
    amountType: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Charges {
    results: Charge[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }


