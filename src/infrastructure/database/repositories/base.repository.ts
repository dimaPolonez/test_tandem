import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { IBaseRepository } from '../../../common/interfaces/repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async create(data: any): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity as T);
  }

  async update(id: string, data: any): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }
}
