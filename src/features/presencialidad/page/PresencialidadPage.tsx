import { AttendanceCalendar } from "../components/AttendanceCalendar";
import { StudentAttendanceList } from "../components/StudentAttendanceList";
import { useHybridAttendance } from "@/hooks/useHybridAttendance";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const PresencialidadPage = () => {
  const authContext = useContext(AuthContext);
  const {
    selectedDate,
    getCurrentStudents,
    getCurrentStats,
    hasCurrentRecord,
    selectDate,
    toggleStudentStatus,
    createRecord,
    saveRecord,
    deleteRecord,
    selectAll,
    unselectAll,
    downloadEventCSV,
    calendarAttendanceData,
    pendingChanges,
  } = useHybridAttendance();

  useEffect(() => {
    if (authContext?.selectedCourse && authContext?.fetchStudents) {
      console.log("Curso seleccionado en PresencialidadPage:", authContext.selectedCourse);
      
      // Obtener estudiantes del curso seleccionado
      authContext.fetchStudents(authContext.selectedCourse.id);
    }
  }, [authContext?.selectedCourse?.id, authContext?.fetchStudents, authContext]);

  useEffect(() => {
    if (authContext?.students && authContext.students.length > 0) {
      console.log("Estudiantes del curso seleccionado:", authContext.students);
    }
  }, [authContext?.students]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header - Fixed height */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Gestión de Presencialidad</h1>
        <p className="text-medium-gray mt-2">
          Selecciona una fecha en el calendario y marca los estudiantes presentes
        </p>
      </div>

      {/* Main Content - Two Column Layout with remaining height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 overflow-hidden">
        {/* Calendar Component */}
        <div className="min-h-0 overflow-hidden">
          <AttendanceCalendar
            selectedDate={selectedDate}
            onDateSelect={selectDate}
            attendanceData={calendarAttendanceData}
            pendingChanges={pendingChanges}
          />
        </div>

        {/* Student List Component */}
        <div className="min-h-0 overflow-hidden">
          <StudentAttendanceList
            selectedDate={selectedDate}
            students={getCurrentStudents()}
            onStudentStatusChange={toggleStudentStatus}
            onCreateRecord={createRecord}
            onSaveAttendance={saveRecord}
            onDeleteEvent={deleteRecord}
            onDownloadCSV={downloadEventCSV}
            hasAttendanceRecord={hasCurrentRecord}
            attendanceStats={getCurrentStats()}
            onSelectAll={selectAll}
            onUnselectAll={unselectAll}
          />
        </div>
      </div>
    </div>
  );
};
