import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {APIService} from '../../services/api.service';
import {Order, Service} from '../../shared/models/Orders';
import * as _ from 'lodash';
import {DataBindingService} from '../../services/data-binding.service';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';
import {FormGroup} from '@angular/forms';
import {Services} from '../../shared/models/Services';
import {Extra} from '../../shared/models/Extras';
import {Charge} from '../../shared/models/Charges';

@Component({
  selector: 'app-extended-order',
  templateUrl: './extended-order.component.html',
  styleUrls: ['./extended-order.component.scss']
})
export class ExtendedOrderComponent implements OnInit {
  private charges: Charge[];

  progress = false;
  public remServices = [];

  constructor(private route: ActivatedRoute, public dataService: DataBindingService, private api: APIService, private session: SessionService,
              public util: UtilService) { }

  public chosenServices = [];
  public allServices: Services;
  public total: number;

  totalAbsoluteCharge;
  totalPercentCharge;
  public subTotal: any;
  private totalPercentChargeValue: number;
  public oid;
  public orderData: Order;
  showPayment: any;
  ngOnInit(): void {
    this.getOrderData();
  }

  getOrderData() {
    this.progress = true;
    this.oid = this.route.snapshot.params.id;

    this.api.getOrder(this.oid).subscribe( data => {
      this.orderData = data;
      this.getAllServices();
      this.getAllCharges();
      this.progress = false;
      console.log('this is order data', data);
    }, error => {
      console.log('error occurred while getting order data', error);
    });
  }

  getServiceTime(order) {
    if (order.service.length === 1) {
      return `${order.service[0].name}`;
    } else if (order.service.length > 1) {
      return `${order.service[0].name} & ${order.service.length - 1} more`;
    } else {
      return 'No Service';
    }
  }

  pushService(service) {

    if (_.find(this.chosenServices, service)) {
      _.remove(this.chosenServices, service);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      this.totalPercentChargeValue = this.total * ( this.totalPercentCharge ? this.totalPercentCharge / 100 : 0);
      this.dataService.totalPercentChargeValue = this.totalPercentChargeValue;
      console.log('this is % ************', this.totalPercentCharge);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      console.log('this is subtotl', this.subTotal);
    }
    else {
      this.chosenServices.push(service);
      this.dataService.setService(this.chosenServices);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      this.totalPercentChargeValue = this.total * ( this.totalPercentCharge ? this.totalPercentCharge / 100 : 0);
      this.dataService.totalPercentChargeValue = this.totalPercentChargeValue;
      console.log('this is % ************', this.totalPercentCharge);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      console.log('this is subtotl', this.subTotal);

    }
    console.log('these are chosen ', this.chosenServices);
  }

  getServiceClass(service) {
    return _.find(this.chosenServices, service) ? 'service-details-selected' : 'service-details';
  }

  getAllServices() {
    this.api.getAllServices().subscribe(data => {
      this.allServices = data;
      const  all = this.allServices.results;
      const  pre = this.orderData.service;
     // const diff = _.differenceWith(all, pre, _.isEqual);
      this.remServices = _.differenceBy(all, pre, '_id');
      console.log('diff Service Data ****',  this.remServices);
      console.log('All Service Data',  all);
      console.log('Pre Service Data',  pre);
    }, error => {
      console.log('An error occured while getting all services', error);
    });
  }

  getAllCharges() {

    this.api.getAllCharges().subscribe(data => {
      this.charges = data.results;
      this.dataService.charges = this.charges;
      const absolute = data.results;
      this.sumAllCharges();
    }, error => {
      console.log('An error Occurred while getting charges', error);
    });
  }

  async sumAllCharges() {
    await _.sumBy(this.charges, absCharge => {
      if (absCharge.amountType === 'Absolute') {
        console.log('these are absolute charges', absCharge.value);
        this.dataService.totalAbsoluteCharge = absCharge.value;
        return this.totalAbsoluteCharge = absCharge.value;
      }
      if (absCharge.amountType === 'Percentage'){
        console.log('these are % charges', absCharge.value);
        return this.totalPercentCharge = absCharge.value;
      } else {
        console.log('NO % or absolute based charges found');

      }
    });

  }

  addOrder() {
    const body = {
      charges : this.charges,
      total: this.total,
      services: this.chosenServices
    };
    console.log('this is body of extended order', body);
    this.api.postExtOrder(this.oid, body).subscribe( data => {
      this.showPayment = true;
      console.log('Order added successfullly', data);
    }, error => {
      console.log('Order added successfullly', error);

    });
  }

  confirmOrder(status) {
    const body = {id: this.orderData._id, status};
    this.api.putExtOrder(this.oid,  body).subscribe(resp => {
      console.log('this order status is', status === 1 + 'Data is ' + resp);
    });
  }

}
