import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '../../../../services/session.service';
import {UtilService} from '../../../../services/util.service';

@Component({
  selector: 'app-last-service-dialouge',
  templateUrl: './last-service-dialogue.component.html',
  styleUrls: ['./last-service-dialogue.component.scss']
})
export class LastServiceDialogueComponent implements OnInit {

  DialogData;
  constructor(public util: UtilService, public dialogRef: MatDialogRef<LastServiceDialogueComponent>, public session: SessionService) { }

  ngOnInit(): void {
  }

  remove() {
    this.dialogRef.close(1);

  }

  cancel() {
    this.dialogRef.close();

  }
}
