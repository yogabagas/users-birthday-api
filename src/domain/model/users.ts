import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import EmailStatus from "./email";

@Entity()
export default class Users {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    name: "first_name",
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    name: "last_name",
  })
  lastName: string;

  @Column({
    type: "date",
    nullable: false,
    default: new Date(),
  })
  birthdate: Date;

  @Column({
    type: "text",
    nullable: false,
  })
  email: string;

  @Column({
    type: "text",
    nullable: false,
  })
  location: string;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
  })
  createdAt?: Date;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updatedAt?: Date;

  @OneToMany(() => EmailStatus, (emailStatus) => emailStatus.user)
  emailStatuses?: EmailStatus[];
}
