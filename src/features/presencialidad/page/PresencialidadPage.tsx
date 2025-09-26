import { AttendanceCalendar } from "../components/AttendanceCalendar";
import { StudentAttendanceList } from "../components/StudentAttendanceList";
import { useAttendance } from "../hooks/useAttendance";

export const PresencialidadPage = () => {
  const {
    selectedDate,
    currentStudents,
    currentStats,
    hasCurrentRecord,
    selectDate,
    toggleStudentStatus,
    createAttendanceRecord,
    saveAttendance,
    selectAll,
    unselectAll,
    calendarAttendanceData,
    pendingChanges
  } = useAttendance();

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
            students={currentStudents}
            onStudentStatusChange={toggleStudentStatus}
            onCreateRecord={createAttendanceRecord}
            onSaveAttendance={saveAttendance}
            hasAttendanceRecord={hasCurrentRecord}
            attendanceStats={currentStats}
            onSelectAll={selectAll}
            onUnselectAll={unselectAll}
          />
        </div>
      </div>
    </div>
  );
};
