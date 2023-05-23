import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';


import { delay } from 'rxjs/operators';
import { FilesService } from 'src/app/core/services/files.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $:any;
declare var jQuery:any;


@Component({
  selector: 'app-details-files',
  templateUrl: './details-files.component.html',
  styleUrls: ['./details-files.component.scss']
})
export class DetailsFilesComponent implements OnInit {
  file:any = {};
  filesInDirectory:any = []
  files: File[] = [];
  public type: string = 'component';
  public disabled: boolean = false;
  loadfiles:boolean =false;
  folder_id:string;
  p: number = 1;
  public dForm!: FormGroup;



  constructor(private filesService:FilesService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe( ({ code,id }) =>{
        this.folder_id = id;
      this.loadDetails( code,id )
      this.loadOne(id);
    });


    this.dForm = this.fb.group({
      name: ['', Validators.required ],
      description: ['', Validators.required ],
      is_public: [false],

    });


  }

  get f() { return this.dForm.controls; }

  loadDetails(code: string,id:string) {

    this.filesService.filterByCode(code,id).subscribe(resp =>{
      this.filesInDirectory = resp;
    })

  }
  loadOne(id:string){

    this.filesService.filterByID(id).subscribe(resp =>{

      this.file = resp;

    })
  }


  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }


  public onUploadError(args: any): void {
    console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    this.files.push(...args);
    this.loadfiles = true;
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
    this.filesService.putFiles(formData,this.folder_id).pipe(delay(100)).subscribe((resp:any)=>{

    setTimeout(() => {
      // Notification.fnc('success','Information saved','success');
      // this.getFiles();
      Swal.close();
     this.modalService.dismissAll();

    }, 2000);

    //  await this.activatedRoute.params
    //     .subscribe( ({ code,id }) =>{

          this.loadDetails( 'adasdsad',this.folder_id );
        // });

      this.files=[]


    },(err)=>{
      // Notification.fnc('Error',err.error.error.message,'error');
    })
  }


  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'lg', centered: true });
  }



  view(data:any){
    this.filesService.getDownloadfile(data.id).subscribe((resp:any)=>{
      let bloburl = URL.createObjectURL(resp);
      window.open(bloburl);
    })
  }

  download(data:any){
    this.filesService.getDownloadfile(data.id).subscribe((resp:any)=>{
      let downloadURL = window.URL.createObjectURL(resp);
      saveAs(downloadURL,data.name_real);
    })
  }

  onSubmit(){
    
  }
}
