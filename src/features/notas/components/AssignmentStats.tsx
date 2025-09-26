interface AssignmentStatsProps {
  submittedCount: number;
  totalStudents: number;
  averageGrade: number;
  passRate: number;
}

export function AssignmentStats({ submittedCount, totalStudents, averageGrade, passRate }: AssignmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-education-green-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-education-green-700">{submittedCount}</div>
        <div className="text-sm text-education-green-700">Entregas</div>
      </div>
      <div className="bg-progress-yellow-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-progress-yellow-700">{totalStudents - submittedCount}</div>
        <div className="text-sm text-progress-yellow-700">Pendientes</div>
      </div>
      <div className="bg-digital-blue-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-digital-blue-700">{averageGrade}</div>
        <div className="text-sm text-digital-blue-700">Promedio</div>
      </div>
      <div className="bg-education-green-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-education-green-700">{passRate}%</div>
        <div className="text-sm text-education-green-700">Aprobación</div>
      </div>
    </div>
  );
}
