﻿namespace BookStore.Infrastructure.DTOs
{
    public class BookDTO
    {
        public string isbn { get; set; }
        public string bookName { get; set; }
        public long authorid { get; set; }
        public decimal price { get; set; }
        public string author { get; set; }
        public bool isDeleted { get; set; }
    }
}