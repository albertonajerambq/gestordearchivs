
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { FilesService } from 'src/app/core/services/files.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


declare var $: any;
declare var Jquery:any;
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  List_files:any = [];
  p: number = 1;
  files: File[] = [];
  loadfiles:boolean =false;
  folder_id:any;
  filesActive:any = [];
  loading:boolean =true;
  public dForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,private filesService:FilesService,private router:Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.authService.validarToken();

    this.getFiles();


    this.getFilesActive();


    this.dForm = this.fb.group({
      name: ['', Validators.required ],
      description: ['', Validators.required ],
      is_public: [false],

    });

  }

  get f() { return this.dForm.controls; }


  onSubmit(){
    this.submitted = true;
    const { name } = this.dForm.value;
    let body = {
      ...this.dForm.value,
      is_folder:true,
      name_real:name
    }

    this.filesService.createDirectory(body).subscribe(resp=>{

      // Notification.fnc('Success','registered information','success');
      this.modalService.dismissAll();
     this.router.navigateByUrl('/files');
     this.getFiles();
    },(err)=>{
      // Notification.fnc('Error',err.error.error.message,'error');

    })
  }




  getFiles(){
    this.loading = true;
    this.filesService.getFiles().subscribe((resp:any) =>{
      let object = {}
      let arrayFiles = [];
      for (const key in resp) {

          const element = resp[key];
          if(!element.folder_id){
            console.log(element.code);
            object = {
              id:element.id,
              name:element.name,
              size:element.size,
              extension:element.extension,
              type:element.type,
              id_user:element.id_user,
              minetype:element.minetype,
              code:element.code,
              name_real:element.name_real,
              is_public:element.is_public,
              is_folder:element.is_folder,
              folder_id:element.folder_id,
              user_id:element.user_id
            }
            arrayFiles.push(object);

          }

      }
      this.List_files = arrayFiles;
      this.loading = false;
    })
  }

  download(data:any){
    this.filesService.getDownloadfile(data.id).subscribe((resp:any)=>{
      let downloadURL = window.URL.createObjectURL(resp);
      saveAs(downloadURL,data.name_real);
    })
  }

  deleteFiles(id:string){
    Swal.fire({
      title: 'You´re sure?',
      text: "You can't reverse this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'yes delete it !'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        this.filesService.putDeleteFile(id).subscribe(resp=>{
          Swal.fire(
            'Seleted!',
            'Your file has been deleted.',
            'success'
          )
          this.getFiles()
        })
      }
    })
  }


  view(data:any){
    this.filesService.getDownloadfile(data.id).subscribe((resp:any)=>{
      let bloburl = URL.createObjectURL(resp);
      window.open(bloburl);
    })
  }



  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', centered: true });
  }

  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }


  getFilesActive(){
    this.filesService.getfilesActive().subscribe(resp =>{
      this.filesActive = resp
    })
  }

  uploadFileDB(){
    if(!this.files){
      Swal.fire("error","Empty files","error");
      return;
    }
    const  formData = new FormData();
    this.files.forEach((file)=>{
      formData.append('archivos',file)
    })

    Swal.showLoading()
    this.filesService.putFiles(formData,this.folder_id).pipe(delay(200)).subscribe((resp:any)=>{
      if(resp){
        this.getFiles();
      }

      this.dForm.setValue({name:'',description:'',is_public:false});

      setTimeout(() => {
      // Notification.fnc('success','Information saved','success');

      Swal.close();

    }, 2000);


    },(err)=>{
      // Notification.fnc('Error',err.error.error.message,'error');

    })


  }


   onUploadSuccess(args:any) {

    this.files.push(...args);
    this.loadfiles = true;
  }

  onUploadError(args:any){

  }

   clearQueue(): void {
      this.files=[]
  }





}
