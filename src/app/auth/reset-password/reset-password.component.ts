import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MessageUtilsService} from '../../services/message-utils.service';
import {APIService} from '../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  private token: string;

  constructor(private message: MessageUtilsService, private formBuilder: FormBuilder, private api: APIService, private router: Router,
              private session: SessionService, private route: ActivatedRoute, public util: UtilService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['']
    }, {validator: this.checkPasswords });
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('this is token', this.token);
    console.log('this is token', this.loginForm.value.password);
  }

  async newPassword() {

    const body = {
      password : this.loginForm.value.password
    };
    console.log('this is body', body);

    this.api.newPassword(body, this.token).subscribe(data => {
      console.error('this is new password data', data);
      this.router.navigateByUrl('/password-info/create');

    }, error => {
      console.error('an error occurred while changing password', error);
    });

    await localStorage.clear();

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

}

//

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return control.parent.errors && control.parent.errors && control.touched && (invalidCtrl || invalidParent);
  }
}
