import React, { useEffect, useState } from 'react';
import { BookDTO } from './dto/BookDTO';
import { AuthorDTO } from './dto/AuthorDTO';

function UpBook() {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [authorId, setAuthorId] = useState<number>();
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [bookName, setBookName] = useState('');
  const [price, setPrice] = useState(0);
  const [isbn, setIsbn] = useState('');
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'title' | 'price'>('title');

  useEffect(() => {
    fetch('https://localhost:7275/api/Author/GetAuthor')
      .then(response => response.json())
      .then(data => {
        setAuthors(data.obj);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch('https://localhost:7275/api/Book/GetAllBook')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.obj)) {
          setBooks(data.obj);
          setTotalPages(Math.ceil(data.obj.length / itemsPerPage));
        } else {
          console.log('obj não é um array');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function sortByTitle() {
    if (sortBy === 'title') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('title');
      setSortOrder('asc');
    }
  }

  function sortByPrice() {
    if (sortBy === 'price') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('price');
      setSortOrder('asc');
    }
  }

  async function getAuthor(authorId: number) {
    const response = await fetch(`https://localhost:7275/api/Author/GetAuthor?authorId=${authorId}`);
    const data = await response.json();
    return data.obj;
  }

  function displayItems(items) {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    let sortedItems = [...items];

    if (sortBy === 'title') {
      sortedItems.sort((a, b) => a.bookName.localeCompare(b.bookName));
    } else if (sortBy === 'price') {
      sortedItems.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === 'desc') {
      sortedItems.reverse();
    }

    return sortedItems.slice(firstIndex, lastIndex);
  }

  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  function handleDelete(isbn: string) {
    fetch(`https://localhost:7275/api/Book/DeleteBook?isbn=${isbn}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to delete book');
      }
    })
    .then(data => {
      console.log(data);
      if (data.success) {
        setBooks(books.filter(book => book.isbn !== isbn));
        setTotalPages(Math.ceil(books.length / itemsPerPage));
      }
    })
    .catch(error => {
      console.log(error);
    });
}
  
function handleUpdate(event) {
  event.preventDefault();
  if (!authorId) {
    throw new Error('authorId is required');
  }
  const isbnValue = isbn;
  const authorid = authorId;
  const name = bookName;
  const priceValue = price;
  console.log(isbnValue);
  console.log(name);
  console.log(authorid);
  console.log(priceValue);
  const isDeletedRadioTrue = document.querySelector<HTMLInputElement>('input[name="isDeleted"]:checked');

  const isDeletedRadioFalse = document.getElementById("isDeletedRadioFalse");
  const isDeletedValue = isDeleted;
  setIsDeleted(isDeletedValue);
  fetch(`https://localhost:7275/api/Book/PutBook?isbn=${isbn}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isbn: isbnValue, authorId: authorid, bookName: name, price: priceValue, isDeleted: isDeletedValue })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        setBooks(books.map(book => {
          if (book.isbn === isbnValue) {
            return { ...book, name: name };
          }
          return book;
        }));
      }
    })
    .catch(error => {
      console.log(error);
    });
}
  
  return (
    <div className="list-books">
      <header>
        <h1>All Books</h1>
      </header>
      <div className="list-books__form">
        <h2>Update Book</h2>
        <form onSubmit={handleUpdate}>
          <label>
            ISBN:
            <select name="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)}>
              <option value="">Select an ISBN</option>
              {books.map(book => (
                <option key={book.isbn} value={book.isbn}>{book.isbn}</option>
              ))}
            </select>
          </label>
          <label>
            Name:
            <input type="text" name="bookName" value={bookName} onChange={(e) => setBookName(e.target.value)} />
          </label>
          <label>
            Author:
            <select name="authorId" value={authorId || ''} onChange={(e) => setAuthorId(parseInt(e.target.value))}>
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.authorId} value={author.authorId}>{author.name}</option>
              ))}
            </select>
          </label>
          <label>
            Price:
            <input type="number" name="price" step="0.01" value={price || ''} onChange={(e) => setPrice(parseFloat(e.target.value))} />
          </label>
          <label>
            <input type="radio" id="isDeletedRadioTrue" name="isDeleted" value="true" checked={isDeleted === true} onChange={() => setIsDeleted(true)} />
            Deletado
          </label>
          <label>
            <input type="radio" id="isDeletedRadioFalse" name="isDeleted" value="false" checked={isDeleted === false} onChange={() => setIsDeleted(false)} />
            Não Deletado
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
      <div className="list-books__list">
        <h1>List Books</h1>
        <div className='sort-buttons'>
            <button
              onClick={sortByTitle}
              className={sortBy === 'title' ? 'active' : ''}
            >
              Sort by Title
            </button>
            <button
              onClick={sortByPrice}
              className={sortBy === 'price' ? 'active' : ''}
            >
              Sort by Price
            </button>
          </div>
        <ul>
          {displayItems(books).map((bok) => {
            return (
              <li key={bok.isbn.toString()}>
                <h6>isbn: {bok.isbn.toString()}</h6>
                <p>Name: {bok.bookName.toString()}</p>
                {bok.author ? <p>Author: {bok.author.name}</p> : <p>Author: not found</p>}
                <p>Price: {bok.price.toString()}</p>
                {bok.isDeleted ? (
                    <button disabled>Already deleted</button>
                ) : (
                    <button onClick={() => handleDelete(bok.isbn)}>Delete</button>
                )}
                
              </li>
            );
          })}
        </ul>
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => changePage(pageNumber)}
                className={currentPage === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpBook;