import React, { useState, useEffect } from 'react';
import './Book.css';

function GetId() {
  const [authorid, setAuthorId] = useState('');
  const [authors, setAuthors] = useState<Array<{authorId: number, name: string}>>([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function getAuthor() {
      try {
        const response = await fetch(`https://localhost:7275/api/Author/api/${authorid}`);
        const data = await response.json();
        console.log(data.obj);
        setAuthors(data.obj);
        setError(null);
        setTotalPages(Math.ceil(data.obj.length / itemsPerPage));
      } catch (error) {
        setAuthors([]);
        setError(error.message);
        setTotalPages(1);
      }
    }

    if (authorid) {
      getAuthor();
    }
  }, [authorid, itemsPerPage]);

  function handleidChange(event) {
    setAuthorId(event.target.value);
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
  function handleDelete(authorId: number) {
    fetch(`https://localhost:7275/api/Author/DeleteAuthor?authorId=${authorId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          setAuthors(authors.filter(book => book.authorId !== authorId));
          setTotalPages(Math.ceil(authors.length / itemsPerPage));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <header>
        <h1>Get Book by id</h1>
      </header>
      <div className="list-books__form">
        <form onSubmit={handleSubmit}>
          <h2>Enter id:</h2>
          <label htmlFor="id">id:</label>
          <input type="text" id="id" name="id" value={authorid} onChange={handleidChange} />
          {error && <h5 className="error">{error}</h5>}
          {authors.length > 0 && (
            <h5 className="success">{`Showing ${displayItems(authors).length} of ${authors.length} results`}</h5>
          )}
          <button type="submit">Get Book</button>
        </form>
      </div>
      {authors.length > 0 && (
        <div className="list-books__list">
          <h1>Results:</h1>
          <ul>
            {displayItems(authors).map((au, index) => (
              <li key={index}>
                <h6>{au.authorId}</h6>
                <p>Author name: {au.name}</p>
                {au.isDeleted ? (
                    <button disabled>Already deleted</button>
                ) : (
                    <button onClick={() => handleDelete(au.authorId)}>Delete</button>
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

export default GetId;