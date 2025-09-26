// Custom Tailwind utility for 1030px breakpoint
import "./grade-management.custom.css";
import { StudentList } from "./StudentList.tsx";
import { StatsCards } from "./StatsCards";
import { ChartsSection } from "./ChartsSection";
import { AssignmentStats } from "./AssignmentStats";
import { useGradeManagementData } from "./useGradeManagementData";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GradeManagement() {

	const {
		donutData,
		barTareaData,
		barCelulaData,
		mockAssignments,
		selectedAssignment,
		setSelectedAssignment,
		searchTerm,
		handleSendNotification,
		getGradeColor
	} = useGradeManagementData();

	const assignment = mockAssignments.find((a: any) => a.id === selectedAssignment);

		return (
			   <div className="p-0 bg-white min-h-screen">
				{/* Título principal */}
				<div className="mb-6">
					<h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Notas</h2>
					<p className="text-muted-foreground">Administra las calificaciones de tus estudiantes</p>
				</div>
				{/* Stats Cards */}
				<StatsCards totalCursos={3} calificaciones={65} pendientes={7} promedio={8.17} solidColors />
				{/* Gráficos de seguimiento */}
				<ChartsSection donutData={donutData} barTareaData={barTareaData} barCelulaData={barCelulaData} />
				   {/* Card de tareas y detalles */}
				   <div className="mb-8 bg-blue-50 rounded-xl p-6">
					   <h3 className="text-xl font-bold text-black mb-4">Tareas</h3>
					   {/* Carousel de tareas */}
					   <div className="relative mb-6">
						   <div className="w-full">
							   <Carousel opts={{ slidesToScroll: 1, align: 'start' }}>
								   <CarouselContent>
									   {mockAssignments
										   .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.subject.toLowerCase().includes(searchTerm.toLowerCase()))
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
															   <CardTitle className="text-base text-dark-text mb-1">{assignment.title}</CardTitle>
															   <p className="text-xs text-medium-gray mb-2">
																   {assignment.subject} • Vence: {assignment.dueDate}
															   </p>
														   </div>
														   <div className="flex flex-col gap-1">
															   <div className="text-xs font-medium text-dark-text">
																   {assignment.submittedCount}/{assignment.totalStudents} entregados
															   </div>
															   <div className="text-xs text-medium-gray">
																   Promedio: <span className={getGradeColor(assignment.averageGrade)}>{assignment.averageGrade}/10</span>
															   </div>
															   <div className="text-xs font-medium text-education-green-700">{assignment.passRate}% aprobación</div>
															   <Progress value={assignment.passRate} className="w-full h-2 mt-1" />
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
							   <div className="pt-6 px-6 pb-6 bg-light-blue-gray rounded-xl">
								   <AssignmentStats
									   submittedCount={assignment.submittedCount}
									   totalStudents={assignment.totalStudents}
									   averageGrade={assignment.averageGrade}
									   passRate={assignment.passRate}
								   />
								   <div className="mb-3">
									   <h4 className="font-semibold text-dark-text mb-3">Detalles por Estudiante</h4>
								   </div>
								   <StudentList
									   students={assignment.students}
									   assignmentTitle={assignment.title}
									   getGradeColor={getGradeColor}
									   handleSendNotification={handleSendNotification}
								   />
							   </div>
						   </div>
					   )}
				   </div>
			</div>
		);
	}
