import { getModelForClass, prop, defaultClasses } from '@typegoose/typegoose';
import mongoose from 'mongoose';
// import {
//   IObjectWithTypegooseFunction,
//   BeAnObject,
// } from '@typegoose/typegoose/lib/types';
// import { Document, Types } from 'mongoose';

export class Post extends defaultClasses.TimeStamps {
  public _id?: mongoose.Types.ObjectId;

  public get id() {
    return this._id?.toHexString();
  }

  @prop({ required: true })
  public title!: string;

  @prop()
  public text?: string;
}
/**
 * How the class is used by tRPC
 * @see {PostItem} for the frontend type
 * type PostByIdOutput = RouterOutput['post']['byId'];
// equivalent to the following:
type ObjectId = { _id: Types.ObjectId };
type PostByIdOutput = Document<unknown, BeAnObject, Post> &
  Omit<Post, 'typegooseName'> &
  IObjectWithTypegooseFunction;
 */

export const PostModel = getModelForClass(Post, {
  schemaOptions: {
    timestamps: true,
  },
});

export default PostModel;
