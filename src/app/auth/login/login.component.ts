import { Component, OnInit } from '@angular/core';
import {MessageUtilsService} from '../../services/message-utils.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APIService} from '../../services/api.service';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';
import {log} from 'util';
import {UtilService} from '../../services/util.service';
import {DataBindingService} from '../../services/data-binding.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private message: MessageUtilsService, private formBuilder: FormBuilder, private api: APIService, private router: Router,
              private session: SessionService, private data: DataBindingService, public util: UtilService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).{8,}$')]]
    });

  }

  async login() {

    if (this.loginForm.valid){
      const body = {
        email : this.loginForm.value.email,
        password : this.loginForm.value.password
      };

      await localStorage.clear();
      try {
        const loginResponse =  await this.api.login(body).toPromise();
        if (loginResponse.user.role === 'service') {
          this.data.openSnackBarError(this.util.setWords('LoginByUser'), '');
          this.message.showErrorDialogue();
        } else {
          if (loginResponse.tokens.access) {
            await this.saveInfo(loginResponse);
          }
          console.log('this is login response', loginResponse.tokens.access.token);
        }

      } catch (e) {
        this.api.handleError(e);
        console.log('this is the error while logging in',  e);
        // Now call msg service and there should be an special dialog for error this.msgService.showError(e.msg)
      }
    } else {
      this.data.openSnackBarError( this.util.setWords('CorrectErrors'), 'Ok');
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
