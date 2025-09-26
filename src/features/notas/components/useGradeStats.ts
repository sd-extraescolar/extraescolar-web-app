// import { useMemo } from 'react';

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
  rosterStudents = [],
}: {
  courses: any[];
  assignments: Assignment[];
  allSubmissions: AllSubmissions;
  selectedAssignmentId?: string;
  rosterStudents?: Array<{ id: string; name: string; email: string; photoUrl?: string }>;
}) {
  // Global stats - calculadas a partir de datos reales
  const totalCursos = courses.length;
  const totalTareas = assignments.length;
  
  // Calcular entregas totales basadas en submissions reales
  const totalEntregas = Object.values(allSubmissions || {}).reduce((acc, submissions) => {
    return acc + submissions.filter(s => s.state === 'TURNED_IN' || s.state === 'RETURNED' || s.state === 'CREATED').length;
  }, 0);
  
  // Calcular pendientes basados en estudiantes del roster vs entregas
  const totalEstudiantes = rosterStudents.length;
  const totalPendientes = (totalEstudiantes * totalTareas) - totalEntregas;
  
  // Calcular promedio de todas las calificaciones reales (convertir a escala 0-100)
  const todasLasCalificaciones = Object.values(allSubmissions || {}).flatMap(submissions => 
    submissions
      .filter(s => s.assignedGrade !== undefined && s.assignedGrade !== null)
      .map(s => {
        const assignment = assignments.find(a => allSubmissions[a.id]?.includes(s));
        if (assignment?.maxPoints && assignment.maxPoints > 0) {
          return Math.round((s.assignedGrade! / assignment.maxPoints) * 100);
        }
        return 0;
      })
  );
  
  const promedio = todasLasCalificaciones.length > 0 
    ? Number((todasLasCalificaciones.reduce((a, b) => (a || 0) + (b || 0), 0) / todasLasCalificaciones.length).toFixed(2))
    : 0;
  
  // Calcular % de aprobados basado en calificaciones reales
  const calificacionesAprobadas = todasLasCalificaciones ? todasLasCalificaciones.filter(grade => (grade || 0) >= 70).length : 0;
  const porcentajeAprobados = todasLasCalificaciones && todasLasCalificaciones.length > 0 
    ? Math.round((calificacionesAprobadas / todasLasCalificaciones.length) * 100)
    : 0;


  // Per-assignment stats for all assignments
  const perAssignmentStats = assignments.map(assignment => {
    console.log(`\n=== PROCESANDO TAREA: ${assignment.title} ===`);
    console.log('Assignment:', assignment);
    
    const assignmentSubmissions = allSubmissions[assignment.id] || [];
    console.log('Assignment submissions:', assignmentSubmissions);
    console.log('Roster students:', rosterStudents);
    
    // Crear lista de todos los estudiantes del roster, incluyendo los que no entregaron
    const students: Student[] = rosterStudents.map(rosterStudent => {
      // Buscar si este estudiante tiene una submission para esta tarea
      const submission = assignmentSubmissions.find(s => s.userId === rosterStudent.id);
      
      const studentData = {
        id: rosterStudent.id,
        name: rosterStudent.name,
        email: rosterStudent.email || '',
        avatar: rosterStudent.photoUrl,
        submitted: submission ? (submission.state === 'TURNED_IN' || submission.state === 'RETURNED' || submission.state === 'CREATED') : false,
        grade: submission && typeof submission.assignedGrade === 'number' && typeof assignment?.maxPoints === 'number' && assignment.maxPoints > 0
          ? Number(((submission.assignedGrade / assignment.maxPoints) * 100).toFixed(2))
          : undefined,
        submissionDate: submission?.updateTime,
      };
      
      console.log(`\n--- ESTUDIANTE: ${studentData.name} ---`);
      console.log('Roster student:', rosterStudent);
      console.log('Submission found:', submission);
      console.log('Student data:', studentData);
      console.log(`Estado: submitted=${studentData.submitted}, grade=${studentData.grade}, grade type=${typeof studentData.grade}`);
      if (submission) {
        console.log(`Submission state: ${submission.state}`);
        console.log(`Assigned grade: ${submission.assignedGrade}`);
        console.log(`Assigned grade type: ${typeof submission.assignedGrade}`);
        console.log(`Assigned grade === null: ${submission.assignedGrade === null}`);
        console.log(`Assigned grade === undefined: ${submission.assignedGrade === undefined}`);
      }
      console.log(`Max points: ${assignment?.maxPoints}`);
      
      return studentData;
    });
    let corregida = 0, entregada = 0, comenzada = 0, reclamada = 0;
    students.forEach(s => {
      // NUEVA LÓGICA:
      // "corregida" (verde): entregó Y tiene nota
      if (s.submitted && typeof s.grade === 'number') {
        corregida++;
      }
      // "entregada" (azul): entregó PERO NO tiene nota
      else if (s.submitted && (s.grade === undefined || s.grade === null)) {
        entregada++;
      }
      // "comenzada" (amarillo): NO entregó Y NO tiene nota
      else if (!s.submitted && (s.grade === undefined || s.grade === null)) {
        comenzada++;
      }
      // "reclamada" (rojo): casos especiales
      else {
        reclamada++;
      }
    });
    const aprobados = students.filter(s => typeof s.grade === 'number' && s.grade >= 70).length;
    const aprobacionReal = students.length ? Math.round((aprobados / students.length) * 100) : 0;
    return {
      assignment,
      students,
      corregida,
      entregada,
      comenzada, // Cambiado de pendiente a comenzada
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
    acc.comenzada += stat.comenzada; // Cambiado de stat.pendiente a stat.comenzada
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
    comenzada: stat.comenzada, // Cambiado de stat.pendiente a stat.comenzada
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
    porcentajeAprobados,
    mappedStudents,
    realDonutData,
    realBarTareaData,
    realBarCelulaData,
    aprobacionReal,
    assignmentStats,
  };
}
