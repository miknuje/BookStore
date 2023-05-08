using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Helpers;
using BookStore.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/Author")]
    [ApiController]
    public class AuthorController : Controller
    {
        private readonly AuthorService _service;
        /// <inheritdoc/>
        public AuthorController(AuthorService service)
        {
            _service = service;
        }
        [HttpGet("api/{authorId}")]
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAuthor(long authorId)
        {
            return await _service.GetAuthor(authorId);
        }
        [HttpGet("GetAuthor")]
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAllAuthors()
        {
            return await _service.GetAllAuthors();
        }
        [HttpGet("GetAllAuthor")]
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAllAllAuthors()
        {
            return await _service.GetAllAllAuthors();
        }

        [HttpPost("AddAuthor")]
        public async Task<MessagingHelper<List<AddAuthorDTO>>> AddAuthor(AddAuthorDTO Authorobj)
        {
            return await _service.AddAuthor(Authorobj);
        }
        [HttpPut("PutAuthor")]
        public async Task<MessagingHelper<List<GetAuthorDTO>>> AuthorUpdate(long authorId, [FromBody] GetAuthorDTO AuthorUpdate)
        {
            return await _service.AuthorUpdate(authorId, AuthorUpdate);
        }
        [HttpDelete("DeleteAuthor")]
        public async Task<MessagingHelper<List<AuthorDTO>>> DeleteAuthor(long authorId)
        {
            return await _service.DeleteAuthor(authorId);
        }
    }
}
