import { AuthorDTO } from "./AuthorDTO"
export interface BookDTO {
    isbn: string,
    bookName: string,
    authorId: number,
    price: number,
    author: AuthorDTO
}