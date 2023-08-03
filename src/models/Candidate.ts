import { getModelForClass, prop, defaultClasses } from '@typegoose/typegoose';
import mongoose from 'mongoose';
// import {
//   IObjectWithTypegooseFunction,
//   BeAnObject,
// } from '@typegoose/typegoose/lib/types';
// import { Document, Types } from 'mongoose';
import { Chat } from './Chat';

export class Candidate extends defaultClasses.TimeStamps {
  public _id?: mongoose.Types.ObjectId;

  public get id() {
    return this._id?.toHexString();
  }

  @prop({ required: true })
  public name!: string;

  @prop()
  public party?: string;

  @prop()
  campaign?: string[];

  @prop()
  chats?: Chat[];
}
/**
 * How the class is used by tRPC
 * @see {CandidateModel} for the frontend type
 * type PostByIdOutput = RouterOutput['post']['byId'];
// equivalent to the following:
type ObjectId = { _id: Types.ObjectId };
type PostByIdOutput = Document<unknown, BeAnObject, Post> &
  Omit<Post, 'typegooseName'> &
  IObjectWithTypegooseFunction;
 */

export const CandidateModel = getModelForClass(Candidate, {
  schemaOptions: {
    timestamps: true,
  },
});

export default CandidateModel;
