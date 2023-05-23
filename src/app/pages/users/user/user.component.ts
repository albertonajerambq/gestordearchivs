import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users.service';
import { MustMatch } from './validation.mustmatch';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare  var $ :any;
declare  var jQuery :any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  registerForm: FormGroup; // bootstrap validation form
  public usuarioSeleccionado:any;
  selectValue: any[] = [
    {
      value:'ADMIN_USER_ROLE',
      name:'Admin'
    },
    {
      value:'USER_ROLE',
      name:'User'
    },
    {
      value:'MBQ_ADMIN_ROLE',
      name:'Mbq admin'
    }
  ];
  constructor(public formBuilder: FormBuilder, private router: Router,
    private usersService:UsersService,
    private activatedRoute:ActivatedRoute ) { }
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Form submition
  submit: boolean;
  formsubmit: boolean;
  typesubmit: boolean;
  rangesubmit: boolean;

  ngOnInit() {
    this.activatedRoute.params
    .subscribe( ({ id }) =>{

      this.searchUser( id )
    });
    this.breadCrumbItems = [{ label: 'User' }, { label: 'New', active: true }];

    /**
     * Bootstrap validation form data
     */
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required,Validators.maxLength(25),Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'),Validators.maxLength(320)]],
      user_type: [null, [Validators.required]],
    });

    /**
     * Bootstrap tooltip validation form data
     */
  }
  /**
   * Returns form
   */
  get form() {
    return this.registerForm.controls;
  }


  onSubmit(){
    this.submit = true;
    if ( this.registerForm.invalid ) {
      return;
      }


      if ( this.usuarioSeleccionado ) {

        let data = {
          ...this.registerForm.value,
          id:this.usuarioSeleccionado.id,
        }


      this.usersService.putUser(data).subscribe(resp =>{
        // Notification.fnc('Success','updated information','success');
        Swal.fire('Success','updated information','success')
        this.router.navigateByUrl("/users");
      },(err)=>{
        Swal.fire('Error',err?.error?.message,'error')
        this.router.navigateByUrl("/users");

        // Notification.fnc('Error',err?.error?.message,'error');
      });

  }else{

        this.usersService.postUser(this.registerForm.value).subscribe(resp =>{
          // Notification.fnc('Success','registered information','success');
        Swal.fire('Success','registered information','success')

          this.router.navigateByUrl("/users");
        },(err)=>{
        Swal.fire('Error',err?.error?.message,'error')

          // Notification.fnc('Error',err?.error?.message,'error');
        });



  }

  }



  searchUser(id:string){
    if(id === 'new'){
      return;
    }

  this.usersService.UserByid(id).subscribe((resp:any) =>{

     const {id,name,email,avatar,user_type,status,password,user_id,createdAt,updatedAt} = resp;
     this.usuarioSeleccionado = resp;
    this.registerForm.setValue({name,email,user_type });
    })



  }


}
