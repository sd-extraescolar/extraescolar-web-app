interface AssignmentStatsProps {
  submittedCount: number;
  totalStudents: number;
  averageGrade: number;
  passRate: number;
}

export function AssignmentStats({ submittedCount, totalStudents, averageGrade, passRate }: AssignmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-500 rounded-xl p-6">
        <div className="text-2xl font-bold text-white">{submittedCount}</div>
        <div className="text-sm font-medium text-white">Entregas</div>
      </div>
      <div className="bg-yellow-400 rounded-xl p-6">
        <div className="text-2xl font-bold text-white">{totalStudents - submittedCount}</div>
        <div className="text-sm font-medium text-white">Pendientes</div>
      </div>
      <div className="bg-blue-500 rounded-xl p-6">
        <div className="text-2xl font-bold text-white">{averageGrade}</div>
        <div className="text-sm font-medium text-white">Promedio</div>
      </div>
      <div className="bg-purple-500 rounded-xl p-6">
        <div className="text-2xl font-bold text-white">{passRate}%</div>
        <div className="text-sm font-medium text-white">Aprobación</div>
      </div>
    </div>
  );
}
