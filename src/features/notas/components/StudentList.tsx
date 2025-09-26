import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  submitted: boolean;
  grade?: number;
  submissionDate?: string;
}

interface StudentListProps {
  students: Student[];
  assignmentTitle: string;
  getGradeColor: (grade: number) => string;
  handleSendNotification: (email: string, assignmentTitle: string) => void;
}

export function StudentList({ students, assignmentTitle, getGradeColor, handleSendNotification }: StudentListProps) {
  // Colores pastel oscuros para los estados, igual que los gráficos
  const pastelCorregida = "bg-[#34D399]"; // verde
  const pastelComenzada = "bg-[#FBBF24]"; // amarillo
  const pastelEntregada = "bg-[#60A5FA]"; // azul
  const pastelReclamada = "bg-[#F87171]"; // rojo

  return (
    <div className="grid gap-4 custom:grid-cols-2 custom:grid-cols-1">
      {students.map((student) => {
        // Estado: corregida (verde), entregada (azul), comenzada (amarillo), no entregada (rojo)
        let statusColor = pastelCorregida;
        if (!student.submitted) {
          statusColor = pastelReclamada;
        } else if (student.grade === undefined) {
          statusColor = pastelComenzada;
        } else if (student.grade !== undefined && student.grade < 7) {
          statusColor = pastelEntregada;
        }
        return (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg relative overflow-hidden"
          >
            <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-lg ${statusColor}`}></div>
            <div className="flex items-center gap-3 ml-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-education-green-500 text-white">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-dark-text">{student.name}</div>
                <div className="text-sm text-medium-gray">{student.email}</div>
                {student.submissionDate && (
                  <div className="text-xs text-medium-gray">
                    Entregado: {student.submissionDate}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {student.submitted ? (
                <div className="text-right">
                  <div className={`text-lg font-bold ${getGradeColor(student.grade!)}`}>
                    {student.grade}/10
                  </div>
                </div>
              ) : (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleSendNotification(student.email, assignmentTitle)}
                  className="bg-progress-yellow-500 hover:bg-progress-yellow-600 text-white border-none"
                  title="Notificar"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
