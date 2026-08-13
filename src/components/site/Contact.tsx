import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, ArrowRight, CheckCircle2, Globe, Mail, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/site/TurnstileWidget";
import { submitLead, type LeadData, type LeadErrorCode } from "@/lib/api";
import { getTurnstileSiteKey, TURNSTILE_STUB_TOKEN } from "@/lib/turnstile";

const UF_OPTIONS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

// Validation lives here and ONLY here — the form is rendered with `noValidate`
// so the browser never races react-hook-form + zod for the first error.
// Caps mirror the API column widths so a valid form is never rejected by the DTO.
const leadFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .max(255, "O e-mail deve ter no máximo 255 caracteres."),
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "Conte um pouco sobre a obra (mínimo de 10 caracteres).")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres."),
  city: z
    .string()
    .trim()
    .min(2, "Informe a cidade.")
    .max(120, "A cidade deve ter no máximo 120 caracteres."),
  state: z.enum(UF_OPTIONS, {
    errorMap: () => ({ message: "Selecione o estado (UF)." }),
  }),
  phone: z
    .string()
    .trim()
    .max(32, "O telefone deve ter no máximo 32 caracteres.")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Informe um telefone com DDD (ex.: (11) 99999-0000).",
    ),
  roleIntent: z.enum(["client", "contractor"], {
    errorMap: () => ({ message: "Escolha uma das opções acima." }),
  }),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const ERROR_COPY: Record<LeadErrorCode, string> = {
  LEAD_VALIDATION: "Não conseguimos validar os dados enviados. Revise os campos e tente novamente.",
  LEAD_RATE_LIMITED:
    "Recebemos muitas solicitações deste dispositivo. Aguarde um minuto e tente novamente.",
  LEAD_CAPTCHA_FAILED:
    "Não foi possível confirmar que você não é um robô. Refaça a verificação e tente novamente.",
  LEAD_NETWORK:
    "Não conseguimos falar com nossos servidores. Verifique sua conexão e tente novamente.",
  LEAD_UNEXPECTED: "Algo deu errado ao enviar sua solicitação. Tente novamente em instantes.",
};

const MISSING_CAPTCHA_COPY = "Confirme que você não é um robô para continuar.";

const inputDarkClass =
  "h-11 bg-white/5 border-white/10 text-navy-foreground placeholder:text-navy-foreground/40 focus-visible:ring-success/40";
const labelDarkClass = "text-xs font-semibold text-navy-foreground/90";
const messageDarkClass = "text-[0.8rem] font-medium text-red-300";

