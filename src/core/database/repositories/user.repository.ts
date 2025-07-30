import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}


  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async createAndSave(data: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async updateById(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async deleteById(id: number) {
    await this.repository.delete(id);
  }
} 