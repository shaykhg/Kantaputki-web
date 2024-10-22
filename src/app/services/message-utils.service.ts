import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class MessageUtilsService {

  constructor(public dialog: MatDialog) { }

  showErrorDialogue(){

  }

  showSuccessDialogue(){

  }

  showWarningDialogue(){

  }

  showWarningMessage(){

  }

  showErrorMessage(){

  }

  showSuccessMessage(){

  }

  showProgressDialog(){

  }

  dismissProgressDialogue(){

  }

}
