import estado from "../dados";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(estado.produtos);
}
