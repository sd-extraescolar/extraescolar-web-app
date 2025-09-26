// Custom Tailwind utility for 1030px breakpoint
import { CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from '@/hooks/useAuth';
import { useGoogleCourseWork } from '@/hooks/useGoogleCourseWork';
import { useEffect } from 'react';
import { AssignmentStats } from "./AssignmentStats";
import { ChartsSection } from "./ChartsSection";
import "./grade-management.custom.css";
import { StatsCards } from "./StatsCards";
import { StudentList } from "./StudentList.tsx";
import { useGradeManagementData } from "./useGradeManagementData";
// import { useGoogleSubmissions } from '@/hooks/useGoogleSubmissions';
import { useAllCoursesData } from '@/hooks/useAllCoursesData';
import { useGoogleRoster } from '@/hooks/useGoogleRoster';
import { useAllGoogleSubmissions } from './useAllGoogleSubmissions';
import { useGradeStats } from './useGradeStats';

// Función helper para formatear fechas de Google Classroom
const formatDueDate = (dueDate: any): string => {
	if (!dueDate) return '';
	
	try {
		// Si es un objeto con propiedades de fecha (formato Google Classroom)
		if (typeof dueDate === 'object' && dueDate.year) {
			const day = dueDate.day?.toString().padStart(2, '0') || '01';
			const month = dueDate.month?.toString().padStart(2, '0') || '01';
			const year = dueDate.year;
			return `${day}/${month}/${year}`;
		}
		
		// Si es una cadena o timestamp
		const date = new Date(dueDate);
		if (isNaN(date.getTime())) {
			return dueDate.toString();
		}
		
		return date.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	} catch (error) {
		return dueDate.toString();
	}
};

export function GradeManagement() {

	const { courses, selectedCourse } = useAuth();
	const { courseWork, loading: loadingCourseWork, error: errorCourseWork } = useGoogleCourseWork(selectedCourse?.id);
	// Usar tareas reales de Google Classroom
	const assignments = courseWork || [];

	const {
		selectedAssignment,
		setSelectedAssignment,
		searchTerm,
		handleSendNotification,
		getGradeColor
	} = useGradeManagementData();

	// Traer submissions de todas las tareas del curso
	const { allSubmissions, loading: loadingSubmissions, error: errorSubmissions } = useAllGoogleSubmissions(selectedCourse?.id, assignments);
	
	// Obtener la lista de estudiantes del curso (roster)
	const { students: rosterStudents } = useGoogleRoster(selectedCourse?.id);

	// Sincronizar selectedAssignment con tareas reales
	useEffect(() => {
		if (assignments.length > 0 && (!selectedAssignment || !assignments.some(a => a.id === selectedAssignment))) {
			setSelectedAssignment(assignments[0].id);
		}
	}, [assignments, selectedAssignment, setSelectedAssignment]);


	const {
		totalEntregas,
		totalPendientes,
		promedio,
		porcentajeAprobados,
		mappedStudents,
		realDonutData,
		realBarTareaData,
		realBarCelulaData,
		assignmentStats,
	} = useGradeStats({
		courses,
		assignments,
		allSubmissions,
		selectedAssignmentId: selectedAssignment,
		rosterStudents,
	});

	// Obtener datos globales de todos los cursos
	const { barCelulaData: globalBarCelulaData } = useAllCoursesData();

	const assignment = assignments.find((a: any) => a.id === selectedAssignment);

	// Mostrar spinner de carga cuando está cargando
	if (loadingCourseWork) {
		return (
			<LoadingScreen 
				title="Cargando tareas..."
				subtitle="Obteniendo información de Google Classroom"
				spinnerSize="md"
				spinnerColor="purple"
			/>
		);
	}

	// Mostrar mensaje de pantalla completa cuando no hay tareas
	if (!loadingCourseWork && !errorCourseWork && assignments.length === 0) {
		return (
			<EmptyState 
				title="Todavía no tenés tareas"
				subtitle="Creá una para empezar a visualizar estadísticas"
				iconSize="lg"
			/>
		);
	}

	return (
		<div>
			   <StatsCards
				   totalEntregas={totalEntregas}
				   totalPendientes={totalPendientes}
				   promedio={promedio}
				   porcentajeAprobados={porcentajeAprobados}
			   />
			{/* Gráficos de seguimiento */}
			   <ChartsSection donutData={realDonutData} barTareaData={realBarTareaData} barCelulaData={realBarCelulaData} globalBarCelulaData={globalBarCelulaData} />
			{/* Card de tareas y detalles */}
			<div className="mb-8 bg-blue-50 rounded-xl p-6">
				<h3 className="text-xl font-bold text-black mb-4">Tareas</h3>
				{/* Carousel de tareas reales */}
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
																	{assignment.dueDate ? `Vence: ${formatDueDate(assignment.dueDate)}` : ''}
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
										   submittedCount={assignmentStats.submittedCount}
										   totalStudents={assignmentStats.totalStudents}
										   averageGrade={assignmentStats.averageGrade}
										   passRate={assignmentStats.passRate}
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
