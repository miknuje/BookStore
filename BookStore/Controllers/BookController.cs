using Microsoft.AspNetCore.Mvc;
using Biblioteca.Infrastructure.Entities;
using Biblioteca.Persistence;

namespace Biblioteca.Controllers
{
    [Route("api/Book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        
        private readonly BookDbContext _context;
        /// <inheritdoc/>
        public BookController(BookDbContext context)
        {
            _context = context;
        }
        /// <summary>
        ///  Obter um evento
        /// </summary>
        /// <param name="isbn">Identificador do evento</param>
        /// <returns>Dados do evento</returns>
        /// <response code="200">Sucesso</response>
        /// <response code="404">Não encontrado</response>
        [HttpGet("/{isbn}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetById(string isbn)
        {
            try
            {
                var books = _context.Books.SingleOrDefault(l => l.isbn == isbn);
                if (books == null)
                {
                    return NotFound();
                }
                return Ok(books);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"An error occurred in GetById action method: {ex}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

    }
}
