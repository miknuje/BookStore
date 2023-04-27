using BookStore.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Persistence
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {

        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Author> Authors { get; set; }
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
            e.HasOne(x => x.author).WithMany(x => x.books).HasForeignKey(x => x.authorid);
        });
        builder.Entity<Author>(e =>
            {
            
            e.HasKey(a => a.authorId);
            e.Property(s => s.authorId).UseIdentityColumn();
            });
        }
}

    }
    