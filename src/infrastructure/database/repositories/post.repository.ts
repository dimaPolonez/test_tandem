import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { IPostRepository } from '../../../common/interfaces/repository.interface';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository
  extends BaseRepository<Post>
  implements IPostRepository
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }

  async findWithPagination(
    page: number,
    step: number,
    order: Record<string, 'ASC' | 'DESC'> = { createdAt: 'DESC' },
  ): Promise<[Post[], number]> {
    const skip = (page - 1) * step;

    return this.repository.findAndCount({
      skip,
      take: step,
      order,
    });
  }

  async findByTitle(title: string): Promise<Post[]> {
    return this.repository.find({
      where: { title },
    });
  }
}
