import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET?.trim(),
    });
  }

  async validate(payload: any) {
    // Payload structure matches what we set in auth.service (id, email, first_name)
    return { 
      id: payload.id, 
      email: payload.email, 
      first_name: payload.first_name 
    };
  }
}
