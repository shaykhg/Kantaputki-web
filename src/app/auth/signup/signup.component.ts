import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../services/api.service';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(public util: UtilService, private formBuilder: FormBuilder, private api: APIService, private router: Router, private session: SessionService, private data: DataBindingService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).{8,}$')]]
    });

  }

  signUp() {
    if (this.signupForm.valid) {
      const body = this.signupForm.value;
      this.api.register(body).subscribe(data => {
        console.log('You have registered successfully', data);
        this.saveInfo(data);
        this.router.navigateByUrl('/');
      }, error => {
        console.log('An error Occurred while signup', error);
        this.data.openSnackBarError(this.util.setWords('ErrorInSignUp'), 'Ok');
      });
    } else {
      this.data.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
    }

  }

  async saveInfo(data){
    const userData = {
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      id: data.user.id,
      session: data.tokens.access.expires
    };
    try {
      await this.session.setToken(data.tokens.access.token);
      await this.api.setToken(data.tokens.access.token);
      await this.api.setHeaders();
      await this.session.setUser(userData);
      await this.router.navigateByUrl('/');
      // await this.session.getExpiryTime();

    } catch (e) {
      console.log('an error occurred in saving info');
    }

  }
}
