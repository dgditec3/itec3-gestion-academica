import { supabase } from './lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: tecnicaturas } = await supabase.from('tecnicaturas').select('*')

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            Gestión Académica - ITEC 3
          </h1>
          <Link href="/login" className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition shadow-sm">
            Iniciar Sesión
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tecnicaturas Activas
          </h2>
          
          <ul className="space-y-4">
            {tecnicaturas?.map((carrera: any) => (
              <li key={carrera.id}>
                <Link href={`/tecnicatura/${carrera.id}`} className="block p-4 bg-blue-50 rounded-lg text-gray-700 hover:bg-blue-100 transition">
                  <span className="font-bold text-lg">🎓 {carrera.nombre}</span> <br/>
                  Duración: {carrera.duracion_anios} años | {carrera.resolucion}
                  <div className="mt-2 text-sm text-blue-600 font-semibold">Ver mapa curricular →</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}