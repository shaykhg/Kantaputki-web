import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageLayoutComponent} from './page-layout/page-layout.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: PageLayoutComponent,
    loadChildren: () => import('./page-layout/page-layout.module').then(m => m.PageLayoutModule)
  },
  {
    path: 'termsconditions',
    component: TermsConditionsComponent

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
