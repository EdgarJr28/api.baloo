export class Usuario {

      public id: string;
      public nombre: string;
      public API_ID : string;
    
      constructor (id: string){
          this.id = id;
          this.API_ID = ""
          this.nombre = 'sin-nombre';
      }
  }