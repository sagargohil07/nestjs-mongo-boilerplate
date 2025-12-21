import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/models/users.model';
import * as bcrypt from 'bcryptjs';
import { handleServiceError } from 'src/helpers/error-handler';
import { InputRegister } from './dto/input';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {
  }

  async signIn(email: string, password: string): Promise<any> {
    console.log('\n--- ~ AuthService ~ INSIDE ~ signIn::\n');
    try {
      const user = await this.userModel.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      }).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { id: user.id, email: user.email, first_name: user.first_name };

      return {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log('\n--- ~ AuthService ~ signIn ~ error::\n', error);
      handleServiceError(error);
    }
  }

  async register(body: InputRegister): Promise<any> {
    console.log('\n--- ~ AuthService ~ INSIDE ~ register::\n');
    try {
      const { email, password, first_name, last_name } = body;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
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

      // Generate JWT token
      const payload = { 
        id: createdUser.id, 
        email: createdUser.email, 
        first_name: createdUser.first_name 
      };

      return {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
        },
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log('\n--- ~ AuthService ~ register ~ error::\n', error);
      handleServiceError(error);
    }
  }
}
