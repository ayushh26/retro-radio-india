import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Analytics extends Document {
  @Prop({ required: true, index: true })
  event: string; // PLAY, PAUSE, SKIP, COMPLETE, THEME_CHANGE, SESSION_START

  @Prop({ type: String, index: true })
  songId: string;

  @Prop({ type: String, index: true })
  themeId: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: any;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
AnalyticsSchema.index({ event: 1, timestamp: -1 });
