using AutoMapper;
using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Entities;

namespace map.AutoMapper
    {
        public class AutoMapperconfig : Profile
        {
            public AutoMapperconfig()
            {
                // Author mappings
                CreateMap<AuthorDTO, Author>()
                    .ForMember(dest => dest.authorId, opt => opt.Ignore());
                CreateMap<Author, AuthorDTO>();
                CreateMap<Author, GetAuthorDTO>();

                // Book mappings
                CreateMap<Book, BookDTO>()
                    .ForMember(dest => dest.author, opt => opt.MapFrom(src => src.author.Name))
                    .ForMember(dest => dest.authorid, opt => opt.MapFrom(src => src.author.authorId));
                CreateMap<AddBookDTO, Book>()
                    .ForMember(dest => dest.author, opt => opt.Ignore());
                CreateMap<Book, AddBookDTO>();

                // UpBookDTO mappings
                CreateMap<UPBookDTO, Book>()
                    .ForMember(dest => dest.author, opt => opt.Ignore())
                    .ForMember(dest => dest.isbn, opt => opt.Ignore())
                    .ForMember(dest => dest.price, opt => opt.Ignore());
                CreateMap<Book, UPBookDTO>();

                // AddAuthorDTO mappings
                CreateMap<AddAuthorDTO, Author>()
                    .ForMember(dest => dest.authorId, opt => opt.Ignore());
                CreateMap<Author, AddAuthorDTO>();
            }
        }
    }