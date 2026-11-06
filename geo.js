// Devuelve el país de quien visita la web (según su IP). Lo usa la página para mostrar el precio correcto.
export default async (request, context) => {
  const country = context.geo?.country?.code || null;
  return new Response(JSON.stringify({ country }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const config = { path: '/api/geo' };
