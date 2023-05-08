using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Entities;

namespace BookStore.Infrastructure.DTOs
{
    public class UPBookDTO
    {
        public string isbn { get; set; }
        public string bookName { get; set; }
        public long authorid { get; set; }
        public decimal price { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
