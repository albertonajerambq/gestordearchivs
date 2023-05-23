import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,private usersService:UsersService) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.usersService.findByEmail(this.resetForm.value).subscribe((resp:any) =>{

      if(resp.ok){
          // Notification.fnc('Success',resp.msg,'success');
          Swal.fire('Success',resp.msg,'success');
          this.router.navigate(['/account/login']);
        }else{
          // Notification.fnc('Error',resp.msg,'error');
          Swal.fire('Error',resp.msg,'error');


          this.router.navigate(['/account/login']);

        }


   },(err)=>{
    // Notification.fnc('Error',err.error.message,'error');
    Swal.fire('Error',err.error.message,'error');


    this.router.navigate(['/account/login']);

   })
  }

  }

