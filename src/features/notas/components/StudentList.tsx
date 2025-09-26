import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const pastelEntregada = "bg-[#60A5FA]"; // azul
  const pastelNoEntregada = "bg-yellow-500"; // AMARILLO para no entregada (MÁXIMA PRIORIDAD)
  const pastelSinCalificar = "bg-gray-500"; // gris oscuro para sin calificar


  console.log("students", students)

  return (
    <div className="grid gap-4 custom:grid-cols-2 custom:grid-cols-1">
      {students.map((student) => {
        // Debug: verificar el estado del estudiante
        console.log(`Estudiante ${student.name}: submitted=${student.submitted}, grade=${student.grade}, grade type=${typeof student.grade}`);
        
        // PRIORIDAD UI: 1-Calificados, 2-Entregados sin calificar, 3-Pendientes
        let statusColor = pastelCorregida;
        
        // PRIORIDAD 1: CALIFICADOS (mostrar estado de calificación)
        if (student.submitted && typeof student.grade === 'number') {
          console.log(`  -> CALIFICADO: ${student.name}`);
          if (student.grade >= 70) {
            statusColor = pastelCorregida; // Verde - Aprobado
          } else {
            statusColor = pastelEntregada; // Azul - No aprobado
          }
        } 
        // PRIORIDAD 2: ENTREGADO PERO SIN CALIFICAR (priorizar calificar)
        else if (student.submitted && (student.grade === undefined || student.grade === null)) {
          console.log(`  -> SIN CALIFICAR: ${student.name}`);
          statusColor = pastelSinCalificar; // Gris oscuro - Necesita calificación
        } 
        // PRIORIDAD 3: PENDIENTES (priorizar pendiente)
        else if (!student.submitted) {
          console.log(`  -> PENDIENTE: ${student.name}`);
          statusColor = pastelNoEntregada; // AMARILLO - Necesita entregar
        }
        else {
          console.log(`  -> FALLBACK: ${student.name} - submitted: ${student.submitted}, grade: ${student.grade}`);
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
              </div>
            </div>
            <div className="flex items-center gap-3">
              {student.submitted && typeof student.grade === 'number' ? (
                // PRIORIDAD 1: CALIFICADOS - Mostrar calificación
                <div className="text-right">
                  <div className={`text-lg font-bold ${getGradeColor(student.grade)}`}>
                    {student.grade}/100
                  </div>
                </div>
              ) : student.submitted && (student.grade === undefined || student.grade === null) ? (
                // PRIORIDAD 2: ENTREGADO PERO SIN CALIFICAR - Priorizar calificar
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-400">
                    Sin calificar
                  </div>
                </div>
              ) : !student.submitted ? (
                // PRIORIDAD 3: PENDIENTES - Priorizar pendiente
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleSendNotification(student.email, assignmentTitle)}
                  className="bg-progress-yellow-500 hover:bg-progress-yellow-600 text-white border-none"
                  title="Notificar - Pendiente de entrega"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              ) : (
                // Fallback para casos no contemplados
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-400">
                    Sin información
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
