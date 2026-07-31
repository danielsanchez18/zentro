import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const questionsList = [
  {
    id: "item-1",
    question: "¿Puedo cancelar en cualquier momento?",
    answer: "Sí, puede cancelar en cualquier momento sin que se le hagan preguntas, pero le agradeceríamos mucho que nos diera su opinión.",
  },
  {
    id: "item-2",
    question: "Mi equipo tiene créditos. ¿Cómo los utilizamos?",
    answer: "Una vez que tu equipo se haya suscrito a un plan de suscripción, nos sentaremos, tomaremos un café y concretaremos los detalles.",
  },
  {
    id: "item-3",
    question: "¿Cómo funciona el sistema de precios de Zentro?",
    answer: "Nuestras suscripciones son por niveles. Es fundamental comprender la tarea que hay que realizar y resolver los problemas que puedan surgir.",
  },
  {
    id: "item-4",
    question: "¿Qué grado de seguridad ofrece Zentro?",
    answer: "Proteger los datos que usted confía a Zentro es nuestra máxima prioridad. Implementamos cifrado de extremo a extremo, autenticación multifactor y auditorías de seguridad periódicas.",
  },
  {
    id: "item-5",
    question: "¿Cómo puedo acceder a un tema que he comprado?",
    answer: "Si pierdes el enlace de un tema que has comprado, ¡no te preocupes! Nosotros te ayudamos. Puedes iniciar sesión en tu cuenta, pulsar tu avatar en la esquina superior derecha y pulsar Compras. Si no has creado una cuenta o no recuerdas la información, puedes utilizar nuestra práctica página de descargas, solo recuerda utilizar el mismo correo electrónico con el que realizaste la compra originalmente.",
  },
  {
    id: "item-6",
    question: "Actualizar el tipo de licencia",
    answer: "Es posible que en ocasiones necesite actualizar su licencia desde el tipo original que adquirió, y tenemos una solución que le garantiza que podrá aplicar el coste de su compra original a la adquisición de la nueva licencia.",
  },
]

export function Questions() {
  return (
    <section className="py-20 space-y-15 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">Tus preguntas, las respondemos</h3>
        <p className="text-gray-800 dark:text-neutral-400 text-sm">Respuestas a las preguntas más frecuentes.</p>
      </div>

      <Accordion defaultValue={["item-1"]} className="w-full">
        {questionsList.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-transparent mb-2">
            <AccordionTrigger className="cursor-pointer text-base text-gray-900 dark:text-neutral-200 font-medium text-start hover:no-underline hover:bg-muted dark:hover:bg-neutral-800/50 aria-expanded:rounded-b-none aria-expanded:bg-muted dark:aria-expanded:bg-muted rounded-xl px-6 py-4 transition-all **:data-[slot=accordion-trigger-icon]:size-5.5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base bg-muted rounded-b-xl text-start px-6 pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
