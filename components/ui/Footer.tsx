import Wordmark from './Wordmark';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-aubergine text-bone">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Wordmark size={22} color="#ffffff" />
            <p className="mt-4 text-[14px] text-white/65 leading-[1.5] max-w-[28ch]">
              Forward Deployed Engineer at Lyra. Competitive programmer and Monash CS student. Based in Melbourne.
            </p>
          </div>

          <FooterColumn
            title="Navigate"
            links={[
              { label: 'About', href: '#about' },
              { label: 'Experience', href: '#experience' },
              { label: 'Work', href: '#work' },
              { label: 'Contact', href: '#contact' },
            ]}
          />
          <FooterColumn
            title="Elsewhere"
            links={[
              { label: 'GitHub', href: 'https://github.com/Swofty-Developments', external: true },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/swofty/', external: true },
              { label: 'Email', href: 'mailto:admin@swofty.net' },
            ]}
          />
          <FooterColumn
            title="Now"
            links={[
              { label: 'Forward-deployed at Lyra', href: '#experience' },
              { label: 'Studying at Monash', href: '#about' },
              { label: 'Open source projects', href: '#work' },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6 text-[13px] text-white/55">
          <span>© {year} Jacob Nardella · Swofty.</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lavender-chip" />
            Crafted in Melbourne.
          </span>
        </div>
      </div>
    </footer>
  );
}

type Link = { label: string; href: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: Link[] }) {
  return (
    <div>
      <h4 className="text-[12px] uppercase tracking-[0.18em] text-white/55 font-[540]">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              className="text-[14px] text-white/80 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
