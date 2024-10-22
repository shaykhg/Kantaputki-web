import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../services/api.service';
import {User} from '../../shared/models/UserDetail';
import {SessionService} from '../../services/session.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  private userData: User;
  progress = false;

  constructor(private formBuilder: FormBuilder, private api: APIService, private localStorage: LocalStorageService, private session: SessionService,
              private data: DataBindingService, public util: UtilService) { }

    ngOnInit(): void {
      this.profileForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: [''],
        telephone: [''],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
        address: [''],
        city: [''],
        country: [''],
        postcode: [''],
      });
      console.log(this.session.getUser());
      this.getUserDetails();
    }

    getUserDetails() {
      this.progress = false;
      this.api.getUser(this.session.user.id).subscribe(data => {
        this.userData = data;
        this.profileForm.patchValue({
          firstName: this.userData.name,
          lastName: this.userData.lastName,
          telephone: this.userData.phone,
          email: this.userData.email,
          address: this.userData.address,
          city:  this.userData.city[0],
          country:  this.userData.country,
          postcode: this.userData.postcode
        });
        console.log('This is user data', this.userData);
        this.progress = false;
      }, error => {
        console.log('an error occurred while fetching user data', error);
        this.progress = false;

      });
    }

    updateUserProfile() {
    this.progress = true;
    const body = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      phone: this.profileForm.value.telephone,
      email: this.profileForm.value.email,
      city:  this.profileForm.value.city,
      country:  this.profileForm.value.country,
      postcode: this.profileForm.value.postcode,
      address: this.profileForm.value.address
    };
    this.api.updateUser(this.session.user.id, body).subscribe( data => {
      this.data.openSnackBarSuccess('Profile updated successfully', '');
      console.log('this is updated user', data);
      this.progress = false;
      this.data.openSnackBarSuccess('Profile updated Successfully', '');
      }, error => {
      this.progress = false;
      this.data.openSnackBarError('An error occurred while updating your profile', '');

      console.log('an error occurred while updating user', error);
    });
    }
}
