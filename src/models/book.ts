import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
  id:string,
  title: string;
  author: string;
  publishedDate: string;
  ISBN: string;
  coverImageUrl?: string;
}

const bookSchema = new Schema<IBook>({
  id: {type:String, required: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: String, required: true },
  ISBN: { type: String, required: true, unique: true },
  coverImageUrl: { type: String }
});

const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
