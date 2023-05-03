import React, { useEffect, useState } from 'react';
import './Book.css';

type Author = {
    authorId: number;
    name: string;
  }
type Book = {
  isbn: string;
  bookName: string;
  authorId: number;
  price: number | string;
  author: [];
};

function Books() {
    const [books, setBooks] = useState<Book[]>([]);
  
    useEffect(() => {
      fetch('https://localhost:7275/api/Book/GetBook')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.obj)) {
            setBooks(data.obj);
            data.obj.map((book) => {
              console.log(book);
            });
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
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
            
          setBooks(books.filter(book => book.isbn !== isbn));
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const price = form.price.value;
        
        // Busca informações do autor na tabela correspondente
        const authorId = Number(form.authorId.value);
        getAuthor(authorId).then(author => {
          const newBook = {
            isbn: form.isbn.value,
            bookName: form.bookName.value,
            price: parseFloat(form.price.value),
            authorId: form.authorId.value,
            author: author.name
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
            if (data.success) {
              setBooks(books.concat(newBook));
            }
          })
          .catch(error => {
            console.log(error);
          });
        });
      }
      
      async function getAuthor(authorId: number) {
        const response = await fetch(`https://localhost:7275/api/Author/GetAuthor?authorId=${authorId}`);
        const data = await response.json();
        return data.obj;
      }
    
  
    return (
      <>
        <div className="list-books">
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
        <input type="text" name="authorId" />
      </label>
      <label>
        Price:
        <input type="number" name="price"  step="0.01"/>
      </label>
      <button type="submit">Add</button>
    </form>
  </div>
  <div className="list-books__list">
    <h1>List Books</h1>
    <ul>
      {books.map(bok => {
        return (
          <li key={bok.isbn.toString()}>
            <h6>ISBN: {bok.isbn.toString()}</h6>
            <p>Book Name: {bok.bookName}</p>
            <p>Author: {bok.author}</p>
            <p>Price: {bok.price}</p>
            <button onClick={() => handleDelete(bok.isbn)}>Delete</button>
          </li>
        );
      })}
      
    </ul>
  </div>
</div>
        
      </>
    );
  }
  
  export default Books;