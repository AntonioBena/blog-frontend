import { UserDto } from "./user";

export class BlogComment {
  id!: number;
  content!: string;
  user!: UserDto;
}
