import { Request, Response } from 'express';
import { Book, IBook } from '../models/book';
import { sendImage } from '../middleware/sendImage';

// Create a new book
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, ISBN,publishedDate } = req.body;


    if (!title || !author || !ISBN || !publishedDate) {
      res.status(422).json({ 
        status: "Bad Request",
        message: "All fields are required"
     });
    }

    const id = generateCustomId();
    const book = new Book({
      id,
      title,
      author,
      publishedDate,
      ISBN
    });



    await book.save();

    res.status(201).json({
        status: "success",
        message: "Book Created Successfully ",
        data: {
            book: book
        }
    });
  } catch (error: any) {
    console.log(error);
    
    res.status(400).json({ 
        status: "Bad Request",
        message: error.message
     });
  }
};

// Update book cover picture
export const updateBookCover = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;

    if(!req.file){
      return res.status(404).json({ 
        status: "Bad Request",
        message: 'No image file provided'
       });
    }

    
    



    const coverImagePath = req.file?.path;
    const coverImageUrl = await sendImage(req.file)


    const book = await Book.findOneAndUpdate(
      {id:bookId},
      { coverImageUrl },
      { new: true }
    ).exec();

    if (!book) {
      return res.status(404).json({ 
        status: "Bad Request",
        message: 'Book not found'
       });
    }

  

    res.status(201).json({
        status: "success",
        message:"Update Successful",
        data: {
            book: book
        }
    });
  } catch (error:any) {
    console.log(error);
    
    res.status(400).json({ 
        status: "Bad Request",
        message: error.message
     });
  }
};

// Get all books using pagination
export const getAllBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();

    res.status(201).json({
      status: "success",
      message: "Books Retrieved",
      data: {
       books: books,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: page,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "Bad Response",
      message: error.message,
    });
  }
};

// Get a single book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findOne({id:req.params.id}).exec();

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(201).json({
        status: "success",
        message: "Book Retrieved",
        data:{
          book:book
        }
    });
  } catch (error:any) {
    res.status(500).json({ 
        status: "Bad Response",
        message: error.message
     });
  }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await Book.findOneAndUpdate({id:bookId}, req.body, { new: true }).exec();

    if (!updatedBook) {
      return res.status(404).json({ 
        status: "Bad Request",
        message: 'Book not found'
     });
    }

    res.status(201).json({
        status: "success",
        message: "Book Updated Successfully",
        data: {
          book: updatedBook
        }
    });
  } catch (error:any) {
    res.status(400).json({ 
        status: "Bad Request",
        message: error.message
     });
  }
};

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findOneAndDelete({id:bookId}).exec();

    if (!deletedBook) {
      return res.status(404).json({ 
        status: "Bad Request",
        message: 'Book not found'
     });
    }

    res.status(200).json({ 
        status: "success",
        message: 'Book deleted successfully'
     });
  } catch (error:any) {
    res.status(500).json({ 
        status: "Bad Request",
        message: error.message
     });
  }
};


function generateCustomId() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomPart}`;
}