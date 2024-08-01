import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import {Book} from '../src/models/book';

const request = supertest(app)
// Connect to a separate test database
beforeAll(async () => {
  await mongoose.connect('mongodb+srv://user:1234@cluster0.hhbqifi.mongodb.net/BookendDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database after each test
afterEach(async () => {
  await Book.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Books API', () => {
  it('should create a new book', async () => {
    const newBook = {
      id: "1111111-111",
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: '2023-07-30T00:00:00.000Z',
      ISBN: '1234567890',
    };

    const response = await request.post('/api/books').send(newBook);


    expect(response.status).toBe(201);
    expect(response.body.data.book).toHaveProperty('id');
    expect(response.body.data.book.title).toBe(newBook.title);
    expect(response.body.data.book.author).toBe(newBook.author);
  });

  it('should get all books', async () => {
    const books = [
      { id: "111", title: 'Book 1', author: 'Author 1', publishedDate: new Date(), ISBN: '1234567890' },
      { id: "11122",title: 'Book 2', author: 'Author 2', publishedDate: new Date(), ISBN: '0987654321' },
    ];
    await Book.insertMany(books);

    const response = await request.get('/api/books');

    expect(response.status).toBe(201);
    expect(response.body.data.books.length).toBe(2);
    expect(response.body.data.books[0].title).toBe(books[0].title);
    expect(response.body.data.books[1].title).toBe(books[1].title);
  });

  it('should get a book by ID', async () => {
    const book = new Book({
      id:'1223333-33',
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: new Date(),
      ISBN: '1234567890',
    });
    await book.save();

    const response = await request.get(`/api/books/${book.id}`);

    console.log(response.body.data);
    
    expect(response.status).toBe(201);
    expect(response.body.data.book.title).toBe(book.title);
    expect(response.body.data.book.author).toBe(book.author);
  });

  it('should update a book', async () => {
    const book = new Book({
      id:'1223333-33',
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: new Date(),
      ISBN: '1234567890',
    });
    await book.save();

    const updatedBook = {
      id:'1223333-33',
      title: 'Updated Book',
      author: 'Updated Author',
      publishedDate: '2023-07-30T00:00:00.000Z',
      ISBN: '0987654321',
    };

    const response = await request.put(`/api/books/${book.id}`).send(updatedBook);

    expect(response.status).toBe(201);
    expect(response.body.data.book.title).toBe(updatedBook.title);
    expect(response.body.data.book.author).toBe(updatedBook.author);
  });

  it('should delete a book', async () => {
    const book = new Book({
      id:'1223333-33',
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: new Date(),
      ISBN: '1234567890',
    });
    await book.save();

    const response = await request.delete(`/api/books/${book.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book deleted successfully');
  });

  it('should handle book not found for update', async () => {
    const nonExistentId = '112222';
    const updatedBook = {
      id:'1223333-33',
      title: 'Updated Book',
      author: 'Updated Author',
      publishedDate: '2023-07-30T00:00:00.000Z',
      ISBN: '0987654321',
    };

    const response = await request.put(`/api/books/${nonExistentId}`).send(updatedBook);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Book not found');
  });

  it('should handle book not found for delete', async () => {
    const nonExistentId = '112222';

    const response = await request.delete(`/api/books/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Book not found');
  });
});
