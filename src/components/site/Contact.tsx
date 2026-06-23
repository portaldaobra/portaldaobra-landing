import { useState } from "react";
import { Mail, Globe, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function Contact() {
  const [perfil, setPerfil] = useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) {
      toast.error("Selecione se você é Contratante ou Fornecedor.");
      return;
    }
    // perfil is captured with the form payload (e.g. { perfil: "Contratante" })
    toast.success("Mensagem enviada! Nossa equipe responderá em breve.");
  };

  return (
    <section id="contato" className="section-y bg-gradient-to-br from-navy via-navy to-primary text-navy-foreground relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-mesh)" }} />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-success/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#1A42AF" }}>
              Fale Conosco
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              Fale com nossa equipe
            </h2>
            <p className="mt-4 text-lg text-navy-foreground/80">
              Estamos prontos para ajudar sua empresa a contratar a construtora certa com
              segurança e agilidade.
            </p>

            <div className="mt-10 space-y-4">
              <InfoCard icon={Mail} label="E-mail" value="contato@portaldaobra.com.br" />
              <InfoCard icon={Globe} label="Website" value="www.portaldaobra.com.br" />
              <InfoCard icon={MessageSquare} label="Suporte" value="Suporte Dedicado" />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="glass-dark rounded-3xl p-6 sm:p-8 shadow-elegant"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldDark label="Nome" id="c-nome" />
              <FieldDark label="Empresa" id="c-empresa" />
              <FieldDark label="E-mail" id="c-email" type="email" />
              <FieldDark label="Telefone" id="c-tel" type="tel" />
            </div>

            <div className="mt-4">
              <Label htmlFor="c-perfil" className="text-xs font-semibold text-navy-foreground/90">
                Perfil
              </Label>
              <Select value={perfil} onValueChange={setPerfil}>
                <SelectTrigger
                  id="c-perfil"
                  className="mt-1.5 h-11 bg-white/5 border-white/10 text-navy-foreground data-[placeholder]:text-navy-foreground/40 focus:ring-success/40"
                >
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contratante">Contratante</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label htmlFor="c-msg" className="text-xs font-semibold text-navy-foreground/90">Mensagem</Label>
              <Textarea
                id="c-msg"
                rows={5}
                required
                className="mt-1.5 bg-white/5 border-white/10 text-navy-foreground placeholder:text-navy-foreground/40"
                placeholder="Conte-nos sobre seu projeto..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90 shadow-elegant"
            >
              Enviar Mensagem <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl glass-dark">
      <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/30 text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-navy-foreground/60">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function FieldDark({ label, id, type = "text" }: { label: string; id: string; type?: string }) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold text-navy-foreground/90">{label}</Label>
      <Input
        id={id}
        type={type}
        required
        className="mt-1.5 h-11 bg-white/5 border-white/10 text-navy-foreground placeholder:text-navy-foreground/40"
      />
    </div>
  );
}
