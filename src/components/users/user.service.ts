import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UserRepository } from '@repositories';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from '@dtos';
import { ERROR_MESSAGES } from '@constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}


  async findOne(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      return user as unknown as UserResponseDto;
    } catch (error) {
      this.logger.error(`findOne error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.createAndSave({
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
      });
      return user as unknown as UserResponseDto;
    } catch (error) {
      this.logger.error(`create error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.updateById(id, dto);
      if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      return user as unknown as UserResponseDto;
    } catch (error) {
      this.logger.error(`update error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      await this.userRepository.deleteById(id);
    } catch (error) {
      this.logger.error(`remove error: ${error.message}`, error.stack);
      throw error;
    }
  }
} 