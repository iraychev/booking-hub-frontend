import { Image } from "./image";

export class User {
  id: string = '';
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  profileImage: Image | null = null;;
  roles: string[] = [];
}
