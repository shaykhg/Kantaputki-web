import { Component, OnInit } from '@angular/core';
import {SessionService} from '../../../services/session.service';
import {Router} from '@angular/router';
import {UtilService} from '../../../services/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public session: SessionService, private router: Router, public util: UtilService) { }

  ngOnInit(): void {
  }

  navigate() {
    if (!this.session.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }
}
