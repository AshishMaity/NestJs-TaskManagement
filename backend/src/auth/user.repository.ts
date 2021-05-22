import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  
  async signUp(authCredentials:AuthCredentialsDto): Promise<void>{

    const { username, password } = authCredentials;

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password,user.salt);

    try{
      await user.save();
    }catch(error){
      if(error.code == 23505){
        throw new ConflictException(`Username already exists`);
      }else{
        throw new InternalServerErrorException();
      }
    }
  }

  async validateCredentials(authCredentials:AuthCredentialsDto):Promise<string>{
    const {username, password} = authCredentials;
    const user = await this.findOne({username});
    if(user && await user.validatePassword(password)){
      return user.username
    }else{
      return null;
    }
  }

  private hashPassword(password:string,salt:string): Promise<string>{
    return bcrypt.hash(password,salt);
  }
}