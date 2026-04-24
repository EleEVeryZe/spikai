import { getSsmSecret } from "@/application/utils/ssm";
import { Password } from "./password.model";
import { createHmac } from 'node:crypto';

export interface IUserDomain {
  id: number;
  email: string;
  username: string;
  hashedPassword: Password;
}

export class UserDomain implements IUserDomain {
  id: number;
  email: string;
  username: string;
  hashedPassword: Password;

  constructor(init?: Partial<IUserDomain>) {
    Object.assign(this, init);
  }

  async encodePayload() {
    const header = { alg: 'HS256', typ: 'JWT' };
    
    const payload = { 
      sub: this.id, 
      name: this.username, 
      iat: Math.floor(Date.now() / 1000) 
    };

    const toBase64Url = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');

    const encodedHeader = toBase64Url(header);
    const encodedPayload = toBase64Url(payload);
    const secret = await getSsmSecret("/spkai/dev/secret");
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const signature = createHmac('sha256', secret)
      .update(dataToSign)
      .digest('base64url');

    return `${dataToSign}.${signature}`;
  }
}