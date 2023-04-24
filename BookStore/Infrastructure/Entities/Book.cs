namespace Biblioteca.Infrastructure.Entities
{
    public class Book
    {
        // Exemplo de isbn: 978-3-16-148410-0 - Tipo de dados: String?
        public string isbn { get; set; }
        public string bookName { get; set; }
        public string authorid { get; set; }
        public decimal price { get; set; }
        public string author { get; set; }
    }
}
