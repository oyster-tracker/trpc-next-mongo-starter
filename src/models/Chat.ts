import {
  getModelForClass,
  prop,
  defaultClasses,
  pre,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';

@pre<Chat>('save', function () {
  if (this.messages?.length) {
    this.message_count = this.messages.length;
  }
})
export class Chat extends defaultClasses.TimeStamps {
  public _id?: mongoose.Types.ObjectId;

  public get id() {
    return this._id?.toHexString();
  }

  @prop({ default: 0 })
  public message_count?: number;

  @prop()
  messages?: string[];
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: {
    timestamps: true,
  },
});

export default ChatModel;
