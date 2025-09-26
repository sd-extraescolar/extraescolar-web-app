import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Award,
    BookOpen,
    Download,
    Edit,
    Filter,
    Plus,
    Search,
    Trash2,
    TrendingUp
} from "lucide-react";
import { useState } from "react";

interface Grade {
  id: string;
  studentName: string;
  studentEmail: string;
  course: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  date: string;
  status: 'graded' | 'pending' | 'late';
}

interface Course {
  id: string;
  name: string;
  studentCount: number;
  averageGrade: number;
  totalAssignments: number;
}

export const NotasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock data - en el futuro esto vendrá de la API
  const courses: Course[] = [
    {
      id: '1',
      name: 'Matemáticas',
      studentCount: 25,
      averageGrade: 8.5,
      totalAssignments: 12
    },
    {
      id: '2',
      name: 'Historia',
      studentCount: 22,
      averageGrade: 7.8,
      totalAssignments: 8
    },
    {
      id: '3',
      name: 'Ciencias',
      studentCount: 28,
      averageGrade: 8.2,
      totalAssignments: 15
    }
  ];

  const grades: Grade[] = [
    {
      id: '1',
      studentName: 'Ana García',
      studentEmail: 'ana.garcia@estudiante.com',
      course: 'Matemáticas',
      assignment: 'Examen Parcial',
      grade: 9.5,
      maxGrade: 10,
      date: '2024-01-15',
      status: 'graded'
    },
    {
      id: '2',
      studentName: 'Carlos López',
      studentEmail: 'carlos.lopez@estudiante.com',
      course: 'Historia',
      assignment: 'Ensayo',
      grade: 0,
      maxGrade: 10,
      date: '2024-01-20',
      status: 'pending'
    },
    {
      id: '3',
      studentName: 'María Rodríguez',
      studentEmail: 'maria.rodriguez@estudiante.com',
      course: 'Ciencias',
      assignment: 'Laboratorio',
      grade: 8.0,
      maxGrade: 10,
      date: '2024-01-18',
      status: 'graded'
    }
  ];

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || grade.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'late':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'graded':
        return 'Calificado';
      case 'pending':
        return 'Pendiente';
      case 'late':
        return 'Atrasado';
      default:
        return 'Sin estado';
    }
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Notas</h1>
        <p className="text-gray-600 mt-2">
          Administra las calificaciones de tus estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calificaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.status === 'graded').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {grades.filter(g => g.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-purple-600">
                  {courses.reduce((acc, course) => acc + course.averageGrade, 0) / courses.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <CardDescription>
                {course.studentCount} estudiantes • {course.totalAssignments} tareas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Promedio del curso:</span>
                  <span className={`font-semibold ${getGradeColor(course.averageGrade, 10)}`}>
                    {course.averageGrade}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-education-green-500 to-digital-blue-500 h-2 rounded-full"
                    style={{ width: `${(course.averageGrade / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grades Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calificaciones</CardTitle>
              <CardDescription>
                Gestiona las notas de tus estudiantes
              </CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Calificación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar estudiante o tarea..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-education-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-education-green-500 focus:border-transparent"
              >
                <option value="all">Todos los cursos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
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

          {/* Grades Table */}
          <div className="space-y-3">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-education-green-500 to-digital-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {grade.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{grade.studentName}</h3>
                    <p className="text-sm text-gray-500">{grade.studentEmail}</p>
                    <p className="text-sm text-gray-600">{grade.course} • {grade.assignment}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Calificación</p>
                    <p className={`text-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                      {grade.grade}/{grade.maxGrade}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(grade.status)}`}>
                      {getStatusText(grade.status)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
