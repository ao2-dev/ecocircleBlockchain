declare namespace Express {
    export interface Request {
      uuid:string;
      owner:string;
      pk:string;
    }
  }