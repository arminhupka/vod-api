import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';

import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { MailService } from '../mail/mail.service';
import { OrdersService } from '../orders/orders.service';
import { User } from '../schemas/user.schema';
import { hashPassword } from '../utils/bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userPaginatedModel: PaginateModel<User>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => OrdersService))
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: RegisterUserDto): Promise<OkResponseDto> {
    const userExist = await this.userModel.findOne({
      email: dto.email,
    });

    if (userExist) {
      throw new ConflictException('User with this email already exist');
    }

    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Passwords are not equal');
    }

    const activationToken = crypto.randomBytes(32).toString('hex');

    const user = new this.userModel({
      email: dto.email,
      password: await hashPassword(dto.password),
      activationToken,
      billing: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    await user.save();
    this.logger.log(`create: CREATED NEW USER ${user.email} (${user._id})`);

    await this.mailService.userRegistrationConfirm(
      user.email,
      user.billing.firstName,
      user.activationToken,
    );

    return {
      ok: true,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('courses.course')
      .populate('courses.watchedLessons');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        email: { $regex: email },
      })
      .populate('courses.course')
      .populate('courses.watchedLessons');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async activateAccount(token: string): Promise<{ ok: true }> {
    const userWithToken = await this.userModel.findOne({
      activationToken: token,
    });

    if (!userWithToken) {
      throw new NotFoundException('Unknown token ');
    }

    userWithToken.activationToken = null;
    userWithToken.activated = true;

    await userWithToken.save();

    this.logger.log(
      `activateAccount: USER ${userWithToken.email} (${userWithToken._id}) ACTIVATED ACCOUNT`,
    );

    return {
      ok: true,
    };
  }

  async resetPasswordRequest(
    dto: ResetPasswordRequestDto,
  ): Promise<{ ok: true }> {
    const userWithEmail = await this.userModel.findOne({
      email: dto.email,
    });

    if (userWithEmail) {
      userWithEmail.resetPasswordToken = crypto.randomBytes(32).toString('hex');
      await userWithEmail.save();
      await this.mailService.userResetPassword(
        userWithEmail.email,
        userWithEmail.billing.firstName,
        userWithEmail.resetPasswordToken,
      );
    }

    this.logger.log(
      `resetPasswordRequest: USER ${userWithEmail.email} (${userWithEmail._id}) REQUESTED PASSWORD RESET TOKEN`,
    );

    return {
      ok: true,
    };
  }

  async resetPasswordWithToken(
    token: string,
    dto: ResetPasswordDto,
  ): Promise<{ ok: true }> {
    const userWithToken = await this.userModel.findOne({
      resetPasswordToken: token,
    });

    if (!userWithToken) {
      throw new NotFoundException('Unknown token');
    }

    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Passwords are not equal');
    }

    userWithToken.password = await hashPassword(dto.password);
    userWithToken.resetPasswordToken = null;
    await userWithToken.save();

    this.logger.log(
      `resetPasswordWithToken: USER ${userWithToken.email} (${userWithToken._id}) SET UP NEW`,
    );

    return {
      ok: true,
    };
  }

  async updateUser(user: User, dto: UpdateUserDto): Promise<User> {
    const foundedUser = await this.findOne(user._id);

    if (
      dto.password &&
      dto.passwordConfirm &&
      dto.password !== dto.passwordConfirm
    ) {
      throw new BadRequestException('Passwords must be equal');
    }

    foundedUser.billing.firstName =
      dto.firstName || foundedUser.billing.firstName;
    foundedUser.billing.lastName = dto.lastName || foundedUser.billing.lastName;
    foundedUser.billing.companyName = dto.companyName;
    foundedUser.billing.vatNumber = dto.vatNumber;
    foundedUser.billing.companyStreet = dto.companyStreet;
    foundedUser.billing.companyPostCode = dto.companyPostCode;
    foundedUser.billing.companyCity = dto.companyCity;
    foundedUser.billing.companyCountry = dto.companyCountry;
    foundedUser.billing.street = dto.street || foundedUser.billing.street;
    foundedUser.billing.country = dto.country || foundedUser.billing.country;
    foundedUser.billing.city = dto.city || foundedUser.billing.city;
    foundedUser.billing.postCode = dto.postCode || foundedUser.billing.postCode;
    foundedUser.email = dto.email || foundedUser.email;
    foundedUser.password = dto.password
      ? await hashPassword(dto.password)
      : foundedUser.password;

    this.logger.log(
      `updateUser: USER ${foundedUser.email} (${foundedUser._id}) UPDATED DETAILS`,
    );

    return foundedUser.save();
  }

  async findAll(options: PaginateOptions, keyword?: string) {
    let q: FilterQuery<User> = {};

    if (keyword) {
      q = {
        $or: [
          { 'billing.firstName': { $regex: keyword, $options: 'i' } },
          { 'billing.lastName': { $regex: keyword, $options: 'i' } },
          { 'billing.companyName': { $regex: keyword, $options: 'i' } },
          { 'billing.vatNumber': { $regex: keyword, $options: 'i' } },
        ],
      };
    }

    return this.userPaginatedModel.paginate(q, {
      ...options,
      sort: {
        createdAt: 1,
      },
    });
  }
}