function formatExpiry(isoDate: string): string | null {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function Contact() {
  // Site key is a build-time public value: present in prod, absent locally.
  // Absent => no widget, and the stub token the API accepts while
  // TURNSTILE_SECRET is unset.
  const [siteKey] = useState<string | null>(() => getTurnstileSiteKey());
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaNonce, setCaptchaNonce] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<LeadData | null>(null);

  // The page is prerendered to static HTML. Until React hydrates, a click on
  // the submit button would fire a NATIVE form submit (a pointless page
  // reload), so the button ships disabled and enables on hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      name: "",
      description: "",
      city: "",
      state: undefined,
      phone: "",
      roleIntent: undefined,
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    const token = siteKey ? captchaToken : TURNSTILE_STUB_TOKEN;
    if (!token) {
      setSubmitError(MISSING_CAPTCHA_COPY);
      return;
    }

    setSubmitError(null);

    const result = await submitLead({
      email: values.email,
      name: values.name,
      phone: values.phone,
      city: values.city,
      state: values.state,
      role_intent: values.roleIntent,
      description: values.description,
      turnstile_token: token,
    });

    if (result.ok) {
      setConfirmation(result.data);
      return;
    }

    // Keep every typed value on screen — the user retries, never retypes.
    setSubmitError(ERROR_COPY[result.code]);
    if (siteKey) {
      // Turnstile tokens are single-use: remount the widget for a fresh one.
      setCaptchaToken("");
      setCaptchaNonce((nonce) => nonce + 1);
    }
  };

  return (
    <section
      id="contato"
      className="section-y bg-gradient-to-br from-navy via-navy to-primary text-navy-foreground relative overflow-hidden scroll-mt-24"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: "var(--gradient-mesh)" }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-success/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "#1A42AF" }}
            >
              Fale Conosco
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              Fale com nossa equipe
            </h2>
            <p className="mt-4 text-lg text-navy-foreground/80">
              Estamos prontos para ajudar sua empresa a contratar a construtora certa com segurança
              e agilidade.
            </p>

            <div className="mt-10 space-y-4">
              <InfoCard icon={Mail} label="E-mail" value="contato@portaldaobra.com.br" />
              <InfoCard icon={Globe} label="Website" value="www.portaldaobra.com.br" />
              <InfoCard icon={MessageSquare} label="Suporte" value="Suporte Dedicado" />
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-6 sm:p-8 shadow-elegant">
            {confirmation ? (
              <LeadConfirmation data={confirmation} />
            ) : (
              <>
                <p className="text-sm text-navy-foreground/80">
                  Conte sobre sua obra e enviaremos um link para você concluir o cadastro no Portal
                  da Obra.
                </p>

                <Form {...form}>
                  <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit, () => setSubmitError(null))}
                    className="mt-6"
                    data-testid="lead-form"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className={labelDarkClass}>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                autoComplete="email"
                                placeholder="voce@empresa.com.br"
                                className={inputDarkClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className={messageDarkClass} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className={labelDarkClass}>Nome</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="name"
                                placeholder="Seu nome completo"
                                className={inputDarkClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className={messageDarkClass} />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4 space-y-1.5">
                          <FormLabel className={labelDarkClass}>Descrição da obra</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Ex.: reforma de 3 lojas em shopping, com previsão de início em 60 dias."
                              className="bg-white/5 border-white/10 text-navy-foreground placeholder:text-navy-foreground/40 focus-visible:ring-success/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className={messageDarkClass} />
                        </FormItem>
                      )}
                    />

                    <div className="mt-4 grid sm:grid-cols-6 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-3 space-y-1.5">
                            <FormLabel className={labelDarkClass}>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="address-level2"
                                placeholder="Digite a cidade"
                                className={inputDarkClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className={messageDarkClass} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-1 space-y-1.5">
                            <FormLabel className={labelDarkClass}>UF</FormLabel>
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger
                                  className={`${inputDarkClass} data-[placeholder]:text-navy-foreground/40`}
                                >
                                  <SelectValue placeholder="UF" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {UF_OPTIONS.map((uf) => (
                                  <SelectItem key={uf} value={uf}>
                                    {uf}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className={messageDarkClass} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2 space-y-1.5">
                            <FormLabel className={labelDarkClass}>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                autoComplete="tel"
                                placeholder="(11) 99999-0000"
                                className={inputDarkClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className={messageDarkClass} />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="roleIntent"
                      render={({ field }) => (
                        <FormItem className="mt-6 space-y-2">
                          <FormLabel className={labelDarkClass}>O que você procura?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              aria-label="O que você procura?"
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                              className="grid sm:grid-cols-2 gap-3"
                            >
                              <RoleOption
                                id="lead-role-client"
                                value="client"
                                label="Quero contratar uma obra"
                              />
                              <RoleOption
                                id="lead-role-contractor"
                                value="contractor"
                                label="Quero fornecer serviços"
                              />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className={messageDarkClass} />
                        </FormItem>
                      )}
                    />

                    {siteKey ? (
                      <TurnstileWidget
                        key={captchaNonce}
                        siteKey={siteKey}
                        className="mt-6"
                        onToken={setCaptchaToken}
                        onError={() => setSubmitError(ERROR_COPY.LEAD_CAPTCHA_FAILED)}
                      />
                    ) : null}

                    {submitError ? (
                      <div
                        role="alert"
                        data-testid="lead-error"
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                        <div>
                          <p className="text-sm font-medium text-red-100">{submitError}</p>
                          <button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            data-testid="lead-retry"
                            className="mt-2 text-sm font-semibold text-red-100 underline underline-offset-4 hover:text-white"
                          >
                            Tentar novamente
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={!hydrated || form.formState.isSubmitting}
                      data-testid="lead-submit"
                      className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90 shadow-elegant"
                    >
                      {form.formState.isSubmitting ? "Enviando..." : "Enviar solicitação"}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>

                    <p className="mt-3 text-xs text-navy-foreground/60">
                      Ao enviar, você concorda em receber contato do Portal da Obra sobre esta
                      solicitação.
                    </p>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Inline confirmation — deliberately NOT a toast. The claim link has to survive
 * on screen if the e-mail never arrives, so it is rendered as a real anchor.
 */
function LeadConfirmation({ data }: { data: LeadData }) {
  const expiry = formatExpiry(data.expires_at);

  return (
    <div data-testid="lead-confirmation" role="status" className="py-2">
      <div className="grid place-items-center h-12 w-12 rounded-2xl bg-success/20 text-success">
        <CheckCircle2 className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-bold">Recebemos sua solicitação</h3>

      <p className="mt-3 text-navy-foreground/80">
        Enviamos para{" "}
        <strong data-testid="lead-confirmation-email" className="text-navy-foreground">
          {data.email}
        </strong>{" "}
        um e-mail com o link para concluir seu cadastro. Verifique também a caixa de spam.
      </p>

      <a
        href={data.claim_url}
        data-testid="lead-claim-link"
        className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-md bg-success px-6 py-3 text-sm font-semibold text-success-foreground shadow-elegant hover:bg-success/90"
      >
        Concluir meu cadastro agora
        <ArrowRight className="h-4 w-4" />
      </a>

      <p className="mt-4 text-sm text-navy-foreground/70">
        Não recebeu o e-mail? Use o link acima — ele é pessoal, funciona uma única vez e expira
        {expiry ? ` em ${expiry}` : " em alguns dias"}.
      </p>
    </div>
  );
}

function RoleOption({ id, value, label }: { id: string; value: string; label: string }) {
  return (
    <Label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-navy-foreground transition-colors hover:bg-white/10 has-[button[data-state=checked]]:border-success/60 has-[button[data-state=checked]]:bg-success/10"
    >
      <RadioGroupItem id={id} value={value} className="border-white/40 text-success" />
      {label}
    </Label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
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
