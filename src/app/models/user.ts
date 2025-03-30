import { Role } from "./role";
import { WriterStatus } from "./writer-status";

export class UserDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: any;
  writerStatus!: WriterStatus;
}
