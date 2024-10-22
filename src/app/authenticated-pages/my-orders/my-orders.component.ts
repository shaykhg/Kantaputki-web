import {Component, OnInit} from '@angular/core';
import {APIService} from '../../services/api.service';
import {Orders} from '../../shared/models/Orders';
import * as _ from 'lodash';
import {SessionService} from '../../services/session.service';
import {Router} from '@angular/router';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  public allOrders: any[] = [];
  progress = false;
  cancelSpin = false;

  constructor(private api: APIService, private session: SessionService, private router: Router, public util: UtilService) {
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.progress = true;
    this.api.getMyOrders().subscribe(data => {
      console.log('this is all orders', data);
      this.allOrders = data;
      this.progress = false;

    }, error => {
      console.log('An error occurred while fetching Orders', error);
      this.progress = false;

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

  getMonth(month) {
    if (month.includes('m')) {
     month = month.substring(0, month.length - 1) + ' Months';
    } else if (month.includes('y')) {
      month = month.substring(0, month.length - 1) + ' Year';
    } else if (month.includes('d')) {
      month = month.substring(0, month.length - 1) + ' Days';
    }
  }

  getStatus(status: string) {
    let mWord = status.toLowerCase();
    mWord = mWord.replace('_', ' ');
    return mWord[0].toUpperCase() + mWord.substr(1).toLowerCase();
  }

  async cancelOrder(id){
    // Show progress
    this.cancelSpin = true;
    const order = await this.api.cancelOrder(id).toPromise();
    this.getAllOrders();
    this.cancelSpin = false;

  }

  getStatusColor(status: string) {
    status = status.toUpperCase();
    console.log('Status', status);
    if (status === 'PAYMENT_CONFIRMED') {
      return '#1E90FF';
    } else if (status === 'COMPLETED') {
      return '#4caf50';
    } else if (status === 'PENDING') {
      return '#f5bf18';
    } else if (status === 'CANCELLED') {
      return '#d32f2f';
    }else if (status === 'EXPIRED') {
      return '#d32f2f';
    } else {
      return '#fafafa';
    }
  }

  editOrder(id) {
    this.router.navigateByUrl('/extended-order/' + id);
  }

  showCancelButton(status) {
    status = status.toUpperCase();

    if (status === 'CANCELLED') {
      return false;
    } else if (status === 'COMPLETED') {

      return false;
    } else if (status === 'EXPIRED') {

      return false;
    } else if (status === 'REJECTED') {

      return false;
    } else {
      return true;
    }
  }

  showEditButton(status, ext) {
    status = status.toUpperCase();

    if (ext) {
      return false;
    } else if (status === 'CANCELLED') {
      return false;
    } else if (status === 'COMPLETED') {

      return false;
    } else if (status === 'EXPIRED') {
      return false;
    } else {
      return true;
    }
  }

}
