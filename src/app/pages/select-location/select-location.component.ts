import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {APIService} from '../../services/api.service';
import {Extra} from '../../shared/models/Extras';
import * as _ from 'lodash';
import * as moment from 'moment';
import {UtilService} from '../../services/util.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class SelectLocationComponent implements OnInit {
  locationFormGroup: any;
  showSchedule = false;
  schedule = null;
  calendar = [];
  showCalendar = false;
  defaultTimeTech: any = {date: Date, id: '', name: '', from: '', till: '', email: '', phone: ''};

  public selectedTimeTech;
  postCodeIsValid = false;
  public postCodeResult;
  post;
  loading = false;
  date = moment();
  showPrevious = 0;
  public days: moment.Moment[];
  private postcodes: Extra[];
  public firstTime: { date: any; till: any; phone: any; from: any; name: any; email: any, id: any };
  locProgress = false;
  calendarProgress = false;

  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, public dataService: DataBindingService, private api: APIService, public util: UtilService) {
  }

  ngOnInit() {
      this.locationFormGroup = this.formBuilder.group({
      building: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', Validators.required]
    });
  }

  sendLocationData() {
    if (this.locationFormGroup.valid && this.schedule === null) {
      this.schedule =  {date: this.calendar[0].date, time: this.calendar[0].from, technician: this.calendar[0].name};

      this.dataService.scheduleInfo = this.schedule;
      this.dataService.locationData = this.locationFormGroup.value;
      this.dataService.order.serviceMan = this.schedule.id;
      this.setDataForOrder();

    } else if (this.locationFormGroup.invalid) {
      this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
    } else {
      this.dataService.scheduleInfo = this.schedule;
      this.dataService.locationData = this.locationFormGroup.value;
      this.dataService.order.serviceMan = this.schedule.id;
      this.setDataForOrder();

    }
  }

  isSlotsAvl(day) {
    const slots = [];
    for (const date of this.calendar) {
      if (day.isSame(date.date, 'day')) {
        return true;
      }
    }
    return slots.length > 0;
  }

  setDataForOrder() {
    this.dataService.step.location = true;
    this.dataService.order.address = this.locationFormGroup.value.building;
    this.dataService.order.city = this.locationFormGroup.value.city;
    this.dataService.order.postcode = this.locationFormGroup.value.postcode;
    console.log('will not further');
    this.dataService.index = 1;

    setTimeout(() => {
      this.dataService.index = 2;
      console.log('will go further');

    }, 30);
  }

  scheduleInfo(item) {
    this.selectedTimeTech = item;
    this.dataService.defaultTimeTech = item;
    console.log('this is date to be passed in order');
    this.dataService.order.date = item.date;
    this.dataService.order.time = item.from;
    this.schedule = item;
    this.dataService.openSnackBarSuccess(this.util.setWords('ScheduleSelected'), '');

  }

  addLocation(postcode) {
    this.locProgress = true;
    this.checkAvailability(postcode);
    // this.dataService.locationData = undefined;
    // this.defaultTimeTech = undefined;
    if (this.locationFormGroup.valid && this.postCodeIsValid) {
      this.getSlots();
      this.showSchedule = false;

      // console.log(this.dataService.locationData);
    } else {
      this.locProgress = false;
      this.dataService.openSnackBarError(this.postCodeIsValid ? 'Please enter valid street address' : 'Please Select a valid postcode', '');
    }
  }

  setTimeTech(event: MatCheckboxChange) {
    if (event.checked) {
      this.showSchedule = true;
      this.selectedTimeTech = undefined;
      this.dataService.defaultTimeTech = this.firstTime;
      this.dataService.order.date = this.firstTime.date;
      this.dataService.order.time = this.firstTime.from;
    } else {
      this.showSchedule = false;
      this.dataService.defaultTimeTech = this.firstTime;
      this.dataService.order.date = this.firstTime.date;
      this.dataService.order.time = this.firstTime.from;
    }

  }

  timeSelectedCss(item) {
    return item === this.selectedTimeTech ? 'time-slot-selected' : 'time-slot';

  }

  checkAvailability(postcode) {
    this.loading = true;
    console.log('these are postcodes', postcode);
    const body = [{type: 'postcode'}, {value: postcode}];
    this.api.getAllSearchInExtras(body).subscribe(data => {
      this.postcodes = data;
      this.loading = false;
      console.log('postcodes***********', this.postcodes);

      if (_.find(this.postcodes, {value: postcode})) {
        this.postCodeResult = _.find(this.postcodes, {value: postcode});
        this.postCodeIsValid = true;
        this.post = this.postCodeResult.name;
      } else {
        this.dataService.openSnackBarError('Please enter a valid postcode', '');
        console.log('this postcode is not available');
        this.postCodeIsValid = false;
        this.post = undefined;
        this.loading = false;
      }
    }, error => {
      console.log('An error occurred while fetching postcodes', error);
      this.loading = false;

    });
  }

  getSlots() {
    this.getNextDays();
    this.calendar = [];
    const body = {
      city: this.locationFormGroup.value.city.toLowerCase(),
      postcode: this.locationFormGroup.value.postcode
    };
    this.api.getFutureSlots(body).subscribe(data => {
      if ( data.length > 0) {
        // console.log('this is slot data', data);
        data.forEach(item => {
          item.slots.forEach(resp => {
            // console.log('this is calendar', resp);
            const mStart = moment(resp.date).toDate();
            mStart.setHours(Number(resp.from.split(':')[0]));
            mStart.setMinutes(Number(resp.from.split(':')[1]));
            if (resp.available) {
              if (moment(mStart).isAfter(moment().startOf('day').add(1, 'day'))) {
                this.calendar.push({startTime: mStart, date: moment(resp.date).toDate(), id: item.id, name: item.name, from: resp.from, till: resp.till, email: item.email, phone: item.phone, available: resp.available});
              }
            }
          });
        });
        this.calendar.sort((a, b) => {
          return a.startTime - b.startTime;
        });
        // console.log('First avl time***************', this.calendar[0], this.calendar);
        this.firstTime = {date: this.calendar[0].date, id: this.calendar[0].id, till: this.calendar[0].till, from: this.calendar[0].from, name: this.calendar[0].name , email: this.calendar[0].email, phone: this.calendar[0].phone};
        // tslint:disable-next-line:max-line-length
        this.dataService.defaultTimeTech = {date: this.calendar[0].date, id: this.calendar[0].id, till: this.calendar[0].till, from: this.calendar[0].from, name: this.calendar[0].name , email: this.calendar[0].email, phone: this.calendar[0].phone};
        this.dataService.order.technician = this.firstTime.name;
        this.dataService.order.date = this.firstTime.date;
        this.dataService.order.time = this.firstTime.from;
        this.dataService.order.technician = this.firstTime.name;
        this.schedule = this.firstTime;

        console.log('default tech time', this.dataService.defaultTimeTech);
        const grouped = _.chain(this.calendar).groupBy('date').map((value, key) => ({date: key, slots: value})).value();
        _.remove(grouped, item => moment(item.date).isBefore(moment(), 'day') || moment(item.date).isAfter(moment().add(60, 'day')));
        this.calendar = grouped;
        this.locProgress = false;

        this.showCalendar = true;
        this.snackBar.dismiss();

        this.dataService.locationData = this.locationFormGroup.value;

        // console.log('this is grouped item', this.calendar);
      } else {
        this.dataService.locationData = undefined;
        this.locProgress = false;
        this.showCalendar = false;

        this.openFixSnackBarError(this.util.setWords('SorryNoTechnician'), 'Ok');
      }
    }, error => {
      console.log('an error occurred while getting slots', error);
    });
  }


  onSearchChange(value) {
    if (value.length === 5) {
      this.checkAvailability(value);
    }
  }

  getNextWeek() {
    this.calendarProgress = true;

    this.date = this.date.add('7', 'day');
    this.showPrevious = this.showPrevious + 1;
    this.getNextDays();
    this.calendarProgress = false;

  }

  getPreviousWeek() {
    this.calendarProgress = true;
    this.date = this.date.subtract('7', 'day');
    this.showPrevious = this.showPrevious - 1;
    this.getNextDays();
    this.calendarProgress = false;
  }

  getNextDays() {
    let daysToGet = 7;
    const arrDays = [];
    while (daysToGet) {
      const current = moment(this.date).add(daysToGet, 'day');
      if (current.startOf('day').isSameOrBefore(moment().startOf('day'))) {
        // console.log('add no new date in here *********', current);
      } else {
        // console.log('add new date here *********', current);
        // console.log('add new date here *********', this.util.getHumanShortDate(current));
        arrDays.push(current);
        daysToGet--;
      }
    }
    // console.log('these are next 7 days', arrDays);
    if (this.showPrevious > 0) {
      this.days = arrDays.reverse();
    } else if (this.showPrevious === 0) {
      this.days = arrDays.reverse();
    }
  }

  openFixSnackBarError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: undefined,
    });
  }
}
