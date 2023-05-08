using BookStore.Infrastructure.Entities;

namespace BookStore.Infrastructure.Entities
{
    public class Author
    {
        public long authorId { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<Book> books { get; set; }
    }
}
