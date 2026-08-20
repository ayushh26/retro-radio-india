import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Song extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop()
  movie: string;

  @Prop()
  year: number;

  @Prop()
  language: string;

  @Prop({ required: true })
  youtubeVideoId: string;

  @Prop()
  thumbnail: string;

  @Prop()
  duration: number;

  @Prop({ type: [String], index: true })
  themes: string[]; // Store theme slugs

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  playCount: number;
}

export const SongSchema = SchemaFactory.createForClass(Song);
SongSchema.index({ youtubeVideoId: 1 });
SongSchema.index({ artist: 1 });
SongSchema.index({ themes: 1 });
SongSchema.index({ isActive: 1 });
SongSchema.index({ year: 1 });
