import { useState } from "react"

export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  submitted: boolean
  grade?: number
  submissionDate?: string
}

export interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  totalStudents: number
  submittedCount: number
  averageGrade: number
  passRate: number
  students: Student[]
}

export function useGradeManagementData() {
  const mockAssignments: Assignment[] = [
    {
      id: "1",
      title: "Examen Parcial - Álgebra Lineal",
      subject: "Matemáticas",
      dueDate: "2024-03-15",
      totalStudents: 25,
      submittedCount: 22,
      averageGrade: 8.5,
      passRate: 88,
      students: [
        {
          id: "1",
          name: "Ana García",
          email: "ana.garcia@estudiante.com",
          submitted: true,
          grade: 9.5,
          submissionDate: "2024-03-14",
        },
        { id: "2", name: "Carlos López", email: "carlos.lopez@estudiante.com", submitted: false },
        {
          id: "3",
          name: "María Rodríguez",
          email: "maria.rodriguez@estudiante.com",
          submitted: true,
          grade: 8.2,
          submissionDate: "2024-03-15",
        },
        {
          id: "4",
          name: "Juan Pérez",
          email: "juan.perez@estudiante.com",
          submitted: true,
          grade: 7.8,
          submissionDate: "2024-03-13",
        },
        { id: "5", name: "Laura Martín", email: "laura.martin@estudiante.com", submitted: false },
      ],
    },
    {
      id: "2",
      title: "Ensayo - Revolución Industrial",
      subject: "Historia",
      dueDate: "2024-03-20",
      totalStudents: 22,
      submittedCount: 18,
      averageGrade: 7.8,
      passRate: 82,
      students: [
        {
          id: "6",
          name: "Pedro Sánchez",
          email: "pedro.sanchez@estudiante.com",
          submitted: true,
          grade: 8.5,
          submissionDate: "2024-03-19",
        },
        {
          id: "7",
          name: "Isabel Torres",
          email: "isabel.torres@estudiante.com",
          submitted: true,
          grade: 9.0,
          submissionDate: "2024-03-18",
        },
        { id: "8", name: "Diego Ruiz", email: "diego.ruiz@estudiante.com", submitted: false },
      ],
    },
    {
      id: "3",
      title: "Laboratorio - Reacciones Químicas",
      subject: "Ciencias",
      dueDate: "2024-03-25",
      totalStudents: 28,
      submittedCount: 25,
      averageGrade: 8.2,
      passRate: 89,
      students: [
        {
          id: "9",
          name: "Carmen Vega",
          email: "carmen.vega@estudiante.com",
          submitted: true,
          grade: 8.8,
          submissionDate: "2024-03-24",
        },
        { id: "10", name: "Roberto Silva", email: "roberto.silva@estudiante.com", submitted: false },
      ],
    },
  ];

  // Paleta pastel más oscura y unificada para todos los gráficos
  const pastelCorregida = "#34D399"; // education-green-400
  const pastelComenzada = "#FBBF24"; // progress-yellow-400
  const pastelEntregada = "#60A5FA"; // digital-blue-400
  const pastelReclamada = "#F87171"; // alert-red-400

  const donutData = [
    { name: "reclamada", value: 3, color: pastelReclamada },
    { name: "entregada", value: 2, color: pastelEntregada },
    { name: "corregida", value: 16, color: pastelCorregida },
    { name: "comenzada", value: 4, color: pastelComenzada },
  ];
  const barTareaData = [
    { name: "tarea_9", corregida: 10, comenzada: 2, entregada: 3, reclamada: 1 },
    { name: "tarea_8", corregida: 9, comenzada: 3, entregada: 4, reclamada: 2 },
    { name: "tarea_7", corregida: 8, comenzada: 4, entregada: 5, reclamada: 1 },
    { name: "tarea_6", corregida: 7, comenzada: 5, entregada: 6, reclamada: 2 },
    { name: "tarea_5", corregida: 6, comenzada: 6, entregada: 7, reclamada: 1 },
  ];
  const barCelulaData = [
    { name: "MKT_9", corregida: 10, comenzada: 2, entregada: 3, reclamada: 1 },
    { name: "MKT_8", corregida: 9, comenzada: 3, entregada: 4, reclamada: 2 },
    { name: "MKT_7", corregida: 8, comenzada: 4, entregada: 5, reclamada: 1 },
    { name: "MKT_6", corregida: 7, comenzada: 5, entregada: 6, reclamada: 2 },
    { name: "MKT_5", corregida: 6, comenzada: 6, entregada: 7, reclamada: 1 },
  ];


  const [selectedAssignment, setSelectedAssignment] = useState<string>(mockAssignments[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendNotification = async (studentEmail: string, assignmentTitle: string) => {
    // Simulate sending email notification
    // Here you would integrate with your email service
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return {
    donutData,
    barTareaData,
    barCelulaData,
    mockAssignments,
    selectedAssignment,
    setSelectedAssignment,
    searchTerm,
    setSearchTerm,
    handleSendNotification,
    getGradeColor,
  };
}
