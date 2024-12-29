import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/createPostMetaOptions.dto';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}
  public async create(
    createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ): Promise<MetaOption> {
    const newMetaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    return await this.metaOptionsRepository.save(newMetaOption);
  }
}
