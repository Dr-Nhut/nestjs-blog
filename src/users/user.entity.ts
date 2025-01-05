import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 96 })
  firstName: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 96 })
  email: string;

  @Column({ type: 'varchar', length: 16 })
  password: string;

  @OneToMany(() => Post, (post) => post.author, {
    cascade: true,
  })
  posts: Post[];
}
