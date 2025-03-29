import { Role } from "./role";
import { WriterStatus } from "./writer-status";

export class User {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: Role;
  writerStatus!: WriterStatus;
}
