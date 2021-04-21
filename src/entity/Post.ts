import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Model from "./Model";
import { User } from "./User";

@Entity("posts")
export class Post extends Model {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  user: User;

  
}
