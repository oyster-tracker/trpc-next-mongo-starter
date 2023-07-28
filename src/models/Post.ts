import { getModelForClass, prop } from '@typegoose/typegoose';

class Post {
  @prop({ required: true })
  public title!: string;

  @prop()
  public text?: string;
}

export const PostModel = getModelForClass(Post);
export default PostModel;
