const documentos = [
  {
    titulo: 'Política de Privacidade',
    descricao:
      'Diretrizes sobre coleta, uso, armazenamento e proteção de dados pessoais.',
    arquivo: '/politicas/politica-privacidade-mega-servicos-digitais.pdf',
  },
  {
    titulo: 'Termos de Uso',
    descricao:
      'Regras de utilização do site institucional e limites de responsabilidade.',
    arquivo: '/politicas/termos-de-uso-mega-servicos-digitais.pdf',
  },
  {
    titulo: 'Política de Compliance e KYC',
    descricao:
      'Práticas de conformidade, verificação de clientes e análise cadastral.',
    arquivo: '/politicas/politica-compliance-kyc-mega-servicos-digitais.pdf',
  },
  {
    titulo: 'Política de PLD / AML',
    descricao:
      'Diretrizes de prevenção à lavagem de dinheiro e combate a ilícitos financeiros.',
    arquivo: '/politicas/politica-pld-aml-mega-servicos-digitais.pdf',
  },
  {
    titulo: 'Política de Cookies',
    descricao:
      'Informações sobre uso de cookies e melhoria da experiência no site.',
    arquivo: '/politicas/politica-cookies-mega-servicos-digitais.pdf',
  },
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <a
            href="/"
            className="text-sm text-cyan-300 transition hover:text-cyan-200"
          >
            ← Voltar para o site
          </a>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
            Compliance Center
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Políticas e documentos institucionais
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Acesse abaixo os documentos institucionais da Mega Serviços Digitais
            Ltda, disponibilizados para consulta de parceiros, plataformas,
            clientes e instituições que necessitem validar informações da
            empresa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {documentos.map((doc) => (
            <div
              key={doc.titulo}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-semibold text-white">{doc.titulo}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {doc.descricao}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={doc.arquivo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Abrir PDF
                </a>

                <a
                  href={doc.arquivo}
                  download
                  className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/5"
                >
                  Baixar
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-cyan-300/10 bg-[#0c182b] p-8">
          <h3 className="text-2xl font-bold text-white">Informações institucionais</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>
              <span className="text-slate-400">Empresa:</span> Mega Serviços Digitais Ltda
            </p>
            <p>
              <span className="text-slate-400">CNPJ:</span> 62.445.816/0001-86
            </p>
            <p>
              <span className="text-slate-400">E-mail:</span> megaserv.digital@gmail.com
            </p>
            <p>
              <span className="text-slate-400">WhatsApp:</span> +55 24 99860-4138
            </p>
            <p>
              <span className="text-slate-400">Site:</span> www.megaservicosdigitais.com.br
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}