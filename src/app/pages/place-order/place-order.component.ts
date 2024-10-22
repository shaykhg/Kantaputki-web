import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {APIService} from '../../services/api.service';
import {SessionService} from '../../services/session.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {TermsComponent} from '../terms/terms.component';
import {CancellationPolicyComponent} from '../cancellation-policy/cancellation-policy.component';
import {UtilService} from '../../services/util.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  showCoupon = false;
  // showPayment = false;
  orderData;
  slotsData = [];
  inputCoupon = '';
  private slotsIsAvailable = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public dataService: DataBindingService, private api: APIService, public session: SessionService, public dialog: MatDialog, public util: UtilService) {
  }

  ngOnInit() {

    this.paymentFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      surname: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      coupon: [],
      terms: [false],
      privacy: [false]
    });
  }

  enterCoupon(change) {
    if (change.checked) {
      this.showCoupon = !this.showCoupon;
      this.paymentFormGroup.get('coupon').setValidators([Validators.required]);
      this.paymentFormGroup.get('coupon').updateValueAndValidity();
    } else {
      this.showCoupon = !this.showCoupon;
      this.paymentFormGroup.get('coupon').clearValidators();
      this.paymentFormGroup.get('coupon').updateValueAndValidity();
      this.inputCoupon = '';
      this.dataService.order.discount = 0;
      this.dataService.total =  (this.dataService.withoutTaxTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.withoutTaxTotal + this.dataService.totalAbsoluteCharge;
      this.dataService.couponApplied = false;
    }
    console.log('this is change event', change.checked);
  }


  checkout() {
    this.dataService.order.email = this.paymentFormGroup.value.email;
    this.dataService.order.name = this.paymentFormGroup.value.name;
    this.dataService.order.phone = this.paymentFormGroup.value.phone;
    this.dataService.order.subtotal = this.dataService.withoutTaxTotal;
    this.dataService.order.total = this.dataService.total;
    this.dataService.order.coupon = this.paymentFormGroup.value.coupon ? this.paymentFormGroup.value.coupon : '';
    console.log('this is order body', this.dataService.order);
    if (this.session.isLoggedIn) {
      this.dataService.order.user =  this.session.user.id;
      this.placeOrderApi();
    } else {
      this.placeOrderApi();
    }
  }

  placeOrderApi() {
    this.api.placeOrder(this.dataService.order).subscribe(data => {
      console.log('this order is placed', data);
      this.dataService.openSnackBarSuccess(this.util.setWords('OrderPlacedSuccessfully'), '');

      this.orderData = data;
      this.confirmOrder(1);
      this.router.navigateByUrl('/payment-info/success');
    }, error => {
      this.dataService.openSnackBarError(this.util.setWords('AnErrorOccurred'), '');
      this.router.navigateByUrl('/payment-info/fail');

      console.log('an error occurred while placing order', error);
    });
  }

  confirmOrder(status) {
    const body = {id: this.orderData._id, status};
    this.api.placeOrderConfirm(body).subscribe(resp => {
      console.log('this order status is', status === 1 + 'Data is ' + resp);
    });
  }

  registerNewUser() {
    const body = {
      name: this.paymentFormGroup.value.name,
      email: this.paymentFormGroup.value.email,
    };
    this.api.registerNewUser(body).subscribe(data => {
      this.dataService.order.user = data.user.id;
      // this.showPayment = true;
      this.checkout();
      console.log('this is new user', data.user);
    }, error => {
      this.dataService.openSnackBarError(this.util.setWords('AlreadyRegistered'), 'Ok');
      console.log('an error occurred while registering new user', error.status);
    });

  }

  updateOrderWithNewUser(orderId, userId) {
    const body = {
      user: userId
    };
    this.api.updateUser(orderId, body).subscribe( data => {
      console.log('this is updated Order', data);
    }, error => {
      console.log('an error occurred while updatinhg order with user Id', error);
    });
  }

  applyCoupon(value: string) {
    console.log('coupon value', value);
    const body = {
      coupon: value,
      total: this.dataService.total
    };
    this.api.applyCoupon(body).subscribe(data => {
      console.log('coupon applied successfully', data);
      this.dataService.couponApplied = true;
      this.dataService.couponDiscount = data.discount;
      this.dataService.order.discount = data.discount;
      this.dataService.couponName = value;
      this.totalAfterDiscount(data);
      // this.dataService.afterDiscountTotal = this.dataService.total - data.discount;
      // this.dataService.subTotal = this.dataService.afterDiscountTotal + (this.dataService.totalAbsoluteCharge ? this.dataService.totalAbsoluteCharge : 0)
      //   + this.dataService.totalPercentChargeValue;
      this.dataService.openSnackBarSuccess(this.util.setWords('CouponAppliedSuccess'), '');
    }, error => {
      console.log('coupon applied failed', error);
      this.dataService.openSnackBarError(this.util.setWords('PleaseEnterValidCoupon'), '');
    });

  }

  totalAfterDiscount(data) {
    this.dataService.afterDiscountTotal = this.dataService.withoutTaxTotal - data.discount;
    console.log('this is after total discount total 1', this.dataService.afterDiscountTotal, this.dataService.totalPercentChargeValue, this.dataService.totalAbsoluteCharge);
    this.dataService.afterDiscountTotal =  (this.dataService.afterDiscountTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.afterDiscountTotal + this.dataService.totalAbsoluteCharge;
    console.log('this is after total discount total 2', this.dataService.afterDiscountTotal);
    this.dataService.total = this.dataService.afterDiscountTotal;
    console.log('this is after total discount total 3',  this.dataService.total);


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TermsComponent, {
      width: '600px',
      height: '400px'
    });

  }

  openDialogCancel(): void {
    const dialogRef = this.dialog.open(CancellationPolicyComponent, {
      width: '600px',
    });
  }

  // check if user slot still exist before payment
  placeOrder() {
    console.log('this is service man in placing order', this.dataService.order.serviceMan);
    if (this.paymentFormGroup.valid) {
      this.api.getUserSlots(this.dataService.order.serviceMan).subscribe(data => {
        console.log('this is user slots', data);
        const selected = {
          date: moment(this.dataService.defaultTimeTech.date).toDate().toISOString(),
          from: this.dataService.defaultTimeTech.from,
          till: this.dataService.defaultTimeTech.till,
          available: true
        };
        const time = _.filter(data.slots, selected);
        // console.log('this is user selected slot', selected);
        // console.log('this is user data slot', data.slots);
        // console.log('this is filter', time);

        this.slotsIsAvailable = time.length > 0;
        if (this.paymentFormGroup.valid && (this.paymentFormGroup.value.terms === false || this.paymentFormGroup.value.privacy === false)) {
          this.dataService.openSnackBarError(this.util.setWords('PleaseAcceptT&C'), '');
          console.log('this is payments info', this.paymentFormGroup.value
          );
        } else if (this.paymentFormGroup.invalid) {
          this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
        } else if (this.slotsIsAvailable){
          if (!this.session.isLoggedIn) {
            this.checkout();
          } else {
            this.checkout();
          }
        } else{
          this.dataService.step.payment = false;
          setTimeout(() => {
            this.dataService.index = 1;
          }, 30);
          this.dataService.openSnackBarError(this.util.setWords('SlotNotExist'), 'Ok');
          console.log('Go back');
        }
      }, error => {
        console.log('an error occurred while getting user slots', error);
        this.dataService.openSnackBarError(this.util.setWords('ErrorWhileConfirming'), 'Ok');
        this.slotsIsAvailable = false;
      });

    } else {
      this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
    }
  }

  removeCoupon() {
    this.dataService.total =  (this.dataService.withoutTaxTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.withoutTaxTotal + this.dataService.totalAbsoluteCharge;
    this.inputCoupon = '';
    this.dataService.order.discount = 0;
    this.dataService.couponApplied = false;
  }
}
