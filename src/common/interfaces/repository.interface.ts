import { FindOptionsWhere, FindManyOptions, DeepPartial } from 'typeorm';

export interface IBaseRepository<T> {
  findOne(where: FindOptionsWhere<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  save(entity: T): Promise<T>;
}

export interface IPostRepository extends IBaseRepository<Post> {
  findWithPagination(
    page: number,
    step: number,
    order?: Record<string, 'ASC' | 'DESC'>,
  ): Promise<[Post[], number]>;
  findByTitle(title: string): Promise<Post[]>;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
