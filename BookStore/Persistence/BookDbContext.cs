using Biblioteca.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Persistence
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {

        }
        public DbSet<Book> Books { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
    {

        base.OnModelCreating(builder);
        builder.Entity<Book>(e =>
        {
            // nenhum pode ser null!
            e.HasKey(l => l.isbn);
            e.Property(l => l.bookName).IsRequired();
            e.Property(l => l.authorid).IsRequired();
            e.Property(l => l.price).IsRequired();

        });
    }
}

    }
    