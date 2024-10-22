
  export interface Review {
    attributes: any[];
    date: Date;
    enable: boolean;
    _id: string;
    name: string;
    comment: string;
    rating: number;
    user: string;
    order: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Reviews {
    results: Review[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }


