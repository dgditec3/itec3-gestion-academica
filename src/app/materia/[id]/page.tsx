import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import FormularioPlanificacion from '../../components/FormularioPlanificacion'

export default async function DetalleMateria({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  // Buscamos los datos de la materia
  const { data: materia } = await supabase
    .from('materias')
    .select('*, tecnicaturas(nombre, id)')
    .eq('id', resolvedParams.id)
    .single()

  // Buscamos las planificaciones asociadas a esta materia
  const { data: planificaciones } = await supabase
    .from('planificaciones')
    .select('*, docentes(nombre_completo, email, id)')
    .eq('materia_id', resolvedParams.id)

  // Buscamos la lista de docentes disponibles para el selector
  const { data: docentes } = await supabase
    .from('docentes')
    .select('*')

  if (!materia) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Materia no encontrada.</p>
      </div>
    )
  }

  const planificacionActual = planificaciones && planificaciones.length > 0 ? planificaciones[0] : null

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href={`/tecnicatura/${materia.tecnicaturas?.id}`} 
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            ← Volver al Mapa Curricular
          </Link>
          <Link 
            href="/dashboard" 
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Ir al Panel de Control
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            {materia.tecnicaturas?.nombre}
          </span>
          <h1 className="text-3xl font-bold text-blue-900 mt-3">
            {materia.nombre}
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div>📅 Año: <strong className="text-gray-800">{materia.anio_cursada}º Año</strong></div>
            <div>⏱️ Régimen: <strong className="text-gray-800">{materia.cuatrimestre === 0 ? 'Anual' : `${materia.cuatrimestre}º Cuatrimestre`}</strong></div>
            <div>📂 Campo: <strong className="text-gray-800">{materia.campo_formacion}</strong></div>
          </div>
        </div>

        {/* Estado actual de la planificación */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Estado Académico Actual
          </h2>

          {planificacionActual ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Ciclo Lectivo: {planificacionActual.anio_lectivo}</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Docente a cargo: <span className="font-medium text-gray-800">{planificacionActual.docentes?.nombre_completo || 'Sin asignar'}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                planificacionActual.estado === 'Aprobada' ? 'bg-green-100 text-green-700' :
                planificacionActual.estado === 'Presentada' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {planificacionActual.estado}
              </span>
            </div>
          ) : (
            <div className="p-6 bg-blue-50/50 rounded-xl border border-dashed border-blue-200 text-center">
              <p className="text-gray-600 text-sm">Aún no se ha cargado una planificación oficial para este espacio curricular.</p>
            </div>
          )}

          {/* Formulario interactivo para registrar o editar */}
          <FormularioPlanificacion 
            materiaId={materia.id} 
            docentes={docentes || []} 
            planificacionActual={planificacionActual} 
          />
        </div>
      </div>
    </main>
  )
}