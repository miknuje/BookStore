import React, { useEffect, useState } from 'react';

type Author = {
  authorId: number;
  name: string;
  books: [];
};

function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorName, setAuthorName] = useState('');


  useEffect(() => {
    fetch('https://localhost:7275/api/Author/GetAuthor')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.obj)) {
          setAuthors(data.obj);
          data.obj.map((author) => {
            console.log(author);
          });
        } else {
          console.log('obj não é um array');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleDelete(authorId: number) {
    fetch(`https://localhost:7275/api/Author/DeleteAuthor?authorId=${authorId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
          
        setAuthors(authors.filter(author => author.authorId !== authorId));
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
      setAuthors([...authors, { authorId: data.obj, name: authorName, books: [] }]);
      setAuthorName('');
    }
  })
  .catch(error => {
    console.log(error);
  });
}

  

  return (
    <div className="list-books">
    <div className="list-books__form">
      <h2>Add Book</h2>
      <form onSubmit={handleAdd}>
        <label>
          Name:
          <input type="text" name="name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />

        </label>
        <button type="submit">Add</button>
      </form>
    </div>
    <div className="list-books__list">
      <h1>List Books</h1>
      <ul>
        {authors.map(au => {
          return (
            <li key={au.authorId.toString()}>
              <h6>Id: {au.authorId.toString()}</h6>
              <p>Name: {au.name.toString()}</p>
              <button onClick={() => handleDelete(au.authorId)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
  );
}

export default Authors;