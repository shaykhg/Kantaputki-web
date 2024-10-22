import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setBoolean(key: string, value: boolean): void{
    localStorage.setItem(key, value ? '1' : '0');
  }

  getBoolean(key: string): boolean{
    const item = localStorage.getItem(key);
    return item === '1';
  }

  saveObject(key: string, value: any): void{
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObject(key: string): any {
   const item = localStorage.getItem(key);
   return JSON.parse(item);
  }

  setString(key: string, value: string){
    localStorage.setItem(key, value);
  }

  getString(key: string){
    return localStorage.getItem(key);
  }
}
