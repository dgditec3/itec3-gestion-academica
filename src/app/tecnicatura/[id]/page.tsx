import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function MapaCurricular({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  // Buscamos los datos de la tecnicatura
  const { data: tecnicatura } = await supabase
    .from('tecnicaturas')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  // Buscamos las materias de esta tecnicatura
  const { data: materias } = await supabase
    .from('materias')
    .select('*')
    .eq('tecnicatura_id', resolvedParams.id)
    .order('anio_cursada', { ascending: true })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Volver a Tecnicaturas
        </Link>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            {tecnicatura ? tecnicatura.nombre : 'Mapa Curricular'}
          </h1>
          <p className="text-gray-600 mt-1">
            Duración: {tecnicatura?.duracion_anios} años | Resolución: {tecnicatura?.resolucion}
          </p>
        </div>
        
        <div className="space-y-8">
          {[1, 2, 3].map((anio) => {
            const materiasAnio = materias?.filter((m: any) => m.anio_cursada === anio)

            if (!materiasAnio || materiasAnio.length === 0) return null

            return (
              <div key={anio} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  📅 {anio}º Año ({materiasAnio.length} espacios curriculares)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materiasAnio.map((materia: any) => (
                    <div 
                      key={materia.id} 
                      className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50/50 transition flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{materia.nombre}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Régimen: <span className="font-medium text-blue-700">
                            {materia.cuatrimestre === 0 ? 'Anual' : `${materia.cuatrimestre}º Cuatrimestre`}
                          </span>
                        </p>
                        <span className="inline-block mt-2 px-2.5 py-1 bg-white border border-gray-200 text-xs rounded-full text-gray-600 font-medium">
                          {materia.campo_formacion}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                       <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                        <Link href={`/materia/${materia.id}`} className="text-blue-600 font-semibold hover:underline">
                          Ver planificación →
                        </Link>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}