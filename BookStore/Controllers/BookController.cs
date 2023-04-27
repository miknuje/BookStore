using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using BookStore.Infrastructure.Entities;
using BookStore.Persistence;
using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Helpers;
using BookStore.Infrastructure.Services;

namespace BookStore.Controllers
{
    [Route("api/Book")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly BookService _service;
        /// <inheritdoc/>
        public BookController(BookService service)
        {
            _service = service;
        }

        [HttpGet("/{isbn}")]
        
        public async Task<MessagingHelper<List<BookDTO>>> GetBookByISBN(string isbn)
        {
            return await _service.GetBook(isbn);
        }
        [HttpGet("GetBook")]
        public async Task<MessagingHelper<List<BookDTO>>> GetAllBook()
        {
            return await _service.GetAllBook();
        }
        [HttpPost("PostBook")]
        public async Task<MessagingHelper<List<AddBookDTO>>> AddBook(AddBookDTO Bookobj)
        {
            return await _service.AddBook(Bookobj);
        }
        [HttpPut("PutBook")]
        public async Task<MessagingHelper<List<UPBookDTO>>> BookUpdate(string isbn, [FromBody] UPBookDTO BookUpdate)
        {
            return await _service.BookUpdate(isbn, BookUpdate);
        }
        [HttpDelete("DeleteBook")]
        public async Task<MessagingHelper<List<UPBookDTO>>> DeleteBook(string isbn)
        {
            return await _service.DeleteBook(isbn);
        }
    }
    }
