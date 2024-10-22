import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageUtilsService} from '../../services/message-utils.service';
import {APIService} from '../../services/api.service';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  token;

  constructor(private message: MessageUtilsService, private formBuilder: FormBuilder, private api: APIService, private router: Router,
              private session: SessionService, public util: UtilService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).{8,}$')]]
    });

  }

  async reset() {

    const body = {
      email : this.loginForm.value.email,
    };

    await localStorage.clear();
    this.api.forgotPassword(body).subscribe(data => {
      console.log('this is forgot password resp', data);
      this.token = data;
      this.router.navigateByUrl('/password-info/reset');

    }, error => {
      console.log('An error occurred while resetting password', error    );

    });
  }

}
