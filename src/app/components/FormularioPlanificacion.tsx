'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function FormularioPlanificacion({ materiaId, docentes, planificacionActual }: { materiaId: string, docentes: any[], planificacionActual: any }) {
  const [anioLectivo, setAnioLectivo] = useState(planificacionActual?.anio_lectivo || '2026')
  const [docenteId, setDocenteId] = useState(planificacionActual?.docente_id || (docentes[0]?.id || ''))
  const [estado, setEstado] = useState(planificacionActual?.estado || 'Presentada')
  
  // NUEVO ESTADO PARA GOOGLE DRIVE
  const [enlaceDrive, setEnlaceDrive] = useState(planificacionActual?.enlace_drive || '')
  
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    if (planificacionActual) {
      // Actualizamos la planificación existente
      const { error } = await supabase
        .from('planificaciones')
        .update({
          anio_lectivo: anioLectivo,
          docente_id: docenteId,
          estado: estado,
          enlace_drive: enlaceDrive // GUARDAMOS EL ENLACE
        })
        .eq('id', planificacionActual.id)

      if (error) {
        setMensaje('Error al actualizar: ' + error.message)
      } else {
        setMensaje('¡Planificación actualizada con éxito!')
        router.refresh()
      }
    } else {
      // Creamos una nueva planificación
      const { error } = await supabase
        .from('planificaciones')
        .insert([
          {
            materia_id: materiaId,
            docente_id: docenteId,
            anio_lectivo: anioLectivo,
            estado: estado,
            enlace_drive: enlaceDrive // GUARDAMOS EL ENLACE
          }
        ])

      if (error) {
        setMensaje('Error al guardar: ' + error.message)
      } else {
        setMensaje('¡Planificación creada con éxito!')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">
        {planificacionActual ? 'Editar Planificación Académica' : 'Cargar Nueva Planificación'}
      </h3>

      {mensaje && (
        <div className={`p-3 text-sm rounded-xl ${mensaje.includes('éxito') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo Lectivo</label>
          <input 
            type="text" 
            value={anioLectivo}
            onChange={(e) => setAnioLectivo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Docente a Cargo</label>
          <select 
            value={docenteId}
            onChange={(e) => setDocenteId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
          >
            {docentes.map((doc: any) => (
              <option key={doc.id} value={doc.id}>{doc.nombre_completo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado Académico</label>
          <select 
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
          >
            <option value="Borrador">Borrador</option>
            <option value="Presentada">Presentada</option>
            <option value="Aprobada">Aprobada</option>
          </select>
        </div>
      </div>

      {/* NUEVO CAMPO VISUAL PARA GOOGLE DRIVE */}
      <div className="pt-2 border-t border-gray-100 mt-4">
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Enlace al Documento (Google Drive)
        </label>
        <input 
          type="url" 
          value={enlaceDrive}
          onChange={(e) => setEnlaceDrive(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Asegúrate de configurar el enlace de Drive como "Cualquier persona con el enlace puede ver".
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="px-5 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition disabled:opacity-50 shadow-sm mt-4"
      >
        {loading ? 'Guardando...' : (planificacionActual ? 'Guardar Cambios' : 'Registrar Planificación')}
      </button>
    </form>
  )
}