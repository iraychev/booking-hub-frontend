export class User {
  id: string = '';
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  roles: string[] = [];
  [key: string]: string | string[];
}
