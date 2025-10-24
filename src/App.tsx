// import { useState, useEffect } from 'react';
// import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
// import { Sidebar } from './components/Sidebar';
// import { Calendar } from './components/Calendar';
// import { getSchedule } from './api';

// export interface Book {
//   id: string;
//   title: string;
//   totalPages: number;
//   duration: number;
//   startDate: Date;
//   color: string;
// }
// export interface StudySession {
//   id: string;
//   bookId: string;
//   bookTitle: string;
//   pageRange: {
//     start: number;
//     end: number;
//   };
//   date: string;
//   color: string;
// }
// export function App() {

//   const [books, setBooks] = useState<Book[]>([]);
//   const [studySessions, setStudySessions] = useState<StudySession[]>([]);

//   useEffect(() => {
//     getSchedule().then(res => {
//       const blocks = res.data.map(block => ({
//         id: `session-${block.id}`,
//         bookId: block.book,
//         bookTitle: block.book_title || 'Untitled', // optional
//         date: block.date_gregorian,
//         hijriDate: block.date_hijri,
//         pageRange: {
//           start: block.page_start,
//           end: block.page_end
//         },
//         color: '#FF6B6B' // or map from book if available
//       }));
//       setStudySessions(blocks);
//     });
//   }, []);


//   const handleAddBook = (book: Book) => {
//     setBooks([...books, book]);
//     const sessions = generateStudySessions(book);
//     setStudySessions([...studySessions, ...sessions]);
//   };
//   const generateStudySessions = (book: Book): StudySession[] => {
//     const sessions: StudySession[] = [];
//     const pagesPerDay = Math.ceil(book.totalPages / book.duration);
//     for (let day = 0; day < book.duration; day++) {
//       const sessionDate = new Date(book.startDate);
//       sessionDate.setDate(sessionDate.getDate() + day);
//       const startPage = day * pagesPerDay + 1;
//       const endPage = Math.min((day + 1) * pagesPerDay, book.totalPages);
//       sessions.push({
//         id: `${book.id}-session-${day}`,
//         bookId: book.id,
//         bookTitle: book.title,
//         pageRange: {
//           start: startPage,
//           end: endPage
//         },
//         date: sessionDate.toISOString().split('T')[0],
//         color: book.color
//       });
//     }
//     return sessions;
//   };
//   const handleDragEnd = (event: DragEndEvent) => {
//     const {
//       active,
//       over
//     } = event;
//     if (!over || active.id === over.id) return;
//     const sessionId = active.id as string;
//     const newDate = over.id as string;
//     setStudySessions(sessions => sessions.map(session => session.id === sessionId ? {
//       ...session,
//       date: newDate
//     } : session));
//     console.log('Backend API call would happen here:', {
//       sessionId,
//       newDate
//     });
//   };
//   return <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//     <div className="flex h-screen w-full bg-background">
//       <Sidebar books={books} onAddBook={handleAddBook} />
//       <Calendar studySessions={studySessions} />
//     </div>
//   </DndContext>;
// }

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Sidebar } from './components/Sidebar';
import { Calendar } from './components/Calendar';
import { getSchedule, updateBlock } from './api';

export interface Book {
  id: string;
  title: string;
  totalPages: number;
  duration: number;
  startDate: Date;
  color: string;
}

export interface StudySession {
  id: string;
  bookId: string;
  bookTitle: string;
  pageRange: {
    start: number;
    end: number;
  };
  date: string;
  hijriDate: string;
  color: string;
}

export function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  // Load saved sessions from backend on page load
  useEffect(() => {
    getSchedule().then(res => {
      const blocks = res.data.map(block => ({
        id: `session-${block.id}`,
        bookId: block.book,
        bookTitle: block.book_title || 'Untitled',
        date: block.date_gregorian,
        hijriDate: block.date_hijri,
        pageRange: {
          start: block.page_start,
          end: block.page_end
        },
        color: '#FF6B6B' // Optional: map from book if available
      }));
      setStudySessions(blocks);
    });
  }, []);

  // Add book and generate sessions
  const handleAddBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
    const sessions = generateStudySessions(book);
    setStudySessions(prev => [...prev, ...sessions]);
  };

  // Generate sessions from book metadata
  const generateStudySessions = (book: Book): StudySession[] => {
    const sessions: StudySession[] = [];
    const pagesPerDay = Math.ceil(book.totalPages / book.duration);
    for (let day = 0; day < book.duration; day++) {
      const sessionDate = new Date(book.startDate);
      sessionDate.setDate(sessionDate.getDate() + day);
      const startPage = day * pagesPerDay + 1;
      const endPage = Math.min((day + 1) * pagesPerDay, book.totalPages);
      sessions.push({
        id: `${book.id}-session-${day}`,
        bookId: book.id,
        bookTitle: book.title,
        pageRange: {
          start: startPage,
          end: endPage
        },
        date: sessionDate.toISOString().split('T')[0],
        hijriDate: '', // frontend will compute this in DateCell
        color: book.color
      });
    }
    return sessions;
  };

  // Handle drag-and-drop updates
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sessionId = active.id as string;
    const newDate = over.id as string;

    setStudySessions(sessions =>
      sessions.map(session =>
        session.id === sessionId ? { ...session, date: newDate } : session
      )
    );

    // Persist change to backend
    const numericId = sessionId.replace('session-', '');
    updateBlock(numericId, newDate).catch(err =>
      console.error('Failed to update session date:', err)
    );
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full bg-background">
        <Sidebar books={books} onAddBook={handleAddBook} />
        <Calendar studySessions={studySessions} />
      </div>
    </DndContext>
  );
}


