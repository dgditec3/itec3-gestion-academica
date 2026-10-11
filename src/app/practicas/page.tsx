import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default async function PracticasPage() {
  const { data: practicas } = await supabase
    .from('practicas_profesionales')
    .select('*, docentes(nombre_completo)')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              Vinculación Institucional
            </span>
            <h1 className="text-3xl font-bold text-purple-900 mt-2">
              Prácticas Profesionalizantes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Seguimiento de pasantías, convenios y proyectos (SUMMO, Multilab, Sector Público/Privado).
            </p>
          </div>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
          >
            ← Volver al Panel
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">
              Estudiantes en Prácticas
            </h2>
            <Link 
  href="/practicas/nueva" 
  className="px-4 py-2 bg-purple-900 text-white text-sm font-semibold rounded-lg hover:bg-purple-800 transition shadow-sm"
>
  + Registrar Nueva Práctica
</Link>
          </div>

          <div className="p-6">
            {practicas && practicas.length > 0 ? (
              <div className="space-y-4">
                {practicas.map((practica: any) => (
                  <div key={practica.id} className="p-5 bg-white border border-gray-200 rounded-xl flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{practica.estudiante_nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        🏢 Entidad: <span className="font-medium text-gray-800">{practica.empresa_organismo}</span> | 📂 Proyecto: <span className="font-medium text-gray-800">{practica.proyecto_vinculado || 'General'}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tutor a cargo: {practica.docentes?.nombre_completo || 'Sin asignar'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      practica.estado === 'Finalizada' ? 'bg-green-100 text-green-700' :
                      practica.estado === 'En proceso' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {practica.estado}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-purple-50/50 rounded-xl border border-dashed border-purple-200">
                <p className="text-gray-600 text-sm font-medium">Aún no hay prácticas profesionalizantes registradas en el sistema.</p>
                <p className="text-xs text-gray-400 mt-1">Utiliza el botón superior para dar de alta a un estudiante.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}