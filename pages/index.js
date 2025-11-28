// pages/index.js
import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Toast component */
function Toast({ type = "success", message }) {
  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </motion.div>
  );
}

export default function Home() {
  const [toast, setToast] = React.useState(null); // { type, message }
  const [sending, setSending] = React.useState(false);
  const toastTimerRef = React.useRef(null);

  // Clear toast timeout on unmount
  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const projects = [
    {
      title: "Project One",
      desc: "A brief one-liner about the project that highlights tech and impact.",
      tags: ["React", "Next.js", "AI"],
      url: "#",
    },
    {
      title: "Project Two",
      desc: "Short description that emphasizes outcome and scale.",
      tags: ["Node", "Express", "SQL"],
      url: "#",
    },
    {
      title: "Design System",
      desc: "Reusable UI library and components for consistent branding.",
      tags: ["Design", "Figma", "Tailwind"],
      url: "#",
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    };

    // basic client-side validation
    if (!payload.name || !payload.email || !payload.message) {
      showToast("error", "Please fill all fields before sending.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        showToast("success", "Message sent successfully!");
        form.reset();
      } else {
        // prefer server-provided message, otherwise fallback
        const msg = body?.error || body?.details || "Failed to send message.";
        showToast("error", msg);
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      showToast("error", "Internal server error. Try again later.");
    } finally {
      setSending(false);
    }
  }

  function showToast(type, message, timeout = 3500) {
    setToast({ type, message });
    // clear previous timer
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), timeout);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
      {/* Toast container */}
      <AnimatePresence>{toast && <Toast key={toast.message} type={toast.type} message={toast.message} />}</AnimatePresence>

      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 flex items-center justify-center shadow-xl">
            <span className="font-extrabold text-lg tracking-tight">PD</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Prakul Dhiman</h1>
            <p className="text-xs text-slate-300">AI & Frontend Developer • B.E. Candidate</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#about" className="hover:text-white">About</a>
          <a href="#education" className="hover:text-white">Education</a>
          <a href="#projects" className="hover:text-white">Projects</a>
          <a href="#contact" className="hover:text-white">Contact</a>

          {/* RESUME BUTTON */}
          <a href="/resume.pdf" download className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition">Resume</a>
        </nav>

        <div className="md:hidden">
          <button className="px-3 py-2 bg-white/6 rounded-md">Menu</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-8 items-center py-12">
          <div>
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="text-4xl md:text-5xl font-extrabold leading-tight">
              Modern product-focused developer
              <br /> who builds clean UX and reliable ML systems.
            </motion.h2>

            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6 text-slate-300 max-w-xl">
              I design and ship full-stack experiences: from prototyping delightful UIs to deploying scalable ML pipelines. Currently open to internships and collaborations.
            </motion.p>

            <div className="mt-8 flex items-center gap-4">
              <a href="#projects" className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 font-semibold shadow-lg">View Projects</a>
              <a href="#contact" className="inline-block text-sm px-4 py-2 border border-white/10 rounded-md">Let's talk</a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-slate-300">
              <a href="#" aria-label="github" className="hover:text-white flex items-center gap-2"><Github size={18} /> Github</a>
              <a href="#" aria-label="linkedin" className="hover:text-white flex items-center gap-2"><Linkedin size={18} /> LinkedIn</a>
              <a href="#contact" aria-label="email" className="hover:text-white flex items-center gap-2"><Mail size={18} /> Email</a>
            </div>
          </div>

          {/* RIGHT — FEATURED PROJECT CARD */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 shadow-2xl">
              <div className="bg-slate-900 p-8 rounded-2xl min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Featured Project</p>
                      <h3 className="text-lg font-semibold">Smart City Vision Net</h3>
                    </div>
                    <div className="text-xs text-slate-400">2025</div>
                  </div>

                  <p className="mt-4 text-slate-300">
                    A real-time computer vision service for smart-city analytics — number plate detection, object counting,
                    and traffic predictions.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded">Python</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded">TensorFlow</span>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded">Docker</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <a href="#projects" className="text-sm underline underline-offset-4">See Project</a>
                  <div className="text-xs text-slate-400">Live demo • Private</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full opacity-10 bg-gradient-to-tr from-indigo-500 to-pink-500 blur-3xl" />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h4 className="text-xl font-semibold">About me</h4>
              <p className="mt-4 text-slate-300 max-w-2xl">
                I’m a developer blending design sensibility with engineering rigor. I’ve built end-to-end systems for data collection,
                model training, and frontend delivery. I’m currently pursuing a B.E. in Computer Science (Hons.) with a focus on AI & ML —
                expected completion: June 2026. Current CGPA: <span className="font-semibold">7.19</span>.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-slate-400">Degree</p>
                  <p className="mt-1 font-semibold">B.E. (CSE Hons.) - AIML</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="mt-1 font-semibold">India</p>
                </div>
              </div>
            </div>

            <aside className="p-6 rounded-lg bg-white/3">
              <h5 className="text-sm text-slate-100 font-semibold">Quick Links</h5>
              <ul className="mt-4 text-slate-300 text-sm space-y-2">
                <li>Resume (PDF)</li>
                <li>Certificates</li>
                <li>Publications</li>
              </ul>
            </aside>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="py-12">
          <h4 className="text-xl font-semibold">Education</h4>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {/* Bachelor's */}
            <div className="p-6 rounded-xl bg-white/5">
              <h5 className="font-semibold text-lg">B.E. Computer Science (Hons.) — AI & ML</h5>
              <p className="mt-2 text-slate-300">Chandigarh University · 2022 – June 2026 </p>
              <p className="mt-2 text-sm text-slate-400">Current CGPA: <span className="font-semibold">7.19</span></p>
            </div>

            {/* Higher Secondary / Class 12 */}
            <div className="p-6 rounded-xl bg-white/5">
              <h5 className="font-semibold text-lg">Higher Secondary (Class 12)</h5>
              <p className="mt-2 text-slate-300">
                <span className="font-semibold">Govt. Sen. Sec. School, Una</span> · <span className="text-sm text-slate-400">HP Board</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">Year: <span className="font-semibold">2022</span> · Percentage: <span className="font-semibold">91.6%</span></p>
            </div>

            {/* Matriculation / Class 10 */}
            <div className="p-6 rounded-xl bg-white/5">
              <h5 className="font-semibold text-lg">Matriculation (Class 10)</h5>
              <p className="mt-2 text-slate-300">
                <span className="font-semibold">Mount Carmel Sen. Sec. School, Una</span> · <span className="text-sm text-slate-400">ICSE</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">Year: <span className="font-semibold">2020</span> · Percentage: <span className="font-semibold">88.67%</span></p>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-12">
          <h4 className="text-xl font-semibold">Selected Projects</h4>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.url}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="block p-6 rounded-xl bg-white/5 hover:bg-white/6"
              >
                <h5 className="font-semibold">{p.title}</h5>
                <p className="mt-2 text-sm text-slate-300">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-1 bg-white/4 rounded">{t}</span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h4 className="text-xl font-semibold">Get in touch</h4>
              <p className="mt-4 text-slate-300 max-w-xl">
                I’m open to internships, collaborations, and freelance work.
                Send a brief message and I’ll reply within a few hours.
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail size={16} /> <span>prakuldhiman04@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://www.linkedin.com/in/prakul-dhiman-03a088349/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-200 hover:text-white">
                    <Linkedin size={16} className="inline-block" />
                    <span className="text-sm leading-4">/in/prakul</span>
                  </a>
                </div>
              </div>
            </div>

            <form className="bg-white/5 p-6 rounded-xl" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">Name</label>
              <input name="name" disabled={sending} required className="mt-2 w-full rounded-md bg-slate-800 p-2 text-slate-100" />

              <label className="block text-sm text-slate-300 mt-4">Email</label>
              <input name="email" disabled={sending} type="email" required className="mt-2 w-full rounded-md bg-slate-800 p-2 text-slate-100" />

              <label className="block text-sm text-slate-300 mt-4">Message</label>
              <textarea name="message" disabled={sending} required className="mt-2 w-full rounded-md bg-slate-800 p-2 text-slate-100 min-h-[120px]" />

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className={`px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-semibold flex items-center gap-2 ${
                    sending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="resume" className="py-10 text-center text-slate-400">
          <div className="max-w-3xl mx-auto">
            {/* Neon Glow Name */}
            <p className="text-lg font-semibold tracking-wide text-slate-200">
              Designed & Developed by{" "}
              <span className="text-indigo-400 relative inline-block neon-glow">Prakul Dhiman</span>
            </p>

            <p className="mt-1 text-sm">Crafted with ❤️ using Next.js, React, Tailwind CSS & Framer Motion</p>

            <div className="mt-4 flex justify-center gap-6 text-slate-400 text-sm">
              <a href="https://github.com/" target="_blank" className="hover:text-indigo-400 transition">Github</a>
              <a href="https://linkedin.com/in/" target="_blank" className="hover:text-indigo-400 transition">LinkedIn</a>
              <a href="#contact" className="hover:text-indigo-400 transition">Contact Me</a>
            </div>

            <p className="mt-6 text-xs text-slate-500">© {new Date().getFullYear()} Prakul Dhiman. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
