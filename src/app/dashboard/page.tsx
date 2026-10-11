import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default async function DashboardPage() {
  // Verificamos las materias y su estado general
  const { data: materias } = await supabase
    .from('materias')
    .select('*, tecnicaturas(nombre)')
    .order('anio_cursada', { ascending: true })

  // Obtenemos las planificaciones cargadas
  const { data: planificaciones } = await supabase
    .from('planificaciones')
    .select('*, materias(nombre), docentes(nombre_completo)')

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              Panel de Coordinación y Gestión
            </span>
            <h1 className="text-3xl font-bold text-blue-900 mt-2">
              Panel de Control - ITEC 3
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Supervisión de planificaciones, espacios curriculares y estados académicos.
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/practicas" 
              className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-bold rounded-xl hover:bg-purple-200 transition"
            >
              Gestión de Prácticas
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Ver Sitio Público
            </Link>
          </div>
        </div>

        {/* Tarjetas de Resumen Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-gray-500">Espacios Curriculares Totales</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{materias?.length || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Plan de estudios oficial cargado</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-gray-500">Planificaciones Presentadas</p>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {planificaciones?.filter((p: any) => p.estado === 'Aprobada' || p.estado === 'Presentada').length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">Cátedras con seguimiento activo</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-yellow-500">
            <p className="text-sm font-medium text-gray-500">Pendientes de Carga</p>
            <p className="text-3xl font-bold text-yellow-700 mt-2">
              {(materias?.length || 0) - (planificaciones?.length || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Espacios a completar por docentes</p>
          </div>
        </div>

        {/* Listado de Materias y Estado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Estado de Cátedras - Diseño Gráfico Digital
            </h2>
            <span className="text-xs text-gray-500 font-medium">Actualizado en tiempo real</span>
          </div>

          <div className="divide-y divide-gray-100">
            {materias?.map((materia: any) => {
              const plan = planificaciones?.find((p: any) => p.materia_id === materia.id)

              return (
                <div key={materia.id} className="p-4 sm:px-6 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition">
                  <div>
                    <h3 className="font-bold text-gray-900">{materia.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {materia.anio_cursada}º Año | {materia.cuatrimestre === 0 ? 'Anual' : `${materia.cuatrimestre}º Cuatrimestre`} | <span className="font-medium text-gray-700">{materia.campo_formacion}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      plan?.estado === 'Aprobada' ? 'bg-green-100 text-green-700' :
                      plan?.estado === 'Presentada' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {plan ? plan.estado : 'Sin Planificación'}
                    </span>

                    <Link 
                      href={`/materia/${materia.id}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg transition"
                    >
                      Gestionar →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}