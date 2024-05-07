import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll({});
  }

  async softDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.softDelete(id);
  }

  async hardDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.hardDelete(id);
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const result = await this.userRepository.findOneByCondition({
      email: email,
    });
    return result ? true : false;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.update(id, { password });
    if (!user) {
      throw new InternalServerErrorException('Update password failed');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneByCondition({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneById(id);
  }

  async delete() {
    return this.userRepository.hardDelete('655ab2ba456d22a01c27972c');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async addBusiness(userId: string, businessId: string): Promise<User> {
    const update = {
      $addToSet: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);
    if (!user) {
      throw new InternalServerErrorException('Update business failed');
    }
    return user;
  }

  async removeBusiness(userId: string, businessId: string): Promise<User> {
    const update = {
      $pull: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);
    if (!user) {
      throw new InternalServerErrorException('Remove business failed');
    }
    return user;
  }
}
