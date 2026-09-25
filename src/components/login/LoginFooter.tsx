const footerLinks = [
  { label: 'Privacy Policy', href: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL },
  { label: 'Terms of Service', href: process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_URL },
  { label: 'Help Center', href: process.env.NEXT_PUBLIC_HELP_CENTER_URL },
  { label: 'Contact Us', href: process.env.NEXT_PUBLIC_CONTACT_URL },
];

const LoginFooter = () => (
  <footer className="relative z-10 flex min-h-[64px] shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-[#dce2ef] bg-[#f0f3ff] px-8 py-5 text-[#1B3061] max-sm:justify-center max-sm:px-5 max-sm:text-center">
    <p className="text-[11px] font-bold">© {new Date().getFullYear()} V Tasker. All rights reserved.</p>
    <nav aria-label="Legal and support" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] font-medium">
      {footerLinks.map(({ label, href }) => href ? (
        <a key={label} href={href} className="rounded-sm transition-colors hover:text-[#E68A2E] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061] focus-visible:ring-offset-4">
          {label}
        </a>
      ) : (
        <span key={label} aria-disabled="true">{label}</span>
      ))}
    </nav>
  </footer>
);

export default LoginFooter;
