import type { VercelRequest, VercelResponse } from '@vercel/node';

let sharedDatabase = {
  activities: [
    {
      id: 'act_1',
      grupoId: '1b',
      titulo: 'Traer libro de Matemáticas y cuaderno de cuadrícula',
      descripcion: 'Revisión de ejercicios de sumas y restas simples.',
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'tarea',
      destacado: true,
      creadoPor: 'Mr. Daniel Acevedo Moncada'
    },
    {
      id: 'act_2',
      grupoId: '1b',
      titulo: 'Traer 1 manzana y 1 plátano para clase de Ciencias',
      descripcion: 'Actividad práctica sobre alimentación saludable.',
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'materiales',
      creadoPor: 'Mamá de Mateo'
    }
  ],
  overrides: []
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && Array.isArray(body.activities)) {
        sharedDatabase.activities = body.activities;
      }
      if (body && Array.isArray(body.overrides)) {
        sharedDatabase.overrides = body.overrides;
      }
      return res.status(200).json({ status: 'ok', data: sharedDatabase });
    }

    return res.status(200).json({ status: 'ok', data: sharedDatabase });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err?.message || 'Server error' });
  }
}
