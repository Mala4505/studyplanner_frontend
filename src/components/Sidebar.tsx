import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Book } from '../App';
import { createBook } from '../api';

interface SidebarProps {
  books: Book[];
  onAddBook: (book: Book) => void;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

export function Sidebar({ books, onAddBook }: SidebarProps) {
  const [formData, setFormData] = useState({
    title: '',
    totalPages: '',
    duration: '',
    startDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.totalPages || !formData.duration || !formData.startDate) {
      alert('Please fill in all fields.');
      return;
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: formData.title,
      totalPages: parseInt(formData.totalPages),
      duration: parseInt(formData.duration),
      startDate: new Date(formData.startDate),
      color: COLORS[books.length % COLORS.length]
    };

    onAddBook(newBook);

    try {
      await createBook({
        title: newBook.title,
        total_pages: newBook.totalPages,
        duration_days: newBook.duration,
        start_date: newBook.startDate.toISOString().split('T')[0]
      });
      alert('Book submitted to backend!');
    } catch (err) {
      console.error('Book submission failed:', err);
      alert('Failed to submit book. Check console for details.');
    }

    setFormData({
      title: '',
      totalPages: '',
      duration: '',
      startDate: ''
    });
  };

  return (
    <div className="w-full md:w-1/4 min-w-[300px] bg-card border-r border-border p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Add Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Book Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter book title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Pages</label>
            <input
              type="number"
              value={formData.totalPages}
              onChange={e => setFormData({ ...formData, totalPages: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., 300"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duration in Days</label>
            <input
              type="number"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., 30"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Generate Schedule
          </button>
        </form>
      </div>

      {books.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Books</h3>
          <div className="space-y-2">
            {books.map(book => (
              <div key={book.id} className="p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: book.color }}
                  />
                  <span className="font-medium text-sm">{book.title}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {book.totalPages} pages • {book.duration} days
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


