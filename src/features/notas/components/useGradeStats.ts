import { useMemo } from 'react';

interface Assignment {
  id: string;
  title: string;
  dueDate?: string;
  maxPoints?: number;
  submissionCount?: number;
  assignedCount?: number;
}

interface Submission {
  userId: string;
  state: string;
  assignedGrade?: number;
  updateTime?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  submitted: boolean;
  grade?: number;
  submissionDate?: string;
}

interface AllSubmissions {
  [assignmentId: string]: Submission[];
}

export function useGradeStats({
  courses = [],
  assignments = [],
  allSubmissions = {},
  selectedAssignmentId,
}: {
  courses: any[];
  assignments: Assignment[];
  allSubmissions: AllSubmissions;
  selectedAssignmentId?: string;
}) {
  // Global stats
  const totalCursos = courses.length;
  const totalTareas = assignments.length;
  const totalEntregas = assignments.reduce((acc, a) => acc + (a.submissionCount || 0), 0);
  const totalPendientes = assignments.reduce((acc, a) => acc + ((a.assignedCount || 0) - (a.submissionCount || 0)), 0);
  const allGrades = assignments.flatMap(a => a.maxPoints ? [a.maxPoints] : []);
  const promedio = allGrades.length ? Number((allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)) : 0;


  // Per-assignment stats for all assignments
  const perAssignmentStats = assignments.map(assignment => {
    const assignmentSubmissions = allSubmissions[assignment.id] || [];
    const students: Student[] = assignmentSubmissions.map(s => ({
      id: s.userId,
      name: s.userId,
      email: '',
      submitted: s.state === 'TURNED_IN' || s.state === 'RETURNED',
      grade: typeof s.assignedGrade === 'number' && typeof assignment?.maxPoints === 'number' && assignment.maxPoints > 0
        ? Number(((s.assignedGrade / assignment.maxPoints) * 10).toFixed(2))
        : undefined,
      submissionDate: s.updateTime,
    }));
    let corregida = 0, entregada = 0, pendiente = 0, reclamada = 0;
    students.forEach(s => {
      if (s.submitted && typeof s.grade === 'number' && s.grade >= 7) corregida++;
      else if (s.submitted && typeof s.grade === 'number' && s.grade < 7) entregada++;
      else if (s.submitted && typeof s.grade !== 'number') pendiente++;
      else reclamada++;
    });
    const aprobados = students.filter(s => typeof s.grade === 'number' && s.grade >= 7).length;
    const aprobacionReal = students.length ? Math.round((aprobados / students.length) * 100) : 0;
    return {
      assignment,
      students,
      corregida,
      entregada,
      pendiente,
      reclamada,
      aprobacionReal,
      submittedCount: students.filter(s => s.submitted).length,
      totalStudents: students.length,
      averageGrade: (() => {
        const grades = students.map(s => typeof s.grade === 'number' ? s.grade : undefined).filter((g): g is number => typeof g === 'number');
        return grades.length ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)) : 0;
      })(),
      passRate: aprobacionReal,
    };
  });

  // For donut: sum all assignments' states
  const donutTotals = perAssignmentStats.reduce((acc, stat) => {
    acc.corregida += stat.corregida;
    acc.entregada += stat.entregada;
    acc.comenzada += stat.pendiente;
    acc.reclamada += stat.reclamada;
    return acc;
  }, { corregida: 0, entregada: 0, comenzada: 0, reclamada: 0 });

  const realDonutData = [
    { name: 'corregida', value: donutTotals.corregida, color: '#34D399' },
    { name: 'entregada', value: donutTotals.entregada, color: '#60A5FA' },
    { name: 'comenzada', value: donutTotals.comenzada, color: '#FBBF24' },
    { name: 'reclamada', value: donutTotals.reclamada, color: '#F87171' },
  ];

  // For bar charts: one entry per assignment
  const realBarTareaData = perAssignmentStats.map(stat => ({
    name: stat.assignment.title,
    corregida: stat.corregida,
    entregada: stat.entregada,
    comenzada: stat.pendiente,
    reclamada: stat.reclamada,
  }));
  const realBarCelulaData = [...realBarTareaData];

  // For selected assignment, get mapped students and stats
  const selectedAssignmentStats = perAssignmentStats.find(stat => stat.assignment.id === selectedAssignmentId);
  const mappedStudents = selectedAssignmentStats ? selectedAssignmentStats.students : [];
  const assignmentStats = selectedAssignmentStats ? {
    submittedCount: selectedAssignmentStats.submittedCount,
    totalStudents: selectedAssignmentStats.totalStudents,
    averageGrade: selectedAssignmentStats.averageGrade,
    passRate: selectedAssignmentStats.passRate,
  } : {
    submittedCount: 0,
    totalStudents: 0,
    averageGrade: 0,
    passRate: 0,
  };
  const aprobacionReal = selectedAssignmentStats ? selectedAssignmentStats.aprobacionReal : 0;

  return {
    totalCursos,
    totalTareas,
    totalEntregas,
    totalPendientes,
    promedio,
    mappedStudents,
    realDonutData,
    realBarTareaData,
    realBarCelulaData,
    aprobacionReal,
    assignmentStats,
  };
}
