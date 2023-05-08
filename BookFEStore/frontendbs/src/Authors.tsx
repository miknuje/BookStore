import React, { useEffect, useState } from 'react';

type Author = {
  authorId: number;
  name: string;
  books: [];
};

function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch('https://localhost:7275/api/Author/GetAuthor')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.obj)) {
          setAuthors(data.obj);
          setTotalPages(Math.ceil(data.obj.length / itemsPerPage));
        } else {
          console.log('obj não é um array');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function displayItems(items) {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return items.slice(firstIndex, lastIndex);
  }
  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleDelete(authorId: number) {
    fetch(`https://localhost:7275/api/Author/DeleteAuthor?authorId=${authorId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {   
        setAuthors(authors.filter(author => author.authorId !== authorId));
        setTotalPages(Math.ceil(authors.length / itemsPerPage));
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authorName.trim()) {
      return;
    }

    fetch('https://localhost:7275/api/Author/AddAuthor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: authorName })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        console.log(data.obj);
        setAuthors([...authors, { authorId: data.obj, name: authorName, books: [] }]);
        setAuthorName('');
        setTotalPages(Math.ceil(authors.length / itemsPerPage) + 1);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  

  return (
    <div className="list-books">
      <header>
        <h1>All Authors</h1>
      </header>
      <div className="list-books__form">
        <h2>Add Author</h2>
        <form onSubmit={handleAdd}>
          <label>
            Name:
            <input type="text" name="name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="list-books__list">
        <h1>List Authors</h1>
        <ul>
          {displayItems(authors).map((au) => {
            return (
              <li key={au.authorId.toString()}>
                <h6>Id: {au.authorId.toString()}</h6>
                <p>Name: {au.name.toString()}</p>
                {au.isDeleted ? (
                    <button disabled>Already deleted</button>
                ) : (
                    <button onClick={() => handleDelete(au.authorId)}>Delete</button>
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
          {Array.from({ length: Math.ceil(authors.length / itemsPerPage) }, (_, index) => {
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
            disabled={currentPage === Math.ceil(authors.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authors;