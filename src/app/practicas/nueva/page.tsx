'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaPracticaPage() {
  const [docentes, setDocentes] = useState<any[]>([])
  const [estudiante, setEstudiante] = useState('')
  const [dni, setDni] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [proyecto, setProyecto] = useState('')
  const [docenteId, setDocenteId] = useState('')
  const [estado, setEstado] = useState('En proceso')
  
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  // Cargamos los docentes para el selector de tutores
  useEffect(() => {
    async function fetchDocentes() {
      const { data } = await supabase.from('docentes').select('*')
      if (data && data.length > 0) {
        setDocentes(data)
        setDocenteId(data[0].id)
      }
    }
    fetchDocentes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    const { error } = await supabase
      .from('practicas_profesionales')
      .insert([
        {
          estudiante_nombre: estudiante,
          dni: dni,
          empresa_organismo: empresa,
          proyecto_vinculado: proyecto,
          docente_tutor_id: docenteId,
          estado: estado
        }
      ])

    if (error) {
      setMensaje('Error al registrar: ' + error.message)
      setLoading(false)
    } else {
      router.push('/practicas')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/practicas" className="text-purple-700 hover:underline font-medium text-sm">
            ← Volver a Prácticas
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar Nueva Práctica Profesionalizante</h1>

          {mensaje && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datos del Estudiante */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider border-b pb-2">Datos del Estudiante</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input type="text" required value={estudiante} onChange={(e) => setEstudiante(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              {/* Datos de Vinculación */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider border-b pb-2">Datos de Vinculación</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa u Organismo</label>
                  <input type="text" required value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="ej. Ministerio de Industria, Empresa Privada..." className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto Vinculado (Opcional)</label>
                  <input type="text" value={proyecto} onChange={(e) => setProyecto(e.target.value)} placeholder="ej. Laboratorio SUMMO, Multilab Streaming, EXPO Posadas..." className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Docente Tutor</label>
                <select value={docenteId} onChange={(e) => setDocenteId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  {docentes.map((doc: any) => (
                    <option key={doc.id} value={doc.id}>{doc.nombre_completo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de la Práctica</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="En proceso">En proceso</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Suspendida">Suspendida</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-800 transition disabled:opacity-50">
                {loading ? 'Guardando...' : 'Confirmar Registro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}