// Servicio real del formulario de contacto de la landing.
// POST {NEXT_PUBLIC_API_URL}/api/v1/contact

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ContactTopic = "demo" | "soporte" | "alianzas" | "otro";

export interface ContactInput {
  topic: ContactTopic;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  message: string;
}

export async function submitContactMessage(input: ContactInput): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: input.topic,
        name: input.name,
        email: input.email,
        organization: input.organization || undefined,
        phone: input.phone || undefined,
        message: input.message,
      }),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    );
  }

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response.json()) as { message?: string | string[] };
      detail = Array.isArray(data.message) ? data.message[0] : data.message;
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new Error(detail ?? "No se pudo enviar el mensaje. Inténtalo de nuevo.");
  }
}
