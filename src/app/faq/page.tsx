
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

const faqItems = [
  {
    question: "Is InvoiceCraft completely free to use?",
    answer: "Yes! Our core invoice generation features are completely free and do not require you to sign up. We may introduce premium features in the future for a small fee."
  },
  {
    question: "Can I add my own company logo to the invoices?",
    answer: "Absolutely. You can upload your company logo, and it will appear on all your invoices for a professional touch."
  },
  {
    question: "Is my data safe and private?",
    answer: "Your privacy is our priority. InvoiceCraft operates entirely in your browser. None of your invoice data is ever saved on our servers, ensuring complete confidentiality."
  },
  {
    question: "What formats can I download my invoice in?",
    answer: "Currently, you can save your invoice as a universally compatible PDF file. This makes it easy to print or send to your clients."
  },
   {
    question: "Do I need to sign up to use the service?",
    answer: "No sign-up is required to create an invoice. You can start generating invoices right away. The optional dashboard feature saves your drafts to your browser's local storage."
  },
]


export default function FaqPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Frequently Asked Questions</PageHeaderHeading>
        <PageHeaderDescription>
          Find answers to common questions about InvoiceCraft. If you can't find your answer here, feel free to contact us.
        </PageHeaderDescription>
      </PageHeader>

      <div className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-4">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
             <AccordionItem value={`item-${index}`} key={item.question}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline p-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <p className="text-muted-foreground">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
