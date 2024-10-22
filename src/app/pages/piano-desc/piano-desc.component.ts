import { AppConstants } from './../../AppConstants';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import * as _ from 'lodash';
import {APIService} from '../../services/api.service';
import {Services} from '../../shared/models/Services';
import {Extra} from '../../shared/models/Extras';
import {Charge} from '../../shared/models/Charges';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-piano-desc',
  templateUrl: './piano-desc.component.html',
  styleUrls: ['./piano-desc.component.scss']
})
export class PianoDescComponent implements OnInit {
  isLinear = false;
  descFormGroup: FormGroup;
  type: any;
  lastService: any;
  public chosenServices = [];
  public selectedServices = [];
  public allServices: Services;
  piano = {
    name: ''
  };
  public allPianoNames: Extra[] = [];
  private total: number;

  public charges: Charge[];
  totalAbsoluteCharge;
  totalPercentCharge;
  public subTotal: any;
  private totalPercentChargeValue: number;
  public allLastService: any = [];
  private withoutTaxTotal = 0;
  public checkedBox = [];
  notAvl = false;
  customServiceName = '';
  customServiceDesc = '';
  selected: any = [];

  constructor(private formBuilder: FormBuilder, public dataService: DataBindingService, private api: APIService, private session: SessionService,
              public util: UtilService) {
  }

  ngOnInit() {
    this.descFormGroup = this.formBuilder.group({
      // name: ['', Validators.required],
      // sno: [''],
      // type: ['', Validators.required],
      // lastService: ['', Validators.required]
    });
    if (this.dataService.selectedService.length > 0) {
    } else {
      this.getAllServices();
    }
    this.getAllCharges();
    this.getAllLastService();
    console.log('this user is logged in', this.session.isLoggedIn);
    console.log('this user is logged in', this.session.user);
  }

  sendData() {
    this.dataService.descData = this.descFormGroup.value;
    console.log('this is desc form values', this.descFormGroup.value);
    if (this.descFormGroup.valid && this.chosenServices.length > 0) {
      this.dataService.order.pianoName = this.descFormGroup.value.name;
      this.dataService.order.service = this.chosenServices;
      this.dataService.order.type = this.descFormGroup.value.type;
      this.dataService.order.serial = this.descFormGroup.value.sno;
      this.dataService.order.lastService = this.descFormGroup.value.lastService;
      this.dataService.step.desc = true;
      setTimeout(() => {
        this.dataService.index = 1;
      }, 30);
    } else if (this.descFormGroup.invalid) {
      this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');

    } else {
      this.dataService.openSnackBarError( this.util.setWords('PleaseSelectService') , 'Ok');

    }
    console.log('this is form data', this.descFormGroup.value);
  }

