import {Component, OnInit} from '@angular/core';
import {StarRatingComponent} from 'ng-starrating';
import {APIService} from '../../services/api.service';
import {Extra, Extras} from '../../shared/models/Extras';
import * as _ from 'lodash';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {Order} from '../../shared/models/Orders';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviewType: Extra[] = [];
  attribute = [];

  constructor(private api: APIService, private router: Router, private route: ActivatedRoute, public util: UtilService) {
  }

  orderId;
  orderData: Order;
  remark = '';

  ngOnInit(): void {
    this.getReviewType();
    this.orderId = this.route.snapshot.params.id;
    this.getOrderDetails();
    console.log('this is order id', this.orderId);
  }

  // Get Order Details

  getOrderDetails() {
    this.api.getOrder(this.orderId).subscribe( data => {
      this.orderData = data;
    }, error => {
      console.log('an error occurred while fetching order data', error);
    });

  }
  // Get value of star rating
  onRate($event: { oldValue: number; newValue: number; starRating: StarRatingComponent }, name, id) {
    let existing = [];

    // Check for existing item

    existing = _.filter(this.attribute, {name});
    console.log('existing item', existing);
    if (existing.length > 0) {
      const omit = _.remove(this.attribute, item => item.name === name);
      console.log('removed existing item', omit);
      this.attribute.push({name, rating: $event.newValue, _id: id});
      console.log('Pushed new value', this.attribute);
    } else {
      this.attribute.push({name, rating: $event.newValue, _id: id});
      console.log('brand new value', this.attribute);

    }
  }


  // Get reviews type
  getReviewType() {
    this.api.getAllReviewsType().subscribe(data => {
      this.reviewType = data.results;
      console.log('these are review types', this.reviewType);

    }, error => {
      console.log('an error occurred while getting reviews type', error);
    });
  }

  // Post review Data to api
  submitReview() {
    let sum = _.sumBy(this.attribute, 'rating');
    sum = Math.round(sum / this.attribute.length);
    console.log('sum of rating', sum);
    const body = {
      attributes: this.attribute,
      name: this.orderData.name,
      comment: this.remark,
      order: this.orderData._id,
      user: this.orderData.serviceMan,
      enable: true,
      rating: sum,
    };
    this.api.postReview(body).subscribe(data => {
      this.router.navigateByUrl('/');
      console.log('Review posted successfullly', data);
    }, error => {
      console.log('Review posted successfullly', error);

    });
  }

}
