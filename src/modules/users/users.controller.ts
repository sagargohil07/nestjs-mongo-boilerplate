import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Request } from 'express';
import { userValidator } from 'src/validations/user.validation';
import { validateInput } from 'src/helpers/validation-helper';
import { InputCreateUser, InputUpdateUser } from './dto/input';
import { OutputUser, OutputUserList } from './dto/output';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * POST /users
   */
  @Post()
  @Public()
  async create(@Body() body: InputCreateUser): Promise<OutputUser> {
    const validatedData = validateInput(userValidator.createUserValidation, body);
    return this.userService.create(validatedData);
  }

  /**
   * Get all users
   * GET /users
   */
  @Get()
  async findAll(): Promise<OutputUserList> {
    return this.userService.findAll();
  }

  /**
   * Get a single user by ID
   * GET /users/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OutputUser> {
    return this.userService.findOne(id);
  }

  /**
   * Update a user by ID
   * PATCH /users/:id
   * Users can only update themselves (based on JWT token)
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: InputUpdateUser,
    @Req() req: Request,
  ): Promise<OutputUser> {
    // Check if user is updating themselves
    if (req.user && req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const validatedData = validateInput(userValidator.updateUserValidation, body);
    return this.userService.update(id, validatedData);
  }

  /**
   * Delete a user by ID (soft delete)
   * DELETE /users/:id
   * Users can only delete themselves (based on JWT token)
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    // Check if user is deleting themselves
    if (req.user && req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    return this.userService.remove(id);
  }
}
