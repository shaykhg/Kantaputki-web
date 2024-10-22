import {Component, OnInit} from '@angular/core';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';
import * as _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {LastServiceDialogueComponent} from '../../shared/ui/dialogues/last-service-dialouge/last-service-dialogue.component';

@Component({
  selector: 'app-order-info-card',
  templateUrl: './order-info-card.component.html',
  styleUrls: ['./order-info-card.component.scss']
})
export class OrderInfoCardComponent implements OnInit {

  constructor(public data: DataBindingService, public util: UtilService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  getPercentValue(amount) {
    console.log('this total without tax', amount, this.data.withoutTaxTotal);
    return    Math.round(((this.data.withoutTaxTotal * amount / 100) + Number.EPSILON) * 100) / 100 ;
  }

  removeLastService(service: any) {

    if (this.data.selectedService.length > 1) {
      this.removeService(service);
    } else {
      const dialogRef = this.dialog.open(LastServiceDialogueComponent, {
        width: '250px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          this.removeService(service);
          this.data.step.payment = false;
          this.data.step.location = false;
          console.log('15615615615611561515615615151651651651', this.data.step);
          this.data.index = 2;
          setTimeout(() => {
            this.data.index = 0;
          }, 30);
          this.data.openSnackBarError(this.util.setWords('NoServicesSelected!'), 'Ok');

        } else {

        }

      });
    }

  }

  removeService(service: any) {
    console.log('this is service to be removed', service);
    console.log('this is service to be removed', this.data.chosenServices);
    for (const item of this.data.allServices.results) {
      for (const product of item.products) {
        if (product.name === service.name) {
          product.checked = false;
        }
        // console.log('these are all products********', product);
      }
    }
    _.remove(this.data.selectedService, service);
    this.data.total = _.sumBy(this.data.selectedService, 'price');
    // console.log('this is % ************', this.data.totalPercentChargeValue);
    this.data.subTotal = this.data.total + (this.data.totalAbsoluteCharge ? this.data.totalAbsoluteCharge : 0) +  this.data.totalPercentChargeValue;
    this.data.total = this.data.total + this.data.totalAbsoluteCharge;
    //
    _.remove(this.data.selectedService, service);
    this.data.withoutTaxTotal = _.sumBy(this.data.selectedService, 'price');
  }

  }


