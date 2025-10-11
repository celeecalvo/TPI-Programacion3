import React, { useEffect, useState } from 'react';
import { useFetch } from '../../hook/UseFetch.js';
const PastActivity = ({ activity }) => {
  const { getById } = useFetch('/books');
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const bookData = await getById(activity.bookId);
      setBook(bookData);
    };
    fetchBook();
  }, [activity.bookId]);

  if (!book) return null;

  return (
    <div className="past-activity-card">
      <img src={`/${book.image}`} alt={book.title} className="past-book-cover" />
      <div className="past-activity-info">
        <h4>{book.title}</h4>
        <p><em>{book.author}</em></p>
        <p className="activity-dates">
          {new Date(activity.dateStart).toLocaleDateString()} -{" "}
          {new Date(activity.dateEnd).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PastActivity;
