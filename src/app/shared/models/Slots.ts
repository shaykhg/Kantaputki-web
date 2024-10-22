export interface Slot {
  date: Date;
  from: string;
  till: string;
  name: string;
  id: string;
  available: boolean;
}

export interface City {
  name: string;
}

export interface Slots {
  active: boolean;
  blocked: boolean;
  country: string;
  rate: number;
  slots: Slot[];
  city: City[];
  role: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  postcode: string;
  id: string;
}



