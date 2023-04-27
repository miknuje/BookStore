namespace BookStore.Infrastructure.DTOs
{
    public class GetAuthorDTO
    {
        public long authorId { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
