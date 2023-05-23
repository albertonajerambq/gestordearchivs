import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  users:any = [];
  p: number = 1;
  loading:boolean =true;

  constructor(private usersService:UsersService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Users' }, { label: 'Users List', active: true }];
    this.getAllUsers();
  }

  getAllUsers(){

    this.loading = true;
    this.usersService.getAll().pipe(delay(100)).subscribe((resp:any) =>{

      this.users = resp;
      this.loading = false;
      // this.dtTrigger.next();
    })
  }
  getUserById(id:string){
      return new Promise ((resolve ,reject) =>{
        this.usersService.UserByid(id).subscribe((resp:any) =>{
          if(resp){
            resolve(resp.name)
          }else{
            resolve('None')

          }
        })
      })

  }



  updateValue(e:any,usuario:any){

    let value = e.target.checked;

    if(value){

      this.usersService.changeStatus( 'active',usuario.id )
      .subscribe( resp => {

        this.getAllUsers();
        // Notification.fnc('Deleted user','User was successfully activated','success');
        Swal.fire('Deleted user','User was successfully activated','success')


      });

    }else{

      if ( usuario.id === this.usersService.usuario.uid ) {
        // Notification.fnc('Error','You cant erase yourself','error');
        Swal.fire('Error','You cant erase yourself','error')

        this.getAllUsers();
        return;
      }
      this.usersService.changeStatus( 'inactive',usuario.id )
      .subscribe( resp => {
        // Notification.fnc('Actived user','User was successfully activated','success');
        Swal.fire('Actived user','User was successfully activated','success')
        this.getAllUsers();
      })

    }
  }

sendChangePass(e:any,body:any){

let value = e.target.checked;
if(value){

this.usersService.changePasswordUser(body).subscribe((resp:any)=>{
    if(resp.ok){
      Swal.fire('Success',resp.msg,'success')
      // Notification.fnc('Actived user',resp.msg,'success');
    }else{
      // Notification.fnc('Error',resp.msg,'error');
      Swal.fire('Error',resp.msg,'error')


    }
  },err =>{
    // Notification.fnc('Error',err.error.message,'error');
    Swal.fire('Error',err.error.message,'error')

  })
  setTimeout(() => {
    Swal.close()
  }, 10000);

}


}
}
