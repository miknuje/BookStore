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
  
  function handleUpdate(event) {
    event.preventDefault();
    if (!authorId) {
      throw new Error('authorId is required');
    }
    const id: number = authorId;
    const name = authorName;
    console.log(authorId)
    console.log(name)
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
        setAuthors(authors.map(author => {
          if (author.authorId === parseInt(String(id))) {
            return { ...author, name: name };
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
            <input type='number' name='authorId' value={authorId || ''} onChange={(e) => setAuthorId(parseInt(e.target.value))} />
          </label>
          <label>
            Name:
            <input type="text" name="name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
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
        <h1>List Authors</h1>
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