import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() email: string;
  @Prop() password: number;
  @Prop() roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
