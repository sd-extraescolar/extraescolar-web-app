import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CheckCircle,
    Clock,
    Download,
    Filter,
    Search,
    Users,
    XCircle
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  attendance: number;
  totalClasses: number;
  status: 'present' | 'absent' | 'late';
  lastAttendance: string;
}

export const PresencialidadPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - en el futuro esto vendrá de la API
  const students: Student[] = [
    {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@estudiante.com',
      attendance: 18,
      totalClasses: 20,
      status: 'present',
      lastAttendance: '2024-01-15'
    },
    {
      id: '2',
      name: 'Carlos López',
      email: 'carlos.lopez@estudiante.com',
      attendance: 15,
      totalClasses: 20,
      status: 'absent',
      lastAttendance: '2024-01-12'
    },
    {
      id: '3',
      name: 'María Rodríguez',
      email: 'maria.rodriguez@estudiante.com',
      attendance: 19,
      totalClasses: 20,
      status: 'late',
      lastAttendance: '2024-01-15'
    },
    {
      id: '4',
      name: 'José Martínez',
      email: 'jose.martinez@estudiante.com',
      attendance: 17,
      totalClasses: 20,
      status: 'present',
      lastAttendance: '2024-01-15'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Tardanza';
      default:
        return 'Sin registrar';
    }
  };

  const getAttendancePercentage = (attendance: number, total: number) => {
    return Math.round((attendance / total) * 100);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Control de Presencialidad</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la asistencia de tus estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Presentes Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'present').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausentes</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.status === 'absent').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tardanzas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => s.status === 'late').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Asistencia</CardTitle>
          <CardDescription>
            Controla y registra la asistencia de tus estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-education-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-education-green-500 focus:border-transparent"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const percentage = getAttendancePercentage(student.attendance, student.totalClasses);
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-education-green-500 to-digital-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Asistencia</p>
                      <p className={`text-sm font-medium px-2 py-1 rounded-full ${getAttendanceColor(percentage)}`}>
                        {percentage}%
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(student.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(student.status)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Marcar
                      </Button>
                      <Button size="sm" variant="outline">
                        Ver Historial
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
