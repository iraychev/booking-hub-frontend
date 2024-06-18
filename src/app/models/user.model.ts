import { Image } from './image.model';

export class User {
  id: string = '';
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  profileImage: Image | null = null;
  roles: string[] = [];
}
