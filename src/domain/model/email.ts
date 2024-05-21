import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Users from "./users";

@Entity()
export default class EmailStatus {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ManyToOne(() => Users, (user) => user.emailStatuses)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: Users;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    name: "name",
  })
  name: string;

  @Column({
    type: "boolean",
    name: "is_delivered",
    default: false,
  })
  isDelivered: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null,
    name: "delivered_at",
  })
  deliveredAt?: Date;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
  })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updatedAt!: Date;
}
