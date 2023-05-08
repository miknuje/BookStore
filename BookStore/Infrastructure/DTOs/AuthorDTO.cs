namespace BookStore.Infrastructure.DTOs
{
    public class AuthorDTO
    {
        internal long authorId;

        public string Name { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
