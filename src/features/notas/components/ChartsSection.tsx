import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartsSectionProps {
  donutData: any[];
  barTareaData: any[];
  barCelulaData: any[];
}

export function ChartsSection({ donutData, barTareaData, barCelulaData }: ChartsSectionProps) {

  // Colores pastel oscuros unificados (deben coincidir con useGradeManagementData)
  const pastelCorregida = "#34D399"; // education-green-400
  const pastelComenzada = "#FBBF24"; // progress-yellow-400
  const pastelEntregada = "#60A5FA"; // digital-blue-400
  const pastelReclamada = "#F87171"; // alert-red-400

  return (
    <>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="bg-blue-50 rounded-xl p-6">
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
  <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">Entregas por tarea</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barTareaData} layout="vertical" margin={{ left: 30, right: 10, top: 10, bottom: 10 }}>
              <XAxis type="number" hide domain={[0, 'dataMax']} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="corregida" stackId="a" fill={pastelCorregida} name="corregida" />
              <Bar dataKey="comenzada" stackId="a" fill={pastelComenzada} name="comenzada" />
              <Bar dataKey="entregada" stackId="a" fill={pastelEntregada} name="entregada" />
              <Bar dataKey="reclamada" stackId="a" fill={pastelReclamada} name="reclamada" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  <div className="mb-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-2">Entregas por célula</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barCelulaData} layout="vertical" margin={{ left: 30, right: 10, top: 10, bottom: 10 }}>
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="corregida" stackId="a" fill={pastelCorregida} name="corregida" />
            <Bar dataKey="comenzada" stackId="a" fill={pastelComenzada} name="comenzada" />
            <Bar dataKey="entregada" stackId="a" fill={pastelEntregada} name="entregada" />
            <Bar dataKey="reclamada" stackId="a" fill={pastelReclamada} name="reclamada" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
