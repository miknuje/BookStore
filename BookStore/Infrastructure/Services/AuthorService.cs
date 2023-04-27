using AutoMapper;
using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Entities;
using BookStore.Infrastructure.Helpers;
using BookStore.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Services
{
    public class AuthorService
    {
        // O nome está BookDbCOntext porque o nome da base de dados ficou Book.
        private readonly BookDbContext _dbContext;
        private readonly IMapper _mapper;

        public AuthorService(BookDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<MessagingHelper<List<AddAuthorDTO>>> AddAuthor(AddAuthorDTO Authorobj)
        {
            var response = new MessagingHelper<List<AddAuthorDTO>>();
            string errorM = "Error: occurred while adding data";
            string AuthorCreated = "Success: Author Created";
            
            if (Authorobj == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var Author = _mapper.Map<Author>(Authorobj);

            _dbContext.Authors.Add(Author);
            await _dbContext.SaveChangesAsync();

            response.Obj = new List<AddAuthorDTO> { Authorobj };
            response.Success = true;
            response.Message = AuthorCreated;
            return response;
        }
        public async Task<MessagingHelper<List<AuthorDTO>>> GetAllAuthors()
        {
            var response = new MessagingHelper<List<AuthorDTO>>();
            var cAuthor = await _dbContext.Authors.Where(b => !b.IsDeleted).ToListAsync();

            if (cAuthor == null || cAuthor.Count == 0)
            {
                response.Success = false;
                response.Message = "Error: Author not found";
                return response;
            }
            var Authordto = _mapper.Map<List<AuthorDTO>>(cAuthor);
            response.Success = true;
            response.Obj = Authordto;
            return response;
        }
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAuthor(bool authorId)
        {
            var response = new MessagingHelper<List<GetAuthorDTO>>();
            var errorM = "Error: Book not found";
            var books = _dbContext.Books.Include(x => x.author).SingleOrDefault(b => b.authorid == authorId);
            if (books == null || books.IsDeleted == true)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var bookDetailsDTO = _mapper.Map<GetAuthorDTO>(books);

            response.Obj = new List<GetAuthorDTO> { bookDetailsDTO };
            response.Success = true;
            return response;
        }
    }
}
