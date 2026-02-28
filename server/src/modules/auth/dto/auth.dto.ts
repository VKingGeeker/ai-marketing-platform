import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: '用户名至少3个字符' })
  username: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  password: string;

  @IsString()
  @IsOptional()
  nickname?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
