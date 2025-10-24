import { useState } from 'react';
import { createBook, saveSchedule } from '../api';

export default function BookForm() {
  const [form, setForm] = useState({
    title: '',
    total_pages: '',
    duration_days: '',
    start_date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookRes = await createBook(form);
    const bookId = bookRes.data.id;

    // Assume you already generated schedule blocks in frontend
    const scheduleBlocks = generateScheduleBlocks(bookId, form); // You define this logic

    await saveSchedule(scheduleBlocks);
    alert('Book and schedule saved!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Book Title" onChange={handleChange} />
      <input name="total_pages" type="number" placeholder="Total Pages" onChange={handleChange} />
      <input name="duration_days" type="number" placeholder="Duration (days)" onChange={handleChange} />
      <input name="start_date" type="date" onChange={handleChange} />
      <button type="submit">Generate Schedule</button>
    </form>
  );
}
