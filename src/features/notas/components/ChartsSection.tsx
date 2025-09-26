import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartsSectionProps {
  donutData: any[];
  barTareaData: any[];
  barCelulaData: any[];
}

export function ChartsSection({ donutData, barTareaData, barCelulaData }: ChartsSectionProps) {
  return (
    <>
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
    </>
  );
}
