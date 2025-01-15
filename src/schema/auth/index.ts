import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Login {
  @Prop()
  email: string;

  @Prop()
  password: number;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
