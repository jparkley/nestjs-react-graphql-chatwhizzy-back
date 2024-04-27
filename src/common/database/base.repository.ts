import { Logger, NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery).lean<T>();
    if (!document) {
      this.logger.warn('Document not found with the filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    const documents = this.model.find(filterQuery).lean<T[]>();
    return documents;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, updateQuery, {
        new: true, // return updated document
      })
      .lean<T>();
    if (!document) {
      this.logger.warn(
        'Document not found with the filterQuery for update',
        filterQuery,
      );
      throw new NotFoundException('Document not found for update');
    }

    return document;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.findOneAndDelete(filterQuery).lean<T>();
  }
}
