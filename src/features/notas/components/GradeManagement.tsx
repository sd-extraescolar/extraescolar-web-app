// Custom Tailwind utility for 1030px breakpoint
import "./grade-management.custom.css";
import { StudentList } from "./StudentList.tsx";
import { StatsCards } from "./StatsCards";
import { ChartsSection } from "./ChartsSection";
import { AssignmentStats } from "./AssignmentStats";
import { useGradeManagementData } from "./useGradeManagementData";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useGoogleCourseWork } from '@/hooks/useGoogleCourseWork';
import { useGoogleSubmissions } from '@/hooks/useGoogleSubmissions';

export function GradeManagement() {
			const { courses, selectedCourse } = useAuth();
			const { courseWork, loading: loadingCourseWork, error: errorCourseWork } = useGoogleCourseWork(selectedCourse?.id);
			const {
				selectedAssignment,
				setSelectedAssignment,
				searchTerm,
				handleSendNotification,
				getGradeColor
			} = useGradeManagementData();
			const { submissions, loading: loadingSubmissions, error: errorSubmissions } = useGoogleSubmissions(selectedCourse?.id, selectedAssignment);

		// Usar tareas reales de Google Classroom
		const assignments = courseWork || [];
		const assignment = assignments.find((a: any) => a.id === selectedAssignment);

		// Sincronizar selectedAssignment con tareas reales
		useEffect(() => {
			if (assignments.length > 0 && (!selectedAssignment || !assignments.some(a => a.id === selectedAssignment))) {
				setSelectedAssignment(assignments[0].id);
			}
		}, [assignments, selectedAssignment, setSelectedAssignment]);

		// Calcular stats globales para las cards
		const totalCursos = courses.length;
		const totalTareas = assignments.length;
		const totalEntregas = assignments.reduce((acc, a) => acc + (a.submissionCount || 0), 0);
		const totalPendientes = assignments.reduce((acc, a) => acc + ((a.assignedCount || 0) - (a.submissionCount || 0)), 0);
		const allGrades = assignments.flatMap(a => a.maxPoints ? [a.maxPoints] : []);
		const promedio = allGrades.length ? Number((allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)) : 0;
		const aprobacion = 0; // No hay info de aprobados global, se puede calcular si hay grades reales



		// Mapear submissions a estructura de estudiantes
		const mappedStudents = submissions.map(s => ({
			id: s.userId,
			name: s.userId, // Si tienes acceso a nombres reales, cámbialo aquí
			email: '', // Si tienes acceso a emails reales, cámbialo aquí
			submitted: s.state === 'TURNED_IN' || s.state === 'RETURNED',
			grade: typeof s.assignedGrade === 'number' && typeof assignment?.maxPoints === 'number' && assignment.maxPoints > 0
				? Number(((s.assignedGrade / assignment.maxPoints) * 10).toFixed(2))
				: undefined,
			submissionDate: s.updateTime,
		}));

		// Calcular estados para gráficos (corregida, entregada, pendiente, reclamada)
		let corregida = 0, entregada = 0, pendiente = 0, reclamada = 0;
		mappedStudents.forEach(s => {
			if (s.submitted && typeof s.grade === 'number' && s.grade >= 7) corregida++;
			else if (s.submitted && typeof s.grade === 'number' && s.grade < 7) entregada++;
			else if (s.submitted && typeof s.grade !== 'number') pendiente++;
			else reclamada++;
		});

		const realDonutData = [
			{ name: 'corregida', value: corregida, color: '#34D399' },
			{ name: 'entregada', value: entregada, color: '#60A5FA' },
			{ name: 'comenzada', value: pendiente, color: '#FBBF24' },
			{ name: 'reclamada', value: reclamada, color: '#F87171' },
		];

		const realBarTareaData = assignment ? [{
			name: assignment.title,
			corregida,
			entregada,
			comenzada: pendiente,
			reclamada,
		}] : [];
		const realBarCelulaData = [...realBarTareaData];

		// Calcular aprobación real
		const aprobados = mappedStudents.filter(s => typeof s.grade === 'number' && s.grade >= 7).length;
		const aprobacionReal = mappedStudents.length ? Math.round((aprobados / mappedStudents.length) * 100) : 0;

	useEffect(() => {
		if (assignments.length > 0) {
			console.log('Tareas traídas de la API:', assignments);
		}
	}, [assignments]);

	useEffect(() => {
		if (assignment && submissions && submissions.length > 0) {
			const grades = submissions.map(s => ({
				userId: s.userId,
				assignedGrade: s.assignedGrade,
				maxPoints: assignment.maxPoints,
				gradeEscala10: typeof s.assignedGrade === 'number' && typeof assignment.maxPoints === 'number' && assignment.maxPoints > 0
					? Number(((s.assignedGrade / assignment.maxPoints) * 10).toFixed(2))
					: undefined,
			}));
			console.log('Calificaciones mapeadas:', grades);
		}
	}, [assignment, submissions]);

		return (
			<div>
				<StatsCards
					totalCursos={totalCursos}
					calificaciones={totalEntregas}
					pendientes={totalPendientes}
					promedio={promedio}
				/>
				{/* Gráficos de seguimiento */}
				<ChartsSection donutData={realDonutData} barTareaData={realBarTareaData} barCelulaData={realBarCelulaData} />
				{/* Card de tareas y detalles */}
				<div className="mb-8 bg-blue-50 rounded-xl p-6">
					<h3 className="text-xl font-bold text-black mb-4">Tareas</h3>
					{/* Carousel de tareas reales */}
					{loadingCourseWork && <div>Cargando tareas...</div>}
					{errorCourseWork && <div className="text-red-500">{errorCourseWork}</div>}
					{!loadingCourseWork && !errorCourseWork && (
						<>
							<div className="relative mb-6">
								<div className="w-full">
									<Carousel opts={{ slidesToScroll: 1, align: 'start' }}>
										<CarouselContent>
											{assignments
												.filter(a => a.title?.toLowerCase().includes(searchTerm.toLowerCase()))
												.map((assignment) => (
													<CarouselItem key={assignment.id} className="basis-1/4 min-w-[220px]">
														<div
															className={`transition-colors cursor-pointer h-full rounded-xl shadow-sm 
																bg-purple-100 hover:bg-purple-200
																${selectedAssignment === assignment.id 
																	? 'border-2 border-purple-400 p-[calc(1rem-2px)]' 
																	: 'border border-transparent p-4'}
															`}
															onClick={() => setSelectedAssignment(assignment.id)}
														>
															<div className="flex flex-col gap-2 px-4 py-4 h-full justify-between">
																<div>
																	<CardTitle className="text-base text-purple-800 mb-1">{assignment.title}</CardTitle>
																	<p className="text-xs text-purple-500 mb-2">
																		{assignment.dueDate ? `Vence: ${assignment.dueDate}` : ''}
																	</p>
																</div>
															</div>
														</div>
													</CarouselItem>
												))}
										</CarouselContent>
									</Carousel>
								</div>
							</div>
							{/* Información fija de la tarea seleccionada */}
							{assignment && (
								<div className="rounded-xl">
									<div className="pt-6 px-6 pb-6 rounded-xl">
										<AssignmentStats
											submittedCount={mappedStudents.filter(s => s.submitted).length}
											totalStudents={mappedStudents.length}
											averageGrade={(() => {
												const grades = mappedStudents.map(s => typeof s.grade === 'number' ? s.grade : undefined).filter((g): g is number => typeof g === 'number');
												return grades.length ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)) : 0;
											})()}
											passRate={aprobacionReal}
										/>
										<div className="mb-3">
											<h4 className="font-semibold text-dark-text mb-3">Detalles por Estudiante</h4>
											{loadingSubmissions && <div>Cargando entregas...</div>}
											{errorSubmissions && <div className="text-red-500">{errorSubmissions}</div>}
											{!loadingSubmissions && !errorSubmissions && (
												<StudentList
													students={mappedStudents}
													assignmentTitle={assignment.title}
													getGradeColor={getGradeColor}
													handleSendNotification={handleSendNotification}
												/>
											)}
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		);
}
