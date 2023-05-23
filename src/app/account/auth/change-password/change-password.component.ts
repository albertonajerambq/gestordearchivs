import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmedValidator } from './confirmed.validator';
import { UsersService } from 'src/app/core/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent   implements OnInit, AfterViewInit  {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  id_user:string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,private usersService:UsersService) { }

  ngOnInit() {

    this.activatedRoute.params
    .subscribe( ({ id }) =>{
      this.searchToken( id );
    });


    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')] ],
      password2: ['', [Validators.required]],
    },{
      validator: ConfirmedValidator('password', 'password2')
  });

  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    if(this.resetForm.invalid){
      return;
    }

    let id_de  =this.id_user;
    let body = {
      ...this.resetForm.value,
      id:id_de
    }

  this.usersService.changePassword(body).subscribe((resp:any) =>{

      Swal.fire('Success',resp.msg,'success');

      this.router.navigate(['/account/login']);


  },err=>{
    // Notification.fnc('Error',err.error.message,'error');
      Swal.fire('Error',err.error.message,'error');
    this.router.navigate(['/account/login']);
  })


  }

  searchToken(id:string){
     if(!id){
      return;
     }

     this.usersService.ValidToken(id).subscribe((resp:any) =>{

      if(resp.ok){

      this.id_user = resp.uid

      }else{

        Swal.fire('Error',resp.msg,'error')
      }
     },(err)=>{
      Swal.fire('Error',err.error.message,'error')
     })
  }
}
