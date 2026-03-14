'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type PriceState = {
  btc: number | null;
  usdt: number | null;
  updatedAt: string;
  loading: boolean;
};

type FormDataState = {
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
  mensagem: string;
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

const WHATSAPP_NUMBER = '5524998604138';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL_EMPRESA = 'megaserv.digital@gmail.com';
const CNPJ_EMPRESA = '62.445.816/0001-86';
const DOMINIO_EMPRESA = 'www.megaservicosdigitais.com.br';

export default function MegaServicosDigitaisSite() {
  const [prices, setPrices] = useState<PriceState>({
    btc: null,
    usdt: null,
    updatedAt: '',
    loading: true,
  });

  const [formData, setFormData] = useState<FormDataState>({
    nome: '',
    empresa: '',
    email: '',
    whatsapp: '',
    mensagem: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPrices() {
      try {
        const [btcResponse, usdtResponse] = await Promise.all([
          fetch('https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCBRL', {
            cache: 'no-store',
          }),
          fetch('https://data-api.binance.vision/api/v3/ticker/price?symbol=USDTBRL', {
            cache: 'no-store',
          }),
        ]);

        if (!btcResponse.ok || !usdtResponse.ok) {
          throw new Error('Falha ao buscar cotações.');
        }

        const btcData = await btcResponse.json();
        const usdtData = await usdtResponse.json();

        if (!isMounted) return;

        setPrices({
          btc: btcData?.price ? Number(btcData.price) : null,
          usdt: usdtData?.price ? Number(usdtData.price) : null,
          updatedAt: new Date().toLocaleString('pt-BR'),
          loading: false,
        });
      } catch {
        if (!isMounted) return;

        setPrices((current) => ({
          ...current,
          loading: false,
          updatedAt: current.updatedAt || 'Não disponível',
        }));
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cotacoes = useMemo(
    () => [
      {
        simbolo: '₿',
        nome: 'BTC',
        valor: formatBTC(prices.btc),
        status: prices.loading ? 'Atualizando...' : 'Ao vivo',
      },
      {
        simbolo: '₮',
        nome: 'USDT',
        valor: formatUSDT(prices.usdt),
        status: prices.loading ? 'Atualizando...' : 'Ao vivo',
      },
    ],
    [prices]
  );

  const vantagens = [
    {
      titulo: 'Atendimento Corporativo',
      descricao:
        'Estrutura voltada para empresas, parceiros comerciais e demandas que exigem organização, clareza e resposta rápida.',
    },
    {
      titulo: 'Processo Operacional Organizado',
      descricao:
        'Fluxo com alinhamento prévio, análise das informações e acompanhamento em cada etapa do atendimento.',
    },
    {
      titulo: 'Segurança e Transparência',
      descricao:
        'Comunicação objetiva sobre escopo, canais de contato, documentação necessária e tratativas operacionais.',
    },
  ];

  const etapas = [
    {
      numero: '01',
      titulo: 'Contato inicial',
      descricao:
        'Recebemos a solicitação e entendemos a necessidade do cliente para direcionar o atendimento corretamente.',
    },
    {
      numero: '02',
      titulo: 'Análise e validação',
      descricao:
        'Dependendo da demanda, podem ser solicitadas informações complementares para validação cadastral e operacional.',
    },
    {
      numero: '03',
      titulo: 'Atendimento e acompanhamento',
      descricao:
        'Após a etapa inicial, o atendimento segue com acompanhamento direto e comunicação clara até a conclusão.',
    },
  ];

  const linksMenu = [
    { label: 'Início', href: '#inicio' },
    { label: 'Empresa', href: '#empresa' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Contato', href: '#contato' },
  ];

  function handleChange(field: keyof FormDataState, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: '',
      }));
    }
  }

  function validateForm(data: FormDataState): FormErrors {
    const newErrors: FormErrors = {};

    if (!data.nome.trim()) {
      newErrors.nome = 'Informe seu nome.';
    }

    if (!data.empresa.trim()) {
      newErrors.empresa = 'Informe o nome da empresa.';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Informe seu e-mail.';
    } else if (!isValidEmail(data.email)) {
      newErrors.email = 'Digite um e-mail válido.';
    }

    if (!data.whatsapp.trim()) {
      newErrors.whatsapp = 'Informe seu WhatsApp.';
    } else if (onlyDigits(data.whatsapp).length < 10) {
      newErrors.whatsapp = 'Digite um número válido com DDD.';
    }

    if (!data.mensagem.trim()) {
      newErrors.mensagem = 'Descreva sua solicitação.';
    } else if (data.mensagem.trim().length < 10) {
      newErrors.mensagem = 'A mensagem precisa ter pelo menos 10 caracteres.';
    }

    return newErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const texto = [
      'Novo contato pelo site',
      '',
      `Nome: ${formData.nome}`,
      `Empresa: ${formData.empresa}`,
      `E-mail: ${formData.email}`,
      `WhatsApp: ${formData.whatsapp}`,
      '',
      'Mensagem:',
      formData.mensagem,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  }

return (
  <div className="relative min-h-screen bg-[#07111f] text-white selection:bg-cyan-400/30 selection:text-white">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* FUNDO DE CIRCUITOS */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "url('/circuit-bg-2.png')",
          backgroundSize: "1800px",
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute right-0 top-64 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

    </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-wide">Mega Serviços Digitais Ltda</div>
            <div className="text-xs text-slate-300">Soluções digitais e atendimento corporativo</div>
          </div>

          <nav className="hidden gap-6 md:flex">
            {linksMenu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-200 transition hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
          >
            Falar com a equipe
          </a>
        </div>
      </header>

      <main className="relative">
        <section
          id="inicio"
          className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28"
        >
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              Presença institucional profissional
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Estrutura digital para apresentar sua empresa com credibilidade, clareza e presença online.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              A Mega Serviços Digitais Ltda atua com intermediação e agenciamento de serviços e negócios em geral, oferecendo atendimento corporativo, organização operacional e canais formais de contato para parceiros, plataformas e clientes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#empresa"
                className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Conheça a empresa
              </a>
              <a
                href="#contato"
                className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/5"
              >
                Solicitar contato
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-cyan-300/15 bg-white/5 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Painel institucional</p>
                  <h2 className="text-xl font-semibold">Cotações automáticas</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Atualiza a cada 10s
                </div>
              </div>

              <div className="space-y-4">
                {cotacoes.map((item) => (
                  <div
                    key={item.nome}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1a2d] px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-300">
                        {item.simbolo}
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">{item.nome}</p>
                        <p className="text-lg font-semibold text-white">{item.valor}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#091321] p-4 text-sm text-slate-300">
                Última atualização:{' '}
                <span className="font-medium text-white">
                  {prices.updatedAt || 'Carregando...'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="empresa" className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Sobre a empresa
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Presença institucional voltada para parceiros, plataformas e atendimento corporativo
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-300">
                A Mega Serviços Digitais Ltda mantém presença digital com informações institucionais, canais formais de contato e apresentação objetiva de sua atividade empresarial. O objetivo é facilitar a validação por parceiros, corretoras, prestadores de serviço e instituições que solicitam site oficial da empresa.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-300">
                O atendimento é realizado de forma organizada, com alinhamento prévio da demanda e análise das informações sempre que necessário, garantindo mais clareza, segurança e profissionalismo na comunicação com terceiros.
              </p>
            </div>

            <div className="rounded-[28px] border border-cyan-300/10 bg-[#0b1728] p-8">
              <h3 className="text-xl font-semibold text-white">Dados institucionais</h3>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div>
                  <div className="text-slate-400">Razão social</div>
                  <div className="font-medium text-white">Mega Serviços Digitais Ltda</div>
                </div>
                <div>
                  <div className="text-slate-400">CNPJ</div>
                  <div className="font-medium text-white">{CNPJ_EMPRESA}</div>
                </div>
                <div>
                  <div className="text-slate-400">Atividade</div>
                  <div className="font-medium text-white">
                    Intermediação e agenciamento de serviços e negócios em geral
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Domínio</div>
                  <div className="font-medium text-white">{DOMINIO_EMPRESA}</div>
                </div>
                <div>
                  <div className="text-slate-400">E-mail</div>
                  <div className="font-medium text-white">{EMAIL_EMPRESA}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="vantagens" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {vantagens.map((item) => (
              <div
                key={item.titulo}
                className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
              Como funciona
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Atendimento com análise prévia e organização operacional
            </h2>
            <p className="mt-4 text-slate-300">
              O fluxo abaixo resume a forma como a empresa recebe solicitações, avalia informações e conduz o atendimento com mais clareza e segurança.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {etapas.map((item) => (
              <div
                key={item.numero}
                className="rounded-[28px] border border-cyan-300/10 bg-gradient-to-b from-white/8 to-white/4 p-6"
              >
                <div className="text-sm font-semibold text-cyan-300">{item.numero}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-[#0a1526] p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Atendimento institucional
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Atendimento com organização e análise prévia
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                A Mega Serviços Digitais Ltda realiza atendimento corporativo com análise inicial das informações e acompanhamento conforme a natureza de cada solicitação, buscando mais clareza, organização e segurança em todo o processo de contato.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold text-white">Privacidade e atendimento</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              As informações enviadas por este site são utilizadas exclusivamente para contato, análise inicial da solicitação e continuidade do atendimento comercial da empresa.
            </p>

            <a
              href="/compliance"
              className="mt-6 inline-flex rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Acessar Compliance Center
            </a>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Contato institucional
              </p>
              <h2 className="mt-3 text-3xl font-bold">Fale com a Mega Serviços Digitais Ltda</h2>
              <p className="mt-4 text-slate-300">
                Para mais informações ou solicitações comerciais, entre em contato pelos canais oficiais da empresa.
              </p>

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div>
                  <div className="text-slate-400">Empresa</div>
                  <div className="font-medium text-white">Mega Serviços Digitais Ltda</div>
                </div>
                <div>
                  <div className="text-slate-400">E-mail</div>
                  <div className="font-medium text-white">{EMAIL_EMPRESA}</div>
                </div>
                <div>
                  <div className="text-slate-400">WhatsApp</div>
                  <div className="font-medium text-white">+55 24 99860-4138</div>
                </div>
                <div>
                  <div className="text-slate-400">Site oficial</div>
                  <div className="font-medium text-white">{DOMINIO_EMPRESA}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-cyan-300/10 bg-[#0c182b] p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">Solicitar atendimento</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Preencha os dados abaixo. Ao enviar, o WhatsApp abrirá com sua mensagem formatada automaticamente.
                </p>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    label="Nome"
                    placeholder="Seu nome"
                    value={formData.nome}
                    error={errors.nome}
                    onChange={(value) => handleChange('nome', value)}
                  />

                  <FormField
                    label="Empresa"
                    placeholder="Nome da empresa"
                    value={formData.empresa}
                    error={errors.empresa}
                    onChange={(value) => handleChange('empresa', value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    label="E-mail"
                    type="email"
                    placeholder="seuemail@empresa.com"
                    value={formData.email}
                    error={errors.email}
                    onChange={(value) => handleChange('email', value)}
                  />

                  <FormField
                    label="WhatsApp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    error={errors.whatsapp}
                    onChange={(value) => handleChange('whatsapp', formatPhoneInput(value))}
                  />
                </div>

                <FormTextArea
                  label="Mensagem"
                  placeholder="Descreva brevemente sua solicitação"
                  value={formData.mensagem}
                  error={errors.mensagem}
                  onChange={(value) => handleChange('mensagem', value)}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar pelo WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 transition hover:scale-105"
      >
        WhatsApp
      </a>

      <footer className="border-t border-white/10 bg-[#050c16]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="font-medium text-white">Mega Serviços Digitais Ltda</div>
            <div>Intermediação e agenciamento de serviços e negócios em geral</div>
            <div>CNPJ: {CNPJ_EMPRESA}</div>
            <div>{EMAIL_EMPRESA}</div>
            <div>Barra Mansa - RJ, Brasil</div>
            <div>© 2026 Mega Serviços Digitais Ltda. Todos os direitos reservados.</div>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#inicio" className="transition hover:text-cyan-300">
              Início
            </a>
            <a href="#empresa" className="transition hover:text-cyan-300">
              Empresa
            </a>
            <a href="#como-funciona" className="transition hover:text-cyan-300">
              Como funciona
            </a>
            <a href="/compliance" className="transition hover:text-cyan-300">
              Compliance Center
            </a>
            <a
              href="/politicas/politica-privacidade-mega-servicos-digitais.pdf"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-cyan-300"
            >
              Privacidade
            </a>
            <a
              href="/politicas/termos-de-uso-mega-servicos-digitais.pdf"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-cyan-300"
            >
              Termos
            </a>
            <a href="#contato" className="transition hover:text-cyan-300">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
};

function FormField({
  label,
  value,
  placeholder,
  error,
  type = 'text',
  onChange,
}: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 transition ${
          error
            ? 'border-red-400/70 focus:border-red-400'
            : 'border-white/10 focus:border-cyan-300/40'
        }`}
        placeholder={placeholder}
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

type FormTextAreaProps = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
};

function FormTextArea({
  label,
  value,
  placeholder,
  error,
  onChange,
}: FormTextAreaProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <textarea
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 transition ${
          error
            ? 'border-red-400/70 focus:border-red-400'
            : 'border-white/10 focus:border-cyan-300/40'
        }`}
        placeholder={placeholder}
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

function formatBTC(value: number | null) {
  if (value === null) return 'Carregando...';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUSDT(value: number | null) {
  if (value === null) return 'Carregando...';

  return value.toFixed(4);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhoneInput(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}