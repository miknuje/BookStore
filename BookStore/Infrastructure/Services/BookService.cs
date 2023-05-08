using AutoMapper;
using BookStore.Infrastructure.DTOs;
using BookStore.Persistence;
using Microsoft.EntityFrameworkCore;
using BookStore.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using BookStore.Infrastructure.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using static System.Reflection.Metadata.BlobBuilder;
using Microsoft.AspNetCore.Http.HttpResults;

namespace BookStore.Infrastructure.Services
{
    public class BookService
    {
        private readonly BookDbContext _dbContext;
        private readonly IMapper _mapper;

        public BookService(BookDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        

        public async Task<MessagingHelper<List<BookDTO>>> GetBook(string isbn)
        {
            var response = new MessagingHelper<List<BookDTO>>();
            var errorM = "Error: Book not found";
            var books = _dbContext.Books.Include(x => x.author).SingleOrDefault(b => b.isbn == isbn);
            if (books == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var bookDetailsDTO = _mapper.Map<BookDTO>(books);
            
            response.Obj = new List<BookDTO> { bookDetailsDTO };
            response.Success = true;
            return response;
        }
        
        public async Task<MessagingHelper<List<BookDTO>>> GetAllBook()
        {
            var response = new MessagingHelper<List<BookDTO>>();
            var cbooks = await _dbContext.Books.Include(b => b.author).Where(b => !b.IsDeleted).ToListAsync();

            if (cbooks == null || cbooks.Count == 0)
            {
                response.Success = false;
                response.Message = "Error: Book not found";
                return response;
            }
            var bookdto = _mapper.Map<List<BookDTO>>(cbooks);
            response.Success = true;
            response.Obj = bookdto;
            return response;
        }
        public async Task<MessagingHelper<List<BookDTO>>> GetAllAllBook()
        {
            var response = new MessagingHelper<List<BookDTO>>();
            var cbooks = await _dbContext.Books.Include(b => b.author).ToListAsync();

            if (cbooks == null || cbooks.Count == 0)
            {
                response.Success = false;
                response.Message = "Error: Book not found";
                return response;
            }
            var bookdto = _mapper.Map<List<BookDTO>>(cbooks);
            response.Success = true;
            response.Obj = bookdto;
            return response;
        }
        public async Task<MessagingHelper<List<AddBookDTO>>> AddBook(AddBookDTO Bookobj)
        {
            var response = new MessagingHelper<List<AddBookDTO>>();
            string errorM = "Error: occurred while adding data";
            string authorNotExists = "Error: author Not Exists";
            string isbnAlreadyExistsMessage = "Error: isbn Already Exists";
            // verifica se o isbn ou o preço é inválido ou se os campos estão nulos
            if (Bookobj.isbn.Length != 13 || Bookobj.price < 0 || Bookobj == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            // verifica se o isbn já existe
            var checkBook =_dbContext.Books.Find(Bookobj.isbn);
            if (checkBook != null && checkBook.isbn == Bookobj.isbn)
            {
                response.Success = false;
                response.Message = isbnAlreadyExistsMessage;
                return response;
            }
            var checkauthor = _dbContext.Authors.Find(Bookobj.authorid);
            if (checkauthor == null)
            {
                response.Success = false;
                response.Message = authorNotExists;
                return response;
            }
            var book = _mapper.Map<Book>(Bookobj);
            _dbContext.Books.Add(book);
            await _dbContext.SaveChangesAsync();

            response.Obj = new List<AddBookDTO> { Bookobj };
            response.Success = true;
            response.Message = "Success: Book Created";
            return response;
        }
        public async Task<MessagingHelper<List<UPBookDTO>>> BookUpdate(string isbn, [FromBody] UPBookDTO BookUpdate)
        {
            var response = new MessagingHelper<List<UPBookDTO>>();
            string errorM = "Error: occurred while updating data";
            string BookNotFound = "Error: Book Not Found";
            string UpMessage = "Success: Update Book";
            if (isbn != BookUpdate.isbn || BookUpdate.isbn.Length != 13 || BookUpdate.price < 0 ||BookUpdate == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var Book = await _dbContext.Books.FindAsync(isbn);
            if (Book == null) 
            {
                response.Success = false;
                response.Message = BookNotFound;
                return response;
            }
            Book.bookName = BookUpdate.bookName;
            Book.authorid = BookUpdate.authorid;
            Book.price = BookUpdate.price;
            Book.IsDeleted = BookUpdate.isDeleted;

            _dbContext.Entry(Book).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            var UpBookDTO = _mapper.Map<UPBookDTO>(Book);

            response.Obj = new List<UPBookDTO> { UpBookDTO };
            response.Success = true;
            response.Message = UpMessage;
            return response;
        }
        public async Task<MessagingHelper<List<UPBookDTO>>> DeleteBook(string isbn)
        {
            var response = new MessagingHelper<List<UPBookDTO>>();
            string isbnNotFoundMessage = "Error: isbn not Found";
            var book = _dbContext.Books.FirstOrDefault(b => b.isbn == isbn);

            if (book == null)
            {
                response.Success = false;
                response.Message = isbnNotFoundMessage;
                return response;
            }

            book.IsDeleted = true;
            _dbContext.SaveChanges();

            var addBookDTO = _mapper.Map<UPBookDTO>(book);
            response.Obj = new List<UPBookDTO> { addBookDTO };
            response.Success = true;
            response.Message = "Success: Book Deleted";
            return response;
        }


    }
}




