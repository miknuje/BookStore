using AutoMapper;
using BookStore.Infrastructure.DTOs;
using BookStore.Infrastructure.Entities;

namespace map.AutoMapper
{
    public class AutoMapperconfig : Profile
    {
        public AutoMapperconfig()
        {

            CreateMap<AuthorDTO, Author>()
                            .ForMember(dest => dest.authorId, opt => opt.Ignore());
            CreateMap<Author, AuthorDTO>();

            CreateMap<Author, GetAuthorsInfoDTO>();
            //CreateMap<List<Author>, List<GetAuthorsInfoDTO>>();

            //Books
            CreateMap<Book, BookDTO>()
    .ForMember(dest => dest.author, opt => opt.MapFrom(src => src.author.Name))
    .ForMember(dest => dest.authorid, opt => opt.MapFrom(src => src.author.authorId));
            //CreateMap<Author, AuthorDTO>();

            CreateMap<AddBookDTO, Book>()
            .ForMember(dest => dest.author, opt => opt.Ignore());
            CreateMap<Book, AddBookDTO>();




        }
    }

}