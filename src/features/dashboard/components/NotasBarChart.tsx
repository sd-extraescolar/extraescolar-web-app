import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface NotasRango {
  rango: string;
  min: number;
  max: number;
  count: number;
}

interface NotasBarChartProps {
  notasRangos: NotasRango[];
  totalEstudiantes: number;
}

export function NotasBarChart({ notasRangos, totalEstudiantes }: NotasBarChartProps) {
  // Mostrar todos los rangos, incluso los que tienen 0 estudiantes
  const allRanges = notasRangos;

  return (
    <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Distribución de Notas por Rangos
      </h3>
      
      <div className="h-80 relative">
        {/* Gráfico de fondo siempre visible */}
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allRanges}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="rango" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                label={{ value: 'Puntaje', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }}
                fontSize={12}
                tickFormatter={(value) => Math.round(value).toString()}
                domain={[0, totalEstudiantes]}
                tickCount={Math.max(2, Math.ceil(totalEstudiantes / 5) + 1)}
                allowDecimals={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} notas`, 'Cantidad']}
                labelFormatter={(label: string) => `Rango: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                opacity={allRanges.some(r => r.count > 0) ? 1 : 0.3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Overlay cuando no hay notas */}
        {!allRanges.some(r => r.count > 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-70 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg font-bold">No hay notas disponibles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
