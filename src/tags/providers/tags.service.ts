import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  public async findMultipleById(tags: number[]) {
    return await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
  }

  public async create(createTagDto: CreateTagDto) {
    const newTag = this.tagRepository.create(createTagDto);

    return await this.tagRepository.save(newTag);
  }

  public async remove(id: number) {
    return await this.tagRepository.delete(id);
  }
}
