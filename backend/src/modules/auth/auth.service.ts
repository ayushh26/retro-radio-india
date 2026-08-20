import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  async seedDefaultAdmin() {
    const adminUsername = 'admin';
    const existingAdmin = await this.userModel
      .findOne({ username: adminUsername })
      .exec();
    if (!existingAdmin) {
      console.log('Seeding default admin user...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      const newAdmin = new this.userModel({
        username: adminUsername,
        passwordHash,
      });
      await newAdmin.save();
      console.log(
        'Default admin user created successfully! Username: admin, Password: admin123',
      );
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; username: string }> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      username: user.username,
    };
  }
}
