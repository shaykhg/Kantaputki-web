import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {ProfileComponent} from './profile/profile.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AuthenticatedPagesRoutingModule} from './authenticated-pages-routing.module';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { PasswordInfoComponent } from './password-info/password-info.component';
import { BrowserModule } from '@angular/platform-browser';
import { ExtendedOrderComponent } from './extended-order/extended-order.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    MyOrdersComponent,
    ProfileComponent,
    PaymentInfoComponent,
    PasswordInfoComponent,
    ExtendedOrderComponent
  ], exports: [
    MyOrdersComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    AuthenticatedPagesRoutingModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class AuthenticatedPagesModule { }
