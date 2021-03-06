import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
    private jwtService:JwtService
  ){}

  signUp(authCredentialsDto:AuthCredentialsDto): Promise<void>{
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto:AuthCredentialsDto): Promise<{accessToken: string}>{
    const username = await this.userRepository.validateCredentials(authCredentialsDto);
    this.logger.log('SignIn username:',username);
    if(!username) throw new UnauthorizedException('Invalid Credentials');
    const payload: JwtPayload = {username};
    const accessToken =  await this.jwtService.sign(payload);

    return {accessToken};
  }

}
