import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Theme extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  icon: string;

  @Prop()
  backgroundImage: string;

  @Prop()
  accentColor: string;

  @Prop()
  characterImage: string;

  @Prop([String])
  quotes: string[];

  @Prop()
  ambientSound: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);
ThemeSchema.index({ slug: 1 }, { unique: true });
ThemeSchema.index({ isActive: 1 });
