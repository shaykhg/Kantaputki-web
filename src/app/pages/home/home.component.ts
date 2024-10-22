import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('stepper') stepper;


  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: any;
  // indexNumber: any;

  constructor(private formBuilder: FormBuilder, public dataService: DataBindingService, public util: UtilService) {
    // this.dataService.customObservable.subscribe((res) => {
    //     // this.changeStep(res);
    //   }
    // );
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  // changeStep(index: number) {
  //   console.log('change step method using index was called', index);
  //   this.indexNumber = index;
  //   this.stepper.selectedIndex = index;
  // }
  //
  // changeStep(){
  //   this.myStepper.next();
  // }
}
