import Image from "next/image";
import Link from "next/link";
import {
  Workflow,
  CheckCircle,
  Github,
  Twitter,
  GitBranch,
  Code2,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-primary selection:bg-primary selection:text-white min-h-screen flex flex-col">
      <nav className="max-w-[1200px] w-full mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tighter flex items-center gap-2 text-primary">
          <Image
            src="/logo/logo.svg"
            alt="Autoflow Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          AUTOFLOW
        </div>
        <div className="hidden md:flex gap-8 font-semibold uppercase text-sm tracking-widest text-primary">
          <Link href="/workflows" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/credentials" className="hover:underline">
            Credentials
          </Link>
          <Link
            href="https://github.com/imsidkg/autoflow"
            className="hover:underline"
          >
            Open Source
          </Link>
        </div>
        <Link
          href="/login"
          className="border-2 border-primary px-6 py-2 font-bold uppercase text-sm tracking-widest hover:bg-primary hover:text-white transition-colors text-primary"
        >
          Login
        </Link>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-zinc-900 border-2 border-primary p-8 custom-shadow">
              <div className="aspect-video mb-8 border-2 border-primary overflow-hidden relative">
                <Image
                  alt="Abstract flow visualization"
                  src="/bright-orange-gradient-swirl.jpeg"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-3xl font-extrabold mb-4 leading-tight uppercase tracking-tight text-foreground dark:text-white">
                Automate with <br />
                Google Forms & APIs
              </h2>
              <p className="mb-8 text-lg opacity-90 text-primary">
                Trigger complex workflows directly from Google Forms or our
                robust API. Autoflow connects your data sources to powerful
                execution engines.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="bg-primary text-white px-8 py-4 font-bold hover:opacity-90 transition-opacity uppercase text-sm tracking-widest"
                >
                  Get Started
                </Link>
                <Link
                  href="/workflows"
                  className="border-2 border-primary text-primary px-8 py-4 font-bold hover:bg-primary hover:text-white transition-all uppercase text-sm tracking-widest"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.0] tracking-tighter uppercase text-foreground dark:text-white">
              The Engine <br />
              For Modern <br />
              Automation
            </h1>
            <p className="text-xl mb-10 opacity-90 leading-relaxed max-w-lg text-muted-foreground">
              Built for developers and power users. Create workflows with our
              visual editor, manage executions, and integrate seamlessly with
              your existing stack.
            </p>
            <ul className="space-y-4 font-bold uppercase text-sm tracking-wide text-foreground dark:text-white">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                Google Form & Manual Triggers
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                Visual Workflow Diagram Editor
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                Real-time Execution Tracking
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                Secure API & Webhook Support
              </li>
            </ul>
          </div>
        </div>
      </main>

      <section className="border-y-2 border-primary py-12 mb-24 overflow-hidden w-full">
        <div className="max-w-[1200px] mx-auto px-6 overflow-hidden relative">
          <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-60 font-bold uppercase tracking-widest text-sm text-primary">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 shrink-0">
                {[
                  "Retool",
                  "Zapier",
                  "Airtable",
                  "Typeform",
                  "Notion",
                  "Retool",
                  "Zapier",
                  "Airtable",
                  "Typeform",
                  "Notion",
                ].map((company, j) => (
                  <span key={`${i}-${j}`}>{company}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-zinc-900 w-full">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-center text-4xl font-black uppercase tracking-tighter mb-20 underline decoration-4 underline-offset-8 decoration-primary text-primary">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <GitBranch className="w-16 h-16 mb-6 text-primary" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-primary">
                Flexible Triggers
              </h3>
              <p className="text-primary font-medium">
                Start workflows your way. Use our built-in Google Form
                integration or trigger executions manually via the dashboard or
                API.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Code2 className="w-16 h-16 mb-6 text-primary" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-primary">
                Visual Editor
              </h3>
              <p className="text-primary font-medium">
                Design your automation logic with our intuitive node-based
                editor. Visualize flow control and dependency management
                effortlessly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Layers className="w-16 h-16 mb-6 text-primary" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-primary">
                Robust Execution
              </h3>
              <p className="text-primary font-medium">
                Powered by robust backend services, ensuring your long-running
                tasks and complex data pipelines execute reliably every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t-2 border-primary w-full">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-center text-4xl font-black uppercase tracking-tighter mb-20 underline decoration-4 underline-offset-8 decoration-primary text-primary">
            Seamless Integrations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center text-center">
            {["Gemini", "Anthropic", "Forms", "Discord", "Open AI", "HTTP"].map(
              (tech) => (
                <div
                  key={tech}
                  className="p-8 border-2 border-primary group hover:bg-primary transition-colors cursor-pointer"
                >
                  <span className="text-xl font-black group-hover:text-white tracking-widest text-primary uppercase">
                    {tech}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-primary w-full py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-white text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase">
            START AUTOMATING TODAY
          </h2>
          <p className="text-white text-xl mb-12 max-w-2xl mx-auto font-bold uppercase tracking-wide leading-relaxed">
            JOIN THOUSANDS OF ENGINEERS BUILDING THE FUTURE OF OPERATIONS. FREE
            FOREVER FOR INDIVIDUALS, POWERFUL ENOUGH FOR THE FORTUNE 500.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary px-12 py-6 text-2xl font-black hover:bg-opacity-95 transition-all uppercase tracking-tighter border-4 border-white active:translate-x-1 active:translate-y-1"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="max-w-[1200px] w-full mx-auto px-6 py-12 border-t-2 border-primary flex flex-col md:flex-row justify-between items-center gap-8 text-primary">
        <div className="text-xl font-black tracking-tighter">
          AUTOFLOW © 2026
        </div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Terms
          </Link>
          <Link
            href="https://github.com/imsidkg/autoflow"
            className="hover:underline"
          >
            GitHub
          </Link>
          <Link href="https://twitter.com/imsidkg" className="hover:underline">
            Twitter
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            System Status: All Green
          </span>
        </div>
      </footer>
    </div>
  );
}
