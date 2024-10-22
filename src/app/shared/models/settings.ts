 export interface Setting {
    enable: boolean;
    _id: string;
    type: string;
    value: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

 export interface Settings {
    results: Setting[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }
