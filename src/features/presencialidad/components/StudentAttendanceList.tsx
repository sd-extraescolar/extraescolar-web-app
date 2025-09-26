import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import {
  CheckSquare,
  Download,
  Plus,
  Save,
  Square,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";
import { DeleteEventModal } from "@/features/presencialidad/components/DeleteEventModal";

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'present' | 'absent';
  lastAttendance?: string;
}

interface StudentAttendanceListProps {
  selectedDate: Date;
  students: Student[];
  onStudentStatusChange: (studentId: string, status: 'present' | 'absent') => void;
  onCreateRecord: () => void;
  onSaveAttendance: () => void;
  onDeleteEvent?: () => void;
  hasAttendanceRecord: boolean;
  attendanceStats: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

export const StudentAttendanceList = ({
  selectedDate,
  students,
  onStudentStatusChange,
  onCreateRecord,
  onSaveAttendance,
  onDeleteEvent,
  hasAttendanceRecord,
  attendanceStats,
  onSelectAll,
  onUnselectAll
}: StudentAttendanceListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar si todos los estudiantes filtrados están seleccionados
  const allSelected = filteredStudents.length > 0 && filteredStudents.every(student => student.status === 'present');
  
  // Determinar el modo del botón basado en el estado actual
  const shouldDeselectAll = allSelected;


  const attendancePercentage = attendanceStats.percentage;

  return (
    <Card className="h-full flex flex-col bg-digital-blue-20 border-0">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-education-green-50">
              <Users className="w-5 h-5 text-education-green-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-dark-text">
                Lista de Estudiantes
              </CardTitle>
              <CardDescription className="text-xs text-medium-gray">
                Presencialidad para {formatDate(selectedDate)}
              </CardDescription>
            </div>
          </div>
          
          {hasAttendanceRecord && (
            <div className="flex gap-2">
              <IconButton
                onClick={() => {
                  // Función deshabilitada - en desarrollo
                  console.log('Función de descarga en desarrollo');
                }}
                icon={Download}
                tooltip="Función en desarrollo - Próximamente disponible"
                size="default"
                variant="outline"
                disabled={true}
                className="w-10 h-10 border border-gray-300 text-gray-400 bg-transparent cursor-not-allowed opacity-50"
              />
              <Button
                onClick={onSaveAttendance}
                variant="outline"
                size="default"
                className="w-24 h-10 bg-education-green-500 text-white border-education-green-500 hover:bg-education-green-600 hover:border-education-green-600 hover:text-white flex items-center gap-1 px-4"
              >
                <Save className="w-4 h-4" />
                Guardar
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="outline"
                size="default"
                className="w-24 h-10 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white flex items-center gap-1 px-4"
              >
                <Trash2 className="w-4 h-4" />
                Borrar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-6 overflow-hidden">
        {!hasAttendanceRecord ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="p-4 rounded-full bg-light-gray w-fit mx-auto mb-4">
              <Plus className="w-8 h-8 text-medium-gray" />
            </div>
            <p className="text-medium-gray mb-4">
              No hay registro de presencialidad para esta fecha.
            </p>
            <Button 
              onClick={onCreateRecord}
              className="bg-digital-blue-500 hover:bg-digital-blue-600 text-white rounded-lg px-6 py-2"
            >
              Crear registro
            </Button>
          </div>
         ) : (
           <>
             {/* Fixed Header Section */}
             <div className="flex-shrink-0 space-y-6">
               {/* Overall Attendance Percentage */}
               <div className="p-4 rounded-lg bg-education-green-50">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-education-green-800">Asistencia General</p>
                     <p className="text-2xl font-bold text-education-green-700">
                       {attendancePercentage}%
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-education-green-600">
                       {attendanceStats.present} de {attendanceStats.total}
                     </p>
                     <p className="text-xs text-education-green-600">estudiantes presentes</p>
                   </div>
                 </div>
               </div>

               {/* Search and Selection Controls */}
               <div className="flex items-center gap-2">
                 <div className="relative flex-1">
                   <input
                     type="text"
                     placeholder="Buscar estudiante..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 h-10 border border-light-gray rounded-lg focus:ring-2 focus:ring-digital-blue-200 focus:border-digital-blue-300 transition-colors"
                   />
                   <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-gray" />
                 </div>
                 
                 <IconButton
                   icon={shouldDeselectAll ? Square : CheckSquare}
                   variant="outline"
                   size="default"
                   className="w-10 h-10 border border-digital-blue-300 text-digital-blue-600 bg-transparent hover:bg-transparent hover:border-digital-blue-400"
                   onClick={() => {
                     if (shouldDeselectAll) {
                       onUnselectAll();
                     } else {
                       onSelectAll();
                     }
                   }}
                   tooltip={shouldDeselectAll ? 'Deseleccionar todos' : 'Seleccionar todos'}
                 />
               </div>
             </div>

             {/* Scrollable Students List */}
             <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
               {filteredStudents.map((student) => {
                 const isPresent = student.status === 'present';
                 
                 return (
                   <div 
                     key={student.id}
                     className={`
                       flex items-center justify-between p-4 border rounded-lg transition-all duration-200 cursor-pointer
                       ${isPresent 
                         ? 'border-digital-blue-200 bg-digital-blue-50 hover:bg-digital-blue-200' 
                         : 'border-light-gray bg-light-gray hover:bg-light-blue-gray'
                       }
                     `}
                     onClick={() => onStudentStatusChange(student.id, isPresent ? 'absent' : 'present')}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`
                         w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-200
                         ${isPresent 
                           ? 'bg-education-green-500' 
                           : 'bg-medium-gray grayscale opacity-75'
                         }
                       `}>
                         {student.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                         <h3 className={`font-medium transition-colors duration-200 ${
                           isPresent ? 'text-dark-text' : 'text-medium-gray'
                         }`}>
                           {student.name}
                         </h3>
                         <p className="text-sm text-medium-gray">{student.email}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                       {isPresent ? (
                         <Badge className="bg-education-green-100 text-education-green-700 text-xs px-3 py-1">
                           Presente
                         </Badge>
                       ) : (
                         <Badge className="bg-light-medium-gray text-light-gray text-xs px-3 py-1">
                           Ausente
                         </Badge>
                       )}
                       
                     </div>
                   </div>
                 );
               })}
             </div>
          </>
        )}
      </CardContent>
      
      {/* Delete Event Modal */}
      {showDeleteModal && onDeleteEvent && (
        <DeleteEventModal
          selectedDate={selectedDate}
          onConfirm={onDeleteEvent}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Card>
  );
};
