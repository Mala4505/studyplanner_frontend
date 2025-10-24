import React, { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { DateCell } from './DateCell';
import { StudySession } from '../App';
interface CalendarProps {
  studySessions: StudySession[];
}
export function Calendar({
  studySessions
}: CalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: 0
  });
  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: 0
  });
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }, [calendarStart, calendarEnd]);
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, StudySession[]> = {};
    studySessions.forEach(session => {
      if (!grouped[session.date]) {
        grouped[session.date] = [];
      }
      grouped[session.date].push(session);
    });
    return grouped;
  }, [studySessions]);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return <div className="flex-1 p-6 overflow-y-auto bg-background">
    {/* <div className="app-container">
      <Calendar studySessions={studySessions} />
    </div> */}
    <div className="mb-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <CalendarDays className="w-8 h-8" />
        Study Calendar
      </h1>
      <p className="text-muted-foreground mt-1">
        {format(today, 'MMMM yyyy')}
      </p>
    </div>
    <div className="grid grid-cols-7 gap-1 mb-2">
      {weekDays.map(day => <div key={day} className="text-center font-semibold text-sm py-2 text-muted-foreground">
        {day}
      </div>)}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {calendarDays.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        const sessions = sessionsByDate[dateString] || [];
        const isCurrentMonth = day.getMonth() === today.getMonth();
        return <DateCell key={dateString} date={day} dateString={dateString} sessions={sessions} isCurrentMonth={isCurrentMonth} />;
      })}
    </div>
  </div>;
}

