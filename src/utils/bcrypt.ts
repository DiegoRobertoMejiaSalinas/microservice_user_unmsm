import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
    return hash;
  }

  async isMatchingPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
