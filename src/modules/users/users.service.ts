import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../models/users.model';
import * as bcrypt from 'bcryptjs';
import { handleServiceError } from 'src/helpers/error-handler';
import { InputCreateUser, InputUpdateUser } from './dto/input';
import { OutputUser, OutputUserList } from './dto/output';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async create(body: InputCreateUser): Promise<OutputUser> {
    console.log('\n--- ~ UserService ~ INSIDE ~ create::\n');
    try {
      const { email, password, first_name, last_name } = body;

      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') },
        is_deleted: false,
      }).exec();

      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      };

      const createdUser = await this.userModel.create(userData);

      return this.mapToOutputUser(createdUser);
    } catch (error) {
      console.log('\n--- ~ UserService ~ create ~ error::\n', error);
      handleServiceError(error);
    }
  }

  /**
   * Get all users (excluding deleted ones)
   */
  async findAll(): Promise<OutputUserList> {
    console.log('\n--- ~ UserService ~ INSIDE ~ findAll::\n');
    try {
      const users = await this.userModel
        .find({ is_deleted: false })
        .sort({ created_at: -1 })
        .exec();

      return {
        users: users.map((user) => this.mapToOutputUser(user)),
        total: users.length,
      };
    } catch (error) {
      console.log('\n--- ~ UserService ~ findAll ~ error::\n', error);
      handleServiceError(error);
    }
  }

  /**
   * Get a single user by ID
   */
  async findOne(id: string): Promise<OutputUser> {
    console.log('\n--- ~ UserService ~ INSIDE ~ findOne::\n');
    try {
      const user = await this.userModel
        .findOne({ id: id, is_deleted: false })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.mapToOutputUser(user);
    } catch (error) {
      console.log('\n--- ~ UserService ~ findOne ~ error::\n', error);
      handleServiceError(error);
    }
  }

  /**
   * Update a user by ID
   */
  async update(id: string, body: InputUpdateUser): Promise<OutputUser> {
    console.log('\n--- ~ UserService ~ INSIDE ~ update::\n');
    try {
      const { email, first_name, last_name } = body;

      // Check if user exists
      const user = await this.userModel
        .findOne({ id: id, is_deleted: false })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // If email is being updated, check if it's already taken
      if (email && email.toLowerCase() !== user.email.toLowerCase()) {
        const existingUser = await this.userModel.findOne({
          email: { $regex: new RegExp(`^${email}$`, 'i') },
          is_deleted: false,
          id: { $ne: id },
        }).exec();

        if (existingUser) {
          throw new BadRequestException('Email is already registered');
        }
      }

      // Update user
      const updateData: any = {};
      if (first_name !== undefined) updateData.first_name = first_name;
      if (last_name !== undefined) updateData.last_name = last_name;
      if (email !== undefined) updateData.email = email;

      const updatedUser = await this.userModel
        .findOneAndUpdate({ id: id }, updateData, { new: true })
        .exec();

      return this.mapToOutputUser(updatedUser);
    } catch (error) {
      console.log('\n--- ~ UserService ~ update ~ error::\n', error);
      handleServiceError(error);
    }
  }

  /**
   * Soft delete a user by ID
   */
  async remove(id: string): Promise<{ message: string }> {
    console.log('\n--- ~ UserService ~ INSIDE ~ remove::\n');
    try {
      const user = await this.userModel
        .findOne({ id: id, is_deleted: false })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Soft delete
      await this.userModel.findOneAndUpdate({ id: id }, { is_deleted: true }).exec();

      return { message: 'User deleted successfully' };
    } catch (error) {
      console.log('\n--- ~ UserService ~ remove ~ error::\n', error);
      handleServiceError(error);
    }
  }

  /**
   * Map UserModel to OutputUser
   */
  private mapToOutputUser(user: UserModel): OutputUser {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_deleted: user.is_deleted,
    };
  }
}
