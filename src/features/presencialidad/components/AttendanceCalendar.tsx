import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AttendanceCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  attendanceData?: {
    [key: string]: {
      present: number;
      total: number;
      percentage: number;
    };
  };
  pendingChanges?: Record<string, boolean>;
}

export const AttendanceCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  attendanceData = {},
  pendingChanges = {}
}: AttendanceCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());


  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonthIndex = currentDate.getMonth();
      
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        // No permitir navegar más allá del mes actual
        const nextMonth = new Date(prev);
        nextMonth.setMonth(prev.getMonth() + 1);
        
        if (nextMonth.getFullYear() > currentYear || 
            (nextMonth.getFullYear() === currentYear && nextMonth.getMonth() > currentMonthIndex)) {
          return prev; // No cambiar si sería más allá del mes actual
        }
        
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getAttendanceForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return attendanceData[dateKey];
  };

  const hasEvent = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return !!attendanceData[dateKey];
  };

  // Calcular promedio mensual de presencialidad
  const getMonthlyAverage = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let totalPercentage = 0;
    let daysWithData = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const attendance = getAttendanceForDate(date);
      if (attendance) {
        totalPercentage += attendance.percentage;
        daysWithData++;
      }
    }
    
    if (daysWithData === 0) return 0;
    return Math.round(totalPercentage / daysWithData);
  };

  // Determinar color del promedio mensual
  const getMonthlyAverageColor = () => {
    const average = getMonthlyAverage();
    if (average < 30) return 'bg-alert-red-100 text-alert-red-700';
    if (average < 70) return 'bg-progress-yellow-100 text-progress-yellow-700';
    return 'bg-education-green-100 text-education-green-700';
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = new Intl.DateTimeFormat('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  }).format(currentMonth);

  // Verificar si estamos en el mes actual para deshabilitar el botón "siguiente"
  const isCurrentMonth = () => {
    const currentDate = new Date();
    return currentMonth.getFullYear() === currentDate.getFullYear() && 
           currentMonth.getMonth() === currentDate.getMonth();
  };

  return (
    <Card className="h-full flex flex-col bg-digital-blue-20 border-0">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-digital-blue-50">
            <Calendar className="w-5 h-5 text-digital-blue-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-dark-text">Calendario</CardTitle>
            <CardDescription className="text-xs text-medium-gray">
              Selecciona la fecha para gestionar la presencialidad
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-light-gray rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-dark-text capitalize">
            {monthName}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            disabled={isCurrentMonth()}
            className="p-2 hover:bg-light-gray rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2 w-80 mx-auto">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-medium-gray py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10" />;
              }
              
              const attendance = getAttendanceForDate(day);
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);
              const hasEventForDay = hasEvent(day);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  size="sm"
                  onClick={() => onDateSelect(day)}
                  className={`
                    h-10 p-0 relative rounded-lg transition-all duration-200
                    ${isSelectedDay 
                      ? 'bg-digital-blue-50 text-digital-blue-700 border-2 border-digital-blue-400 hover:bg-digital-blue-50 hover:text-digital-blue-700' 
                      : hasEventForDay 
                        ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200'
                        : isCurrentDay 
                          ? 'bg-education-green-50 text-education-green-700 hover:bg-education-green-50 hover:text-education-green-700' 
                          : 'hover:bg-light-gray'
                    }
                  `}
                >
                  <span className="text-sm font-medium">
                    {day.getDate()}
                  </span>
                  
                  {/* Pending changes indicator - ALWAYS BLUE */}
                  {pendingChanges[day.toISOString().split('T')[0]] && (
                    <div 
                      className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white z-10"
                      style={{ 
                        backgroundColor: '#3498DB',
                        background: '#3498DB'
                      }}
                    />
                  )}
                  
                  {/* Attendance indicator - only if NO pending changes */}
                  {!pendingChanges[day.toISOString().split('T')[0]] && attendance && (
                    <div className={`
                      absolute -bottom-1 left-1/2 transform -translate-x-1/2
                      w-2 h-2 rounded-full
                      ${hasEventForDay ? 'bg-purple-300' : 'bg-digital-blue-200'}
                    `} />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

      </CardContent>

      {/* Monthly Average Attendance Footer */}
      <CardFooter className="border-t border-light-gray">
        <div className="flex items-center gap-2 pt-4">
          <div className="text-sm text-medium-gray">Promedio de presencialidad del mes:</div>
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${getMonthlyAverageColor()}
          `}>
            {getMonthlyAverage()}%
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
