declare namespace Express {
  export interface Request {
    user?: { id: string; email: string; first_name: string }; // Extend with the `user` property structure
  }
}
