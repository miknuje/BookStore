using AutoMapper;
using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Entities;
using BookStore.Infrastructure.Helpers;
using BookStore.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAllAuthors()
        {
            var response = new MessagingHelper<List<GetAuthorDTO>>();
            var cAuthor = await _dbContext.Authors.Where(b => !b.IsDeleted).ToListAsync();

            if (cAuthor == null || cAuthor.Count == 0)
            {
                response.Success = false;
                response.Message = "Error: Author not found";
                return response;
            }
            var Authordto = _mapper.Map<List<GetAuthorDTO>>(cAuthor);
            response.Success = true;
            response.Obj = Authordto;
            return response;
        }
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAllAllAuthors()
        {
            var response = new MessagingHelper<List<GetAuthorDTO>>();
            var cAuthor = await _dbContext.Authors.ToListAsync();

            if (cAuthor == null || cAuthor.Count == 0)
            {
                response.Success = false;
                response.Message = "Error: Author not found";
                return response;
            }
            var Authordto = _mapper.Map<List<GetAuthorDTO>>(cAuthor);
            response.Success = true;
            response.Obj = Authordto;
            return response;
        }
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAuthor(long authorId)
        {
            var response = new MessagingHelper<List<GetAuthorDTO>>();
            var errorM = "Error: Author not found";
            var Author = _dbContext.Authors.SingleOrDefault(b => b.authorId == authorId);
            if (Author == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var bookDetailsDTO = _mapper.Map<GetAuthorDTO>(Author);

            response.Obj = new List<GetAuthorDTO> { bookDetailsDTO };
            response.Success = true;
            return response;
        }
        public async Task<MessagingHelper<List<GetAuthorDTO>>> AuthorUpdate(long authorId, [FromBody] GetAuthorDTO AuthorUpdate)
        {
            var response = new MessagingHelper<List<GetAuthorDTO>>();
            string errorM = "Error: occurred while updating data";
            string AuthorNotFound = "Error: Author Not Found";
            string UpMessage = "Success: Update Author";
            if (AuthorUpdate.authorId == null|| authorId != AuthorUpdate.authorId ||AuthorUpdate == null)
            {
                response.Success = false;
                response.Message = errorM;
                return response;
            }
            var Author = await _dbContext.Authors.FindAsync(authorId);
            if (Author == null)
            {
                response.Success = false;
                response.Message = AuthorNotFound;
                return response;
            }
            Author.authorId = AuthorUpdate.authorId;
            Author.Name = AuthorUpdate.Name;
            Author.IsDeleted = AuthorUpdate.IsDeleted;

            _dbContext.Entry(Author).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            var UpBookDTO = _mapper.Map<GetAuthorDTO>(Author);

            response.Obj = new List<GetAuthorDTO> { UpBookDTO };
            response.Success = true;
            response.Message = UpMessage;
            return response;
        }
        public async Task<MessagingHelper<List<AuthorDTO>>> DeleteAuthor(long authorId)
        {
            var response = new MessagingHelper<List<AuthorDTO>>();
            string idNotFoundMessage = "Error: author id not Found";
            var author = _dbContext.Authors.FirstOrDefault(b => b.authorId ==  authorId);

            if (author == null)
            {
                response.Success = false;
                response.Message = idNotFoundMessage;
                return response;
            }

            author.IsDeleted = true;
            _dbContext.SaveChanges();

            var addAuthorDTO = _mapper.Map<AuthorDTO>(author);
            response.Obj = new List<AuthorDTO> { addAuthorDTO };
            response.Success = true;
            response.Message = "Success: Author Deleted";
            return response;
        }
    }
}
