import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  constructor(private route: ActivatedRoute, public data: DataBindingService, public util: UtilService) { }
  status;

  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status');
  }

}
