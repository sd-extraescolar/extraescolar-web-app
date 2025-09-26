import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// Custom Tailwind utility for 1030px breakpoint
import "./grade-management.custom.css";
// Adaptación directa del componente GradeManagement para la app Extraescolar
// Copiado desde grade-management/components/grade-management.tsx

"use client"

import { useState } from "react"
import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"
import {
	Search,
	Mail,
	BookOpen,
	TrendingUp,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react"

interface Student {
	id: string
	name: string
	email: string
	avatar?: string
	submitted: boolean
	grade?: number
	submissionDate?: string
}

interface Assignment {
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
]

export function GradeManagement() {

	// Datos de ejemplo para los gráficos
			const donutData = [
				{ name: "reclamada", value: 3, color: "#E74C3C" }, // alert-red-500
				{ name: "entregada", value: 2, color: "#3498DB" }, // digital-blue-500
				{ name: "corregida", value: 16, color: "#2ECC71" }, // education-green-500
				{ name: "comenzada", value: 4, color: "#F1C40F" }, // progress-yellow-500
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

		const [selectedAssignment, setSelectedAssignment] = useState<string>(mockAssignments[0]?.id || "")
		const [searchTerm, setSearchTerm] = useState("")

	const handleSendNotification = async (studentEmail: string, assignmentTitle: string) => {
		// Simulate sending email notification
		console.log(`Sending notification to ${studentEmail} for ${assignmentTitle}`)
		// Here you would integrate with your email service
	}

	const getGradeColor = (grade: number) => {
		if (grade >= 9) return "text-success"
		if (grade >= 7) return "text-warning"
		return "text-destructive"
	}

	const getStatusBadge = (submitted: boolean, grade?: number) => {
		if (!submitted) {
			return (
				<Badge variant="destructive" className="gap-1">
					<XCircle className="w-3 h-3" />
					No Entregado
				</Badge>
			)
		}
		if (grade && grade >= 7) {
			return (
				<Badge variant="default" className="gap-1 bg-success text-success-foreground">
					<CheckCircle className="w-3 h-3" />
					Aprobado
				</Badge>
			)
		}
		return (
			<Badge variant="secondary" className="gap-1">
				<Clock className="w-3 h-3" />
				Reprobado
			</Badge>
		)
	}

			return (
					<div className="p-0 bg-white min-h-screen">
						{/* Título principal */}
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Notas</h2>
							<p className="text-muted-foreground">Administra las calificaciones de tus estudiantes</p>
						</div>
						{/* Gráficos de seguimiento */}
						<div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-white rounded-xl p-6 shadow-sm">
							<h3 className="text-xl font-bold mb-2">Entregas totales</h3>
							<ResponsiveContainer width="100%" height={250}>
								<PieChart>
													<Pie
														data={donutData}
														dataKey="value"
														nameKey="name"
														cx="50%"
														cy="50%"
														innerRadius={60}
														outerRadius={90}
														paddingAngle={2}
														label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
													>
														{donutData.map((entry, idx) => (
															<Cell key={`cell-${idx}`} fill={entry.color} />
														))}
													</Pie>
									<Tooltip />
									<Legend verticalAlign="bottom" />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="bg-white rounded-xl p-6 shadow-sm">
							<h3 className="text-xl font-bold mb-2">Entregas por tarea</h3>
							<ResponsiveContainer width="100%" height={250}>
								<BarChart data={barTareaData} layout="vertical" margin={{ left: 30, right: 10, top: 10, bottom: 10 }}>
									<XAxis type="number" hide domain={[0, 'dataMax']} />
									<YAxis dataKey="name" type="category" width={80} />
									<Tooltip />
									<Legend verticalAlign="top" />
									<Bar dataKey="corregida" stackId="a" fill="#2ECC71" name="corregida" />
									<Bar dataKey="comenzada" stackId="a" fill="#F1C40F" name="comenzada" />
									<Bar dataKey="entregada" stackId="a" fill="#3498DB" name="entregada" />
									<Bar dataKey="reclamada" stackId="a" fill="#E74C3C" name="reclamada" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
					<div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
						<h3 className="text-xl font-bold mb-2">Entregas por célula</h3>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={barCelulaData} layout="vertical" margin={{ left: 30, right: 10, top: 10, bottom: 10 }}>
								<XAxis type="number" hide domain={[0, 'dataMax']} />
								<YAxis dataKey="name" type="category" width={80} />
								<Tooltip />
								<Legend verticalAlign="top" />
								<Bar dataKey="corregida" stackId="a" fill="#2ECC71" name="corregida" />
								<Bar dataKey="comenzada" stackId="a" fill="#F1C40F" name="comenzada" />
								<Bar dataKey="entregada" stackId="a" fill="#3498DB" name="entregada" />
								<Bar dataKey="reclamada" stackId="a" fill="#E74C3C" name="reclamada" />
							</BarChart>
						</ResponsiveContainer>
					</div>


				{/* Stats Cards */}
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
									<div className="bg-education-green-50 rounded-xl p-6">
										<div className="flex flex-row items-center justify-between space-y-0 pb-2">
											<span className="text-sm font-medium text-education-green-700">Total Cursos</span>
											<BookOpen className="h-4 w-4 text-education-green-500" />
										</div>
										<div className="text-2xl font-bold text-education-green-700">3</div>
									</div>
									<div className="bg-digital-blue-50 rounded-xl p-6">
										<div className="flex flex-row items-center justify-between space-y-0 pb-2">
											<span className="text-sm font-medium text-digital-blue-700">Calificaciones</span>
											<CheckCircle className="h-4 w-4 text-education-green-500" />
										</div>
										<div className="text-2xl font-bold text-education-green-700">65</div>
									</div>
									<div className="bg-progress-yellow-50 rounded-xl p-6">
										<div className="flex flex-row items-center justify-between space-y-0 pb-2">
											<span className="text-sm font-medium text-progress-yellow-700">Pendientes</span>
											<Clock className="h-4 w-4 text-progress-yellow-500" />
										</div>
										<div className="text-2xl font-bold text-progress-yellow-700">7</div>
									</div>
									<div className="bg-light-gray rounded-xl p-6">
										<div className="flex flex-row items-center justify-between space-y-0 pb-2">
											<span className="text-sm font-medium text-digital-blue-700">Promedio General</span>
											<TrendingUp className="h-4 w-4 text-digital-blue-500" />
										</div>
										<div className="text-2xl font-bold text-digital-blue-700">8.17</div>
									</div>
								</div>

				{/* Search and Filters */}
				<div className="mb-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Buscar estudiante o tarea..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 bg-input border-border text-foreground"
						/>
					</div>
				</div>

						{/* Carousel de tareas */}
						<div className="relative mb-8">
															<div className="w-full">
																<Carousel opts={{ slidesToScroll: 1, align: 'start' }}>
																	<CarouselContent>
																		{mockAssignments
																			.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.subject.toLowerCase().includes(searchTerm.toLowerCase()))
																			.map((assignment) => (
																				<CarouselItem key={assignment.id} className="basis-1/4 min-w-[220px]">
																					<div
																						className={`transition-colors cursor-pointer h-full rounded-xl shadow-sm ${selectedAssignment === assignment.id ? 'bg-progress-yellow-100' : 'bg-light-gray hover:bg-progress-yellow-50'}`}
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
						{(() => {
							const assignment = mockAssignments.find(a => a.id === selectedAssignment)
							if (!assignment) return null
							return (
																				<div className="mb-4 rounded-xl shadow-sm">
																					<div className="pt-6 px-6 pb-6 bg-light-blue-gray rounded-xl">
																{/* Assignment Statistics */}
																<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
																	<div className="bg-education-green-50 p-4 rounded-lg">
																		<div className="text-2xl font-bold text-education-green-700">{assignment.submittedCount}</div>
																		<div className="text-sm text-education-green-700">Entregas</div>
																	</div>
																	<div className="bg-progress-yellow-50 p-4 rounded-lg">
																		<div className="text-2xl font-bold text-progress-yellow-700">{assignment.totalStudents - assignment.submittedCount}</div>
																		<div className="text-sm text-progress-yellow-700">Pendientes</div>
																	</div>
																	<div className="bg-digital-blue-50 p-4 rounded-lg">
																		<div className="text-2xl font-bold text-digital-blue-700">{assignment.averageGrade}</div>
																		<div className="text-sm text-digital-blue-700">Promedio</div>
																	</div>
																	<div className="bg-education-green-50 p-4 rounded-lg">
																		<div className="text-2xl font-bold text-education-green-700">{assignment.passRate}%</div>
																		<div className="text-sm text-education-green-700">Aprobación</div>
																	</div>
																</div>

																{/* Students List */}
																									<div className="mb-3">
																											<h4 className="font-semibold text-dark-text mb-3">Detalles por Estudiante</h4>
																									</div>
																										  <div className="grid gap-4 custom:grid-cols-2 custom:grid-cols-1">
																											{assignment.students.map((student) => {
																						// Estado: corregida (verde), entregada (azul), comenzada (amarillo), no entregada (rojo)
																						let statusColor = "bg-education-green-500"; // corregida
																						let status = "corregida";
																						if (!student.submitted) {
																							statusColor = "bg-alert-red-500";
																							status = "no-entregada";
																						} else if (student.grade === undefined) {
																							statusColor = "bg-progress-yellow-500";
																							status = "comenzada";
																						} else if (student.grade !== undefined && student.grade < 7) {
																							statusColor = "bg-digital-blue-500";
																							status = "entregada";
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
																											onClick={() => handleSendNotification(student.email, assignment.title)}
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
															</div>
														</div>
							)
						})()}
			</div>
		)
}
