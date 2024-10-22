import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home/home.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperIntl, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { PianoDescComponent } from './piano-desc/piano-desc.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderInfoCardComponent } from './order-info-card/order-info-card.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { TermsComponent } from './terms/terms.component';
import { ReviewComponent } from './review/review.component';
import {RatingModule} from 'ng-starrating';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {InformationComponent} from '../information/information.component';
import {AppModule} from '../app.module';
import {SafeHtmlPipe} from '../services/SafeHtml';
// import {AppModule} from '../app.module';



@NgModule({
  declarations: [
    HomeComponent,
    PianoDescComponent,
    SelectLocationComponent,
    PlaceOrderComponent,
    OrderInfoCardComponent,
    SafeHtmlPipe,
    CancellationPolicyComponent,
    TermsComponent,
    ReviewComponent,
    InformationComponent
  ],
    imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatButtonModule,
        MatCheckboxModule,
        ClickOutsideModule,
        MatTooltipModule,
        RouterModule,
        MatProgressSpinnerModule,
        RatingModule,
        FormsModule,
        MatExpansionModule,
        MatIconModule,
        // AppModule

    ],
  providers: [{provide: MatStepperIntl}]
})
export class PagesModule { }
