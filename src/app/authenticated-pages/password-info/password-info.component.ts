import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-password-info',
  templateUrl: './password-info.component.html',
  styleUrls: ['./password-info.component.scss']
})
export class PasswordInfoComponent implements OnInit {

  constructor(private route: ActivatedRoute, public data: DataBindingService, public util: UtilService) { }
  status;

  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status');
  }

}