  pushService(service, $event: MatCheckboxChange) {
    const servicePrice = service.price + service.price * this.totalPercentCharge / 100;
    console.log('this is pushed service', service);
    const serviceBody = {
      name: service.name,
      shortName: service.shortName,
      name_fi: service.name,
      desc: service.desc,
      desc_fi: service.desc,
      type: 'Service',
      price: servicePrice,
      enable: true,
    };

    if ($event.checked) {
      service.checked = true;
      this.chosenServices.push(serviceBody);
      this.dataService.setService(this.chosenServices);
      this.total = _.sumBy(this.chosenServices, 'price');
      console.log('this is total after adding', this.total);

      this.dataService.total = this.total;
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) + this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      this.dataService.total = this.total + this.totalAbsoluteCharge;
      console.log('this is subtotal', this.totalAbsoluteCharge);

      this.selectedServices.push(service);
      this.withoutTaxTotal = _.sumBy(this.selectedServices, 'price');
      this.dataService.withoutTaxTotal = this.withoutTaxTotal;
      console.log('this is all service data chaaecked', this.dataService.allServices);

    } else {
      service.checked = false;

      _.remove(this.chosenServices, serviceBody);
      this.dataService.setService(this.chosenServices);

      this.total = _.sumBy(this.chosenServices, 'price');
      console.log('this is total ater removal', this.total);
      this.dataService.total = this.total;
      console.log('this is % ************', this.totalPercentChargeValue);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) + this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      this.dataService.total = this.total + this.totalAbsoluteCharge;
      console.log('this is subtotal', this.totalAbsoluteCharge);
      _.remove(this.selectedServices, service);
      this.withoutTaxTotal = _.sumBy(this.selectedServices, 'price');
      this.dataService.withoutTaxTotal = this.withoutTaxTotal;
      console.log('this is subtotal', this.totalAbsoluteCharge);
      console.log('this is all service data unchecked', this.dataService.allServices);

    }
  }

  getServiceClass(service) {
    return _.find(this.selectedServices, service) ? 'service-details-selected' : 'service-details';
  }

  getServiceButton(service) {
    return !!_.find(this.selectedServices, service);
  }

  //  Api call to get All Services

  getAllServices() {
    this.api.getAllServices().subscribe(data => {
      this.allServices = data;
      this.dataService.allServices = this.allServices;
      for (const item of this.dataService.allServices.results) {
        for (const product of item.products) {
          product.checked = false;
        }
      }
      console.log('All Service Data', this.dataService.allServices);
    }, error => {
      console.log('An error occured while getting all services', error);
    });
  }

  getPiano(type, query) {
    const body = [{type}, {name: query}];
    this.api.getAllSearchInExtras(body).subscribe(data => {
      this.allPianoNames = data;
      console.log('These are all Piano names', data);
      console.log('These are all Piano names', this.allPianoNames);

    }, error => {
      console.log('An error occurred while getting all piano names', error);
    });
  }

  onClickedOutside($event: Event) {
    this.allPianoNames = [];
  }

  addExtraTimes(result) {
    this.piano.name = result.name;
    console.log('this is piano', result);
  }

  getAllCharges() {
    this.api.getAllCharges().subscribe(data => {
      this.charges = data.results;
      for (const charge of this.charges) {
        if (charge.enable) {
          this.dataService.charges.push(charge);
          this.dataService.order.charges.push(charge);
        } else {
        }
      }
      this.dataService.charges = this.charges;
      const absolute = data.results;
      this.sumAllCharges();
      console.log('this sum of charges', this.sumAllCharges());
    }, error => {
      console.log('An error Occurred while getting charges', error);
    });
  }

  getAllLastService() {
    const body = [{type: 'last'}];
    this.api.getAllSearchInExtras(body).subscribe(data => {
      data.forEach(item => {
        if (item.enable) {
          this.allLastService.push(item);
        }
      });
      this.allLastService = data;
      console.log('these are all last services', this.allLastService);
    }, error => {
      console.log('An error Occurred while all services', error);
    });
  }

  async sumAllCharges() {
    console.log('these are all charges', this.charges);

    const allAbsolute = _.filter(this.charges, {amountType: 'absolute'});
    console.log('all absolute', allAbsolute);
    const allPercentage = _.filter(this.charges, {amountType: 'percentage'});
    console.log('all percentage', allPercentage);

    this.totalAbsoluteCharge = _.sumBy(allAbsolute, 'value');
    this.dataService.totalAbsoluteCharge = this.totalAbsoluteCharge;
    console.log('sum of all absolute', this.totalAbsoluteCharge);

    this.totalPercentCharge = _.sumBy(allPercentage, 'value');
    this.dataService.totalPercentChargeValue = this.totalPercentCharge;

    console.log('sum of all percentage', this.totalPercentCharge);
  }

  enableService($event: MatCheckboxChange, index) {
    console.log('this is clicked', $event);
    if ($event.checked) {
      this.checkedBox.push(index);
      console.log('this is clicked***********', this.checkedBox);

    } else {
      const remove = this.checkedBox.indexOf(index);
      if (remove > -1) {
        this.checkedBox.splice(index, 1);
        console.log('this is removed***********', this.checkedBox);
      }
    }
  }

  checkEnabled(index) {
    return !this.checkedBox.includes(index);
  }

  openNotAvl() {
    this.notAvl = true;
  }

  addCustomService(name, desc) {
    console.log('custom service data', name, desc);
    const serviceBody = {
      name,
      shortName: name,
      name_fi: name,
      desc,
      desc_fi: desc,
      type: 'custom',
      price: 0,
      enable: true,
      expanded: false
    };
    this.chosenServices.push(serviceBody);
    this.dataService.setService(this.chosenServices);
    this.customServiceName = this.customServiceDesc = '';
    this.notAvl = !this.notAvl;
  }

  removeCustomService(service) {
    _.remove(this.chosenServices, service);
    this.dataService.setService(this.chosenServices);
  }

  getDescription(service) {
    service.desc = service.desc.replaceAll('&lt;', '<');
    if (service.expanded) {
      return service.desc;
    } else if (service.desc.length <= 75) {
      return service.desc;

    } else if (service.desc.length > 75){
      return service.desc.slice(0, 75) + '...';
    }
    }

  createCustomObject(selected: any) {
    console.log('this will be used to create custom object', selected.products);
    selected.products.forEach(item => {
      item.expanded = false;
    }
  );
  }


  expandCustomPanel(service) {

  }

  changeExpandedState(service: any) {
    this.selected.products.forEach(item => {
      if (item === service) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = false;
      }
    });
  }

  changeCustomExpandedState(service: any) {
    this.dataService.selectedService.forEach(item => {
      if (item === service) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = false;
      }
    });
  }
}
