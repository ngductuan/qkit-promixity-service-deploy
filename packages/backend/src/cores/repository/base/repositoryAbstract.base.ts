import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { BaseRepositoryInterface } from './repositoryInterface.base';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { transObjectIdToString } from 'src/common/utils';
import * as dayjs from 'dayjs';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }
  async softDelete(id: string): Promise<boolean> {
    return !!(await this.model
      .findByIdAndUpdate<T>(id, { deleted_at: dayjs() })
      .exec());
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.toObject() as T;
  }

  async findOneById(id: string): Promise<T> {
    const result = (await this.model.findById(id).lean().exec()) as T;
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
    return result.deletedAt ? null : result;
  }

  async findOneByCondition(condition = {}): Promise<T | null> {
    const result = (await this.model
      .findOne({
        ...condition,
        deleted_at: null,
      })
      .lean()
      .exec()) as T;
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
    return result;
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const items = (await this.model
      .find({ ...condition, deleted_at: null }, options?.projection, options)
      .lean()
      .exec()) as T[];

    if (items.length) {
      items.forEach(
        (Element) => (Element.id = transObjectIdToString(Element._id)),
      );
    }
    return {
      count: items.length,
      items,
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    const result = await this.model.findOneAndUpdate(
      { _id: id, deleted_at: null } as FilterQuery<T>,
      dto,
      {
        new: true,
      },
    );
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
    return result as T;
  }

  async hardDelete(id: string): Promise<boolean> {
    return !!(await this.model.findByIdAndDelete(id));
  }
}
