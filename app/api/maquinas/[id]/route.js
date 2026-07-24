import estado from "../../dados";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { id } = await params;
  const maquina = estado.maquinas.find(item => item.id === Number(id));
  return maquina
    ? Response.json(maquina)
    : Response.json({ mensagem: "Máquina não encontrada." }, { status: 404 });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const indice = estado.maquinas.findIndex(item => item.id === Number(id));
  if (indice < 0) return Response.json({ mensagem: "Máquina não encontrada." }, { status: 404 });
  const corpo = await request.json();
  if (!corpo.codigo || !corpo.nome || !corpo.tipo) {
    return Response.json({ mensagem: "Código, nome e tipo são obrigatórios." }, { status: 400 });
  }
  if (estado.maquinas.some((item, i) => i !== indice && item.codigo === corpo.codigo)) {
    return Response.json({ mensagem: "Já existe um cadastro com esse código." }, { status: 409 });
  }
  estado.maquinas[indice] = { ...corpo, id: Number(id) };
  return Response.json(estado.maquinas[indice]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const indice = estado.maquinas.findIndex(item => item.id === Number(id));
  if (indice < 0) return Response.json({ mensagem: "Máquina não encontrada." }, { status: 404 });
  estado.maquinas.splice(indice, 1);
  return new Response(null, { status: 204 });
}
