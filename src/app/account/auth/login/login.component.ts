import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  submitted = false;
  error = '';

  isLoading = false;
  button = 'Log In';
  public loginForm = this.fb.group({
    email: ['', [ Validators.required, Validators.email ] ],
    password: ['', [Validators.required,Validators.minLength(8)] ],
  });

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private usersService:UsersService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }



  onSubmit(){
    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }
    this.isLoading = true;
    this.button = 'Loading';

    this.usersService.login(this.loginForm.value).subscribe(resp =>{
      // console.log(resp);
      // Notification.fnc('Success','registered information','success');
      this.router.navigateByUrl('/files');
    },(err)=>{

      this.error = err.error.message ?  err.error.message : '';
      // Notification.fnc('Error',err.error.error.message,'error');


    })

    setTimeout(() => {
      this.isLoading = false;
      this.button = 'Log In';
    }, 3000)
  }
}
