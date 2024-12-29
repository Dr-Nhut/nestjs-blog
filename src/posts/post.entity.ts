import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType } from './enums/postType.enum';
import { status } from './enums/status.enum';
import { CreatePostMetaOptionsDto } from '../meta-options/dtos/createPostMetaOptions.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: postType, default: postType.POST })
  postType: postType;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'enum', enum: status, default: status.DRAFT })
  status: status;

  @Column({ type: 'varchar', nullable: true })
  content?: string;

  @Column({ type: 'json', nullable: true })
  schema?: string;

  @Column({ type: 'varchar', nullable: true })
  featuredImageUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishingOn?: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToOne(
    () => MetaOption,
    (metaOption) => metaOption.post, //create a bi-directional relationship
    {
      cascade: true,
    },
  )
  metaOption?: MetaOption;
}
