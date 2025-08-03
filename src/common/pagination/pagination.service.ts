import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './pagination.dto';
import { PaginationResponseDto } from './pagination-response.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<T>> {
    const { page = 1, step = 10 } = paginationDto;
    const skip = (page - 1) * step;

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(step)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      step,
    };
  }

  async paginateRepository<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    options: {
      order?: any;
      where?: any;
    } = {},
  ): Promise<PaginationResponseDto<T>> {
    const { page = 1, step = 10 } = paginationDto;
    const skip = (page - 1) * step;

    const [items, total] = await repository.findAndCount({
      skip,
      take: step,
      order: options.order,
      where: options.where,
    });

    return {
      items,
      total,
      page,
      step,
    };
  }
}
