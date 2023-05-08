using BookStore.Infrastructure.Entities;

namespace BookStore.Infrastructure.Entities
{
    public class Book
    {
        // Exemplo de isbn: 9783161484100 - Tipo de dados: String?
        public string isbn { get; set; }
        public string bookName { get; set; }
        public long authorid { get; set; }
        public decimal price { get; set; }
        public Author author { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
