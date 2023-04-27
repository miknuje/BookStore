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
        [HttpGet("/{isbn}")]
        public async Task<MessagingHelper<List<GetAuthorDTO>>> GetAuthor(long authorId)
        {
            return await _service.GetAuthor(authorId);
        }
        [HttpGet("GetAuthor")]
        public async Task<MessagingHelper<List<AuthorDTO>>> GetAllAuthors()
        {
            return await _service.GetAllAuthors();
        }

        [HttpPost("AddAuthor")]
        public async Task<MessagingHelper<List<AddAuthorDTO>>> AddAuthor(AddAuthorDTO Authorobj)
        {
            return await _service.AddAuthor(Authorobj);
        }
    }
}
