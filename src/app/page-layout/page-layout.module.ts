import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutRoutingModule } from './page-layout-routing.module';
import {HeaderComponent} from '../shared/ui/header/header.component';
import {FooterComponent} from '../shared/ui/footer/footer.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {AuthenticatedPagesModule} from '../authenticated-pages/authenticated-pages.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
    imports: [
        CommonModule,
        PageLayoutRoutingModule,
        MatSnackBarModule,
        AuthenticatedPagesModule,
        MatSlideToggleModule,
        MatButtonModule,


    ],
  providers: []
})
export class PageLayoutModule { }
