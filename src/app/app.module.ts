import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SuccessDialogueComponent } from './shared/ui/dialogues/success-dialogue/success-dialogue.component';
import { ErrorDialogueComponent } from './shared/ui/dialogues/error-dialogue/error-dialogue.component';
import { WarningDialogueComponent } from './shared/ui/dialogues/warning-dialogue/warning-dialogue.component';
import {TitleCasePipe} from './shared/pipes/title-case.pipe';
import {ShortNumberPipe} from './shared/pipes/short-number.pipe';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpErrorInterceptor} from './services/http-error-interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import {PageLayoutModule} from './page-layout/page-layout.module';
import {PagesModule} from './pages/pages.module';
import {AuthModule} from './auth/auth-module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LastServiceDialogueComponent } from './shared/ui/dialogues/last-service-dialouge/last-service-dialogue.component';
import {MatButtonModule} from '@angular/material/button';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

@NgModule({
  declarations: [
    AppComponent,
    SuccessDialogueComponent,
    ErrorDialogueComponent,
    WarningDialogueComponent,
    TitleCasePipe,
    ShortNumberPipe,
    PageLayoutComponent,
    LastServiceDialogueComponent,
    TermsConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PageLayoutModule,
    PagesModule,
    HttpClientModule,
    AuthModule,
    MatSlideToggleModule,
    MatButtonModule,


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
