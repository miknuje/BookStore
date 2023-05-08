import React, { useState, useEffect } from 'react';
import './Book.css';
import { AuthorDTO } from './dto/AuthorDTO';

function GetISBN() {
  const [isbn, setIsbn] = useState('');
  const [books, setBooks] = useState<Array<{isbn: string, bookName: string,authorId: number, author: AuthorDTO}>>([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function getBook() {
      try {
        const response = await fetch(`https://localhost:7275/${isbn}`);
        const data = await response.json();
        setBooks(data.obj);
        setError(null);
        setTotalPages(Math.ceil(data.obj.length / itemsPerPage));
      } catch (error) {
        setBooks([]);
        setError(error.message);
        setTotalPages(1);
      }
    }

    if (isbn) {
      getBook();
    }
  }, [isbn, itemsPerPage]);

  function handleIsbnChange(event) {
    setIsbn(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function displayItems(items) {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return items.slice(firstIndex, lastIndex);
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
      .then(response => response.json())
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

  return (
    <div>
      <header>
        <h1>Get Book by ISBN</h1>
      </header>
      <div className="list-books__form">
        <form onSubmit={handleSubmit}>
          <h2>Enter ISBN:</h2>
          <label htmlFor="isbn">ISBN:</label>
          <input type="text" id="isbn" name="isbn" value={isbn} onChange={handleIsbnChange} />
          {error && <h5 className="error">{error}</h5>}
          {books.length > 0 && (
            <h5 className="success">{`Showing ${displayItems(books).length} of ${books.length} results`}</h5>
          )}
          <button type="submit">Get Book</button>
        </form>
      </div>
      {books.length > 0 && (
        <div className="list-books__list">
          <h1>Results:</h1>
          <ul>
            {displayItems(books).map((book, index) => (
              <li key={index}>
                <h6>{book.isbn}</h6>
                <p>Book Name: {book.bookName}</p>
                <p>Author: {book.author.name}</p>
                {book.isDeleted ? (
                    <button disabled>Already deleted</button>
                  ) : (
                    <button onClick={() => handleDelete(book.isbn)}>Delete</button>
                  )}
              </li>
            ))}
          </ul>
          <div className="pagination">
            {pageNumbers.map((number) => (
                <button key={number} className={currentPage === number ? 'active' : undefined} onClick={() => changePage(number)}>

                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GetISBN;
