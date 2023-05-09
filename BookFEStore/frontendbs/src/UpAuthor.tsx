import React, { useEffect, useState } from 'react';
import { AuthorDTO } from './dto/AuthorDTO';

function UpAuthor() {
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorId, setAuthorId] = useState<number>();
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortType, setSortType] = useState<'id' | 'name' | null>(null);
  const [activeSortType, setActiveSortType] = useState<'id' | 'name' | null>(null);
  const [message, setMessage] = useState('');
  const [errorSussess, setErrorSussess] = useState(false);


  useEffect(() => {
    fetch('https://localhost:7275/api/Author/GetAllAuthor')
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

  useEffect(() => {
    if (sortType) {
      sortAuthors();
    }
  }, [sortType]);

  function sortAuthors() {
    const sortedAuthors = [...authors];

    if (sortType === 'id') {
      sortedAuthors.sort((a, b) => a.authorId - b.authorId);
    } else if (sortType === 'name') {
      sortedAuthors.sort((a, b) => a.name.localeCompare(b.name));
    }

    setAuthors(sortedAuthors);
  }

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
          setAuthors(authors => authors.map(author => {
            if (author.authorId === authorId) {
              return { ...author, isDeleted: true };
            }
            return author;
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  function handleUpdate(event) {
    event.preventDefault();
    if (!authorId) {
      setErrorSussess(false);
      setMessage("Error: Id is required");
      return;
    }
    if (!authorName || authorName.trim() == "") {
      setErrorSussess(false);
      setMessage("Error: Author is required");
      return;
    }
    const id: number = authorId;
    const name = authorName;

    const isDeletedRadioTrue = document.querySelector<HTMLInputElement>('input[name="isDeleted"]:checked');
    const isDeletedRadioFalse = document.getElementById("isDeletedRadioFalse");

    const isDeletedValue = isDeleted;
    setIsDeleted(isDeletedValue);

    fetch(`https://localhost:7275/api/Author/PutAuthor?authorId=${id}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify({ authorId: id, name: name, isDeleted: isDeletedValue })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        setErrorSussess(data.success);
        setMessage(data.message);
        setAuthors(authors && authors.map(author => {
          if (author.authorId === parseInt(String(id))) {
            return { ...author, name: name, isDeleted: data.isDeleted };
          }
          return author;
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
        <h1>All Authors</h1>
      </header>
      <div className="list-books__form">
        <h2>Update Authors</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(e);
        }}>
          <label>
            Id:
            <select name="authorId" value={authorId} onChange={(e) => setAuthorId(parseInt(e.target.value))}>
              <option value="">Select an ID</option>
              {authors && authors.map(au => (
                <option key={au.authorId} value={au.authorId}>{au.authorId}</option>
                ))}
                </select>
          </label>
          <label>
            Name:
            <input type="text" name="name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </label>
          <label>
            <input type="radio" id="isDeletedRadioTrue" name="isDeleted" value="true" checked={isDeleted === true} onChange={() => setIsDeleted(true)} />
            Deleted
          </label>
          <label>
            <input type="radio" id="isDeletedRadioFalse" name="isDeleted" value="false" checked={isDeleted === false} onChange={() => setIsDeleted(false)} />
            Not Deleted
          </label>
          <button type="submit">Update</button>
        </form>
        <h5 className={errorSussess ? 'success' : 'error'}>{message}</h5>
      </div>
      <div className="list-books__list">
        <h1>List Authors</h1>
        <div className="sort-buttons">
          <button
            onClick={() => {
              setSortType('id');
              setActiveSortType('id');
            }}
            className={activeSortType === 'id' ? 'active' : ''}
          >
            Sort by ID
          </button>
          <button
            onClick={() => {
              setSortType('name');
              setActiveSortType('name');
            }}
            className={activeSortType === 'name' ? 'active' : ''}
          >
            Sort by Name
          </button>
        </div>
        <ul>
          {displayItems(authors).map((au) => {
            return (
              <li key={au.authorId.toString()}>
                <h6>Id: {au.authorId.toString()}</h6>
                <p>Name: {au.name.toString()}</p>
                <div>
                {au.isDeleted ? (
                    <button disabled>Already deleted</button>
                ) : (
                    <button onClick={() => handleDelete(au.authorId)}>Delete</button>
                )}
                </div>
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

export default UpAuthor;