export interface IUserApplicationPort {
  getUsers(): {
    id: number;
    name: string;
    email: string;
  }[];
}
