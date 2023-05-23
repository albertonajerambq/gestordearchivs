export class Usuario {

  constructor(
    public name:string,
    public email:string,
    public status?:string,
    public user_type?: 'ADMIN_ROLE' | 'USER_ROLE',
    public user_id?:string,
    public createdAt?:string,
    public updatedAt?:string,
    public password?:string,
    public avatar?:string,
    public uid?: string,


  ) {}


}

