
  export interface Extra {
    enable: boolean;
    _id: string;
    name: string;
    type: string;
    value: string;
    valueNum: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Extras {
    results: Extra[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}
