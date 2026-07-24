import estado from "../dados";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(estado.maquinas);
}

export async function POST(request) {
  const corpo = await request.json();
  if (!corpo.codigo || !corpo.nome || !corpo.tipo) {
    return Response.json({ mensagem: "Código, nome e tipo são obrigatórios." }, { status: 400 });
  }
  if (estado.maquinas.some(item => item.codigo === corpo.codigo)) {
    return Response.json({ mensagem: "Já existe um cadastro com esse código." }, { status: 409 });
  }
  const maquina = {
    ...corpo,
    id: estado.maquinas.length ? Math.max(...estado.maquinas.map(item => item.id)) + 1 : 1
  };
  estado.maquinas.push(maquina);
  return Response.json(maquina, { status: 201 });
}
