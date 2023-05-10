import React, { useEffect, useState } from 'react';
import './Book.css';
import { AuthorDTO } from './dto/AuthorDTO';
import { BookDTO } from './dto/BookDTO';
import Authors from './Authors';

function Books() {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [authorId, setAuthorId] = useState<number>();
  const [message, setMessage] = useState('');
  const [errorSuccess, setErrorSuccess] = useState<null | boolean>(null);;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
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
    fetch('https://localhost:7275/api/Book/GetBook')
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
          setBooks(books => books.map(book => {
            if (book.isbn === isbn) {
              return { ...book, isDeleted: true };
            }
            return book;
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.authorId.value) {
    setErrorSuccess(false);
      setMessage("Error: Author is required");
    return;
  }
  if (!form.isbn.value) {
    setErrorSuccess(false);
      setMessage("Error: ISBN is required");
    return;
  }
  if (!form.bookName.value || form.bookName.value.trim() == "") {
    setErrorSuccess(false);
      setMessage("Error: Book name is required");
    return;
  }
  if (!form.price.value) {
    setErrorSuccess(false);
      setMessage("Error: Price is required");
    return;
  }
  if (form.price.value < 0) {
    setErrorSuccess(false);
      setMessage("Error: Invalid price");
    return;
  }

  const authorId = Number(form.authorId.value);
  const author = await getAuthor(authorId);

  const newBook = {
    isbn: form.isbn.value,
    bookName: form.bookName.value,
    authorid: Number(form.authorId.value),
    price: parseFloat(form.price.value),
    author: author
  };

  fetch('https://localhost:7275/api/Book/PostBook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBook)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setErrorSuccess(data.success);
      setMessage(data.message);
      if (data.success) {
        // Fetch the updated book list after successful addition
        fetch('https://localhost:7275/api/Book/GetBook')
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

        setTotalPages(Math.ceil(books.length / itemsPerPage) + 1);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

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

  return (
    <>
      <div className="list-books">
      <header>
        <h1>All Books</h1>
      </header>
        <div className="list-books__form">
          <h2>Add Book</h2>
          <form onSubmit={handleAdd}>
            <label>
              ISBN:
              <input type="text" name="isbn" />
            </label>
            <label>
              Book Name:
              <input type="text" name="bookName" />
            </label>
            <label>
            Author:
            <select name='authorId' value={authorId || ''} onChange={(e) => setAuthorId(parseInt(e.target.value))}>
            <option value=''>Select an author</option>
            {authors && authors.map(author => (
            <option key={author.authorId} value={author.authorId}>{author.name}</option>
        ))}
        </select>
          </label>
            <label>
              Price:
              <input type="number" name="price" step="0.01" />
            </label>
            <button type="submit">Add</button>
          </form>
          <h5 className={errorSuccess === false ? 'error' : (errorSuccess === null ? 'invisible' : 'success')}>{message}</h5>
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
            {displayItems(books)?.map(bok => {
              return (
                <li key={bok.isbn.toString()}>
                  <h6>ISBN: {bok.isbn.toString()}</h6>
                  <p>Book Name: {bok.bookName}</p>
                  
                  {bok.author ? <p>Author: {bok.author.name}</p> : <p>Author: not found</p>}
                  <p>Price: {bok.price}</p>
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
              onClick={() => changePage(currentPage === 1 ? currentPage : currentPage - 1)}disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button key={pageNumber} onClick={() => changePage(pageNumber)} className={pageNumber === currentPage ? 'active' : ''}>
                {pageNumber}
              </button>
            ))}
            <button onClick={() => changePage(currentPage === totalPages ? currentPage : currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
  }
  
  export default Books;