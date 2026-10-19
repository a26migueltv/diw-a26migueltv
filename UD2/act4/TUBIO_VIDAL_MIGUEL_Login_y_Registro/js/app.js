/* =========================================================
   Nodo · Login y registro
   Lógica del sistema de autenticación (simulado en el navegador).

   No hay servidor: los usuarios se guardan en localStorage y el
   "correo" con el código de verificación se muestra como una
   notificación en pantalla. Las contraseñas se guardan cifradas
   con SHA-256, nunca en texto plano.
   ========================================================= */
"use strict";

(() => {
  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const ICONS = {
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 5.5 8.5-5.5"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.7v.2"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    checkBig: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  /* ---------- Almacenamiento ---------- */
  const KEYS = {
    users: "nodo_usuarios",
    flow: "nodo_flujo",
    session: "nodo_sesion",
    lastEmail: "nodo_ultimo_email",
  };

  const store = {
    get(key, area = localStorage) {
      try {
        return JSON.parse(area.getItem(key));
      } catch {
        return null;
      }
    },
    set(key, value, area = localStorage) {
      try {
        area.setItem(key, JSON.stringify(value));
      } catch {
        /* almacenamiento no disponible: la demo sigue funcionando en memoria */
      }
    },
    remove(key, area = localStorage) {
      try {
        area.removeItem(key);
      } catch {
        /* nada que borrar */
      }
    },
  };

  /** SHA-256 de un texto (con alternativa simple si el navegador no tiene crypto.subtle). */
  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const data = new TextEncoder().encode(text);
      const buffer = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 0;
    for (const ch of text) h = (h * 31 + ch.codePointAt(0)) | 0;
    return "h" + h;
  }

  const Users = {
    all() {
      return store.get(KEYS.users) || {};
    },
    find(email) {
      return this.all()[email.trim().toLowerCase()] || null;
    },
    save(user) {
      const all = this.all();
      all[user.email] = user;
      store.set(KEYS.users, all);
    },
  };

  /** Estado del flujo actual (registro o recuperación) entre páginas. */
  const Flow = {
    get: () => store.get(KEYS.flow, sessionStorage),
    set: (value) => store.set(KEYS.flow, value, sessionStorage),
    clear: () => store.remove(KEYS.flow, sessionStorage),
  };

  const Session = {
    get: () => store.get(KEYS.session) || store.get(KEYS.session, sessionStorage),
    start(user, remember) {
      const data = { email: user.email, nombre: user.nombre };
      store.set(KEYS.session, data, remember ? localStorage : sessionStorage);
    },
    end() {
      store.remove(KEYS.session);
      store.remove(KEYS.session, sessionStorage);
    },
  };

  /** Cuenta de prueba para poder iniciar sesión sin registrarse. */
  async function seedDemoUser() {
    if (Users.find("demo@nodo.app")) return;
    Users.save({
      nombre: "Demo",
      apellido: "Nodo",
      email: "demo@nodo.app",
      password: await hash("Demo1234!"),
      verificado: true,
    });
  }

  /* ---------- Validaciones ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const LEVELS = ["—", "Débil", "Media", "Fuerte", "Muy fuerte"];

  function passwordChecks(value) {
    return {
      len: value.length >= 8,
      case: /[a-záéíóúñ]/.test(value) && /[A-ZÁÉÍÓÚÑ]/.test(value),
      num: /\d/.test(value),
      sym: /[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ\s]/.test(value),
    };
  }

  /** Nivel de 0 (vacía) a 4. Sin 8 caracteres nunca pasa de "Débil". */
  function passwordScore(value) {
    if (!value) return 0;
    const checks = passwordChecks(value);
    const met = Object.values(checks).filter(Boolean).length;
    return checks.len ? met : 1;
  }

  const isStrong = (value) => passwordChecks(value).len && passwordScore(value) >= 3;

  const RULES = {
    nombre: (v) => (!v.trim() ? "Escribe tu nombre." : v.trim().length < 2 ? "El nombre es demasiado corto." : ""),
    apellido: (v) => (!v.trim() ? "Escribe tu apellido." : ""),
    email: (v) =>
      !v.trim()
        ? "Escribe tu correo electrónico."
        : !EMAIL_RE.test(v.trim())
          ? "Introduce un correo válido (ej. nombre@dominio.com)."
          : "",
    "password-login": (v) => (!v ? "Escribe tu contraseña." : ""),
    password: (v) =>
      !v
        ? "Crea una contraseña."
        : !isStrong(v)
          ? "Contraseña poco segura: usa al menos 8 caracteres y combina mayúsculas, minúsculas, números o símbolos."
          : "",
    confirm: (v, form) =>
      !v ? "Repite la contraseña." : v !== form.elements.password.value ? "Las contraseñas no coinciden." : "",
    terminos: (checked) => (checked ? "" : "Debes aceptar los términos y condiciones para continuar."),
  };

  /* ---------- Errores en los campos ---------- */
  function showFieldError(input, message) {
    const field = input.closest(".field");
    const error = document.getElementById(`${input.id}-error`);
    field?.classList.toggle("is-invalid", Boolean(message));
    field?.classList.remove("is-valid");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) {
      error.hidden = !message;
      if (message) error.querySelector("span").textContent = message;
    }
    return !message;
  }

  function validateInput(input) {
    const rule = RULES[input.dataset.rule];
    if (!rule) return true;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const message = rule(value, input.form, input);
    showFieldError(input, message);
    if (!message && input.type !== "checkbox" && input.value) {
      input.closest(".field")?.classList.add("is-valid");
    }
    return !message;
  }

  function validateForm(form) {
    let firstInvalid = null;
    for (const input of $$("[data-rule]", form)) {
      if (!validateInput(input) && !firstInvalid) firstInvalid = input;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  }

  /** Valida al salir del campo y corrige en vivo cuando ya había un error. */
  function liveValidation(form) {
    for (const input of $$("[data-rule]", form)) {
      if (input.type === "checkbox") {
        input.addEventListener("change", () => validateInput(input));
        continue;
      }
      input.addEventListener("blur", () => {
        if (input.value) validateInput(input);
      });
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field?.classList.contains("is-invalid") || field?.classList.contains("is-valid")) validateInput(input);
        hideFormError(form);
      });
    }
    // Si cambia la contraseña, vuelve a comprobar la confirmación
    const password = form.elements.password;
    const confirm = form.elements.confirm;
    if (password && confirm) {
      password.addEventListener("input", () => {
        if (confirm.value) validateInput(confirm);
      });
    }
  }

  function showFormError(form, html) {
    const box = $(".form-error", form);
    if (!box) return;
    box.querySelector("span").innerHTML = html;
    box.hidden = false;
  }

  function hideFormError(form) {
    const box = $(".form-error", form);
    if (box) box.hidden = true;
  }

  /* ---------- Componentes de interfaz ---------- */

  /** Botón de mostrar / ocultar contraseña. */
  function initPasswordToggles() {
    for (const button of $$(".field__toggle")) {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.getAttribute("aria-controls"));
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-pressed", String(show));
        button.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        input.focus();
      });
    }
  }

  /** Medidor de seguridad y lista de requisitos. */
  function initPasswordMeter(input) {
    const meter = $(`[data-meter-for="${input.id}"]`);
    const reqs = $(`[data-reqs-for="${input.id}"]`);
    const update = () => {
      const score = passwordScore(input.value);
      if (meter) {
        meter.dataset.level = String(score);
        meter.querySelector("strong").textContent = LEVELS[score];
      }
      if (reqs) {
        const checks = passwordChecks(input.value);
        for (const item of reqs.children) item.classList.toggle("is-ok", Boolean(checks[item.dataset.req]));
      }
    };
    input.addEventListener("input", update);
    update();
  }

  /** Muestra un spinner en el botón mientras se "procesa" la petición. */
  async function withLoading(button, task) {
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    button.disabled = true;
    try {
      await wait(650);
      return await task();
    } finally {
      button.classList.remove("is-loading");
      button.removeAttribute("aria-busy");
      button.disabled = false;
    }
  }

  /** Notificación flotante. timeout = 0 → se queda hasta cerrarla. */
  function toast({ title, text = "", code = "", icon = "info", timeout = 6000 }) {
    const container = $("#toasts");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML = `
      <div class="toast__icon" aria-hidden="true">${ICONS[icon]}</div>
      <div class="toast__body"><strong></strong><span></span>${code ? '<div class="toast__code"></div>' : ""}</div>
      <button class="toast__close" type="button" aria-label="Cerrar notificación">${ICONS.close}</button>`;
    el.querySelector("strong").textContent = title;
    el.querySelector("span").textContent = text;
    if (code) el.querySelector(".toast__code").textContent = code;
    const close = () => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    };
    el.querySelector(".toast__close").addEventListener("click", close);
    if (timeout) setTimeout(close, timeout);
    container.prepend(el);
  }

  /* ---------- Código de verificación ---------- */
  const CODE_TTL = 10 * 60 * 1000; // 10 minutos
  const RESEND_SECONDS = 45;
  const MAX_ATTEMPTS = 3;

  function generateCode() {
    const n = new Uint32Array(1);
    crypto.getRandomValues(n);
    return String(n[0] % 1000000).padStart(6, "0");
  }

  /** "Envía" un código nuevo: lo guarda en el flujo y avisa a la siguiente pantalla. */
  function issueCode(flow) {
    flow.code = generateCode();
    flow.expires = Date.now() + CODE_TTL;
    flow.attempts = MAX_ATTEMPTS;
    flow.sentAt = Date.now();
    flow.pendingToast = true;
    Flow.set(flow);
    return flow;
  }

  function showCodeEmail(flow) {
    toast({
      icon: "mail",
      title: `Correo simulado para ${flow.email}`,
      text:
        flow.mode === "registro"
          ? "Tu código para activar la cuenta de Nodo es:"
          : "Tu código para restablecer la contraseña es:",
      code: flow.code.replace(/(\d{3})(\d{3})/, "$1 $2"),
      timeout: 0,
    });
  }

  /* =========================================================
     PANTALLAS
     ========================================================= */

  /* ---------- Login ---------- */
  function initLogin() {
    const session = Session.get();
    if (session) {
      showWelcome(session);
      return;
    }

    const form = $("#login-form");
    const email = form.elements.email;
    const lastEmail = store.get(KEYS.lastEmail, sessionStorage);
    if (lastEmail) {
      email.value = lastEmail;
      store.remove(KEYS.lastEmail, sessionStorage);
      form.elements.password.focus();
    }

    liveValidation(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      hideFormError(form);
      if (!validateForm(form)) return;

      await withLoading($('button[type="submit"]', form), async () => {
        const user = Users.find(email.value);
        const passwordHash = await hash(form.elements.password.value);

        if (!user || user.password !== passwordHash) {
          showFormError(form, "El correo o la contraseña no son correctos.");
          form.elements.password.select();
          return;
        }
        if (!user.verificado) {
          showFormError(
            form,
            'Tu cuenta aún no está verificada. <button type="button" class="link-btn" data-verify>Verificar ahora</button>',
          );
          $("[data-verify]", form).addEventListener("click", () => {
            issueCode({ mode: "registro", email: user.email });
            location.href = "verificar-registro.html";
          });
          return;
        }

        Session.start(user, form.elements.recordar.checked);
        showWelcome(Session.get());
      });
    });

    for (const button of $$(".btn-social")) {
      button.addEventListener("click", () => {
        toast({
          icon: "info",
          title: `Continuar con ${button.dataset.provider}`,
          text: "El acceso con redes sociales necesita un servidor real; en esta demo es solo visual.",
        });
      });
    }
  }

  function showWelcome(session) {
    const card = $(".card");
    card.innerHTML = `
      <div class="badge badge--ok" aria-hidden="true">${ICONS.checkBig}</div>
      <div class="heading">
        <h1 id="titulo" tabindex="-1"></h1>
        <p>Has iniciado sesión como <strong></strong>.</p>
      </div>
      <button class="btn btn--secondary" type="button" id="logout">Cerrar sesión</button>`;
    $("h1", card).textContent = `¡Hola, ${session.nombre}!`;
    $("strong", card).textContent = session.email;
    $("h1", card).focus();
    $("#logout").addEventListener("click", () => {
      Session.end();
      location.reload();
    });
  }

  /* ---------- Registro ---------- */
  function initRegister() {
    const form = $("#register-form");
    liveValidation(form);
    initPasswordMeter(form.elements.password);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm(form)) return;

      await withLoading($('button[type="submit"]', form), async () => {
        const email = form.elements.email.value.trim().toLowerCase();
        const existing = Users.find(email);
        if (existing && existing.verificado) {
          showFieldError(form.elements.email, "Ya existe una cuenta con este correo. Prueba a iniciar sesión.");
          form.elements.email.focus();
          return;
        }

        Users.save({
          nombre: form.elements.nombre.value.trim(),
          apellido: form.elements.apellido.value.trim(),
          email,
          password: await hash(form.elements.password.value),
          verificado: false,
          creado: new Date().toISOString(),
        });

        issueCode({ mode: "registro", email });
        location.href = "verificar-registro.html";
      });
    });
  }

  /* ---------- Verificar código (registro y recuperación) ---------- */
  function initVerify(mode) {
    let flow = Flow.get();
    if (!flow || flow.mode !== mode || !flow.email) {
      location.replace(mode === "registro" ? "registro.html" : "recuperar.html");
      return;
    }

    for (const el of $$("[data-email]")) el.textContent = flow.email;
    if (flow.pendingToast) {
      showCodeEmail(flow);
      flow.pendingToast = false;
      Flow.set(flow);
    }

    const form = $("#code-form");
    const group = $("#code");
    const inputs = $$(".code__inputs input", form);
    const error = $("#code-error");
    const resend = $("#resend");
    const countdown = $("#countdown");

    const setError = (message) => {
      group.classList.remove("is-invalid");
      if (message) {
        void group.offsetWidth; // reinicia la animación de "temblor"
        group.classList.add("is-invalid");
      }
      error.hidden = !message;
      if (message) error.querySelector("span").textContent = message;
      for (const input of inputs) input.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const fill = (digits, start = 0) => {
      [...digits].slice(0, inputs.length - start).forEach((d, i) => (inputs[start + i].value = d));
      const next = inputs.find((input) => !input.value) || inputs[inputs.length - 1];
      next.focus();
    };

    inputs.forEach((input, i) => {
      input.addEventListener("focus", () => input.select());

      input.addEventListener("input", () => {
        const digits = input.value.replace(/\D/g, "");
        input.value = "";
        if (digits) fill(digits, i);
        if (group.classList.contains("is-invalid")) setError("");
        if (inputs.every((el) => el.value)) form.requestSubmit();
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && i > 0) {
          inputs[i - 1].value = "";
          inputs[i - 1].focus();
          event.preventDefault();
        } else if (event.key === "ArrowLeft" && i > 0) {
          inputs[i - 1].focus();
          event.preventDefault();
        } else if (event.key === "ArrowRight" && i < inputs.length - 1) {
          inputs[i + 1].focus();
          event.preventDefault();
        }
      });

      input.addEventListener("paste", (event) => {
        event.preventDefault();
        const digits = (event.clipboardData.getData("text") || "").replace(/\D/g, "");
        if (!digits) return;
        fill(digits, i);
        if (group.classList.contains("is-invalid")) setError("");
        if (inputs.every((el) => el.value)) form.requestSubmit();
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const code = inputs.map((el) => el.value).join("");
      if (code.length < inputs.length) {
        setError("Introduce los 6 dígitos del código.");
        inputs.find((el) => !el.value).focus();
        return;
      }

      await withLoading($('button[type="submit"]', form), async () => {
        flow = Flow.get();
        if (!flow.code || flow.attempts <= 0) {
          setError("Has agotado los intentos. Pide un código nuevo.");
          return;
        }
        if (Date.now() > flow.expires) {
          setError("El código ha caducado. Pide uno nuevo.");
          return;
        }
        if (code !== flow.code) {
          flow.attempts -= 1;
          Flow.set(flow);
          setError(
            flow.attempts > 0
              ? `El código no es correcto. Te ${flow.attempts === 1 ? "queda 1 intento" : `quedan ${flow.attempts} intentos`}.`
              : "El código no es correcto y has agotado los intentos. Pide un código nuevo.",
          );
          inputs[0].focus();
          return;
        }

        // Código correcto
        group.classList.add("is-valid");
        if (mode === "registro") {
          const user = Users.find(flow.email);
          if (user) {
            user.verificado = true;
            Users.save(user);
          }
          store.set(KEYS.lastEmail, flow.email, sessionStorage);
          Flow.clear();
          await wait(350);
          location.href = "exito-cuenta.html";
        } else {
          delete flow.code;
          flow.verified = true;
          Flow.set(flow);
          await wait(350);
          location.href = "nueva-contrasena.html";
        }
      });
    });

    // Reenvío con cuenta atrás
    let timer = null;
    const tick = () => {
      const left = Math.max(0, RESEND_SECONDS - Math.floor((Date.now() - (Flow.get()?.sentAt || 0)) / 1000));
      resend.disabled = left > 0;
      countdown.textContent = left > 0 ? `· 0:${String(left).padStart(2, "0")}` : "";
      if (!left) clearInterval(timer);
    };
    const startTimer = () => {
      clearInterval(timer);
      tick();
      timer = setInterval(tick, 1000);
    };
    startTimer();

    resend.addEventListener("click", () => {
      flow = issueCode(Flow.get());
      showCodeEmail(flow);
      flow.pendingToast = false;
      Flow.set(flow);
      for (const input of inputs) input.value = "";
      setError("");
      inputs[0].focus();
      startTimer();
    });

    inputs[0].focus();
  }

  /* ---------- Recuperar contraseña ---------- */
  function initForgot() {
    const form = $("#forgot-form");
    liveValidation(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm(form)) return;

      await withLoading($('button[type="submit"]', form), async () => {
        const user = Users.find(form.elements.email.value);
        if (!user) {
          showFieldError(form.elements.email, "No hay ninguna cuenta registrada con este correo.");
          form.elements.email.focus();
          return;
        }
        issueCode({ mode: "recuperacion", email: user.email });
        location.href = "verificar-recuperacion.html";
      });
    });
  }

  /* ---------- Establecer nueva contraseña ---------- */
  function initNewPassword() {
    const flow = Flow.get();
    if (!flow || flow.mode !== "recuperacion" || !flow.verified) {
      location.replace("recuperar.html");
      return;
    }
    for (const el of $$("[data-email]")) el.textContent = flow.email;

    const form = $("#password-form");
    liveValidation(form);
    initPasswordMeter(form.elements.password);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm(form)) return;

      await withLoading($('button[type="submit"]', form), async () => {
        const user = Users.find(flow.email);
        const newHash = await hash(form.elements.password.value);
        if (user && user.password === newHash) {
          showFieldError(form.elements.password, "La nueva contraseña debe ser diferente de la anterior.");
          form.elements.password.focus();
          return;
        }
        if (user) {
          user.password = newHash;
          Users.save(user);
        }
        const session = Session.get();
        if (session && session.email === flow.email) Session.end();
        store.set(KEYS.lastEmail, flow.email, sessionStorage);
        Flow.clear();
        location.href = "exito-contrasena.html";
      });
    });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", async () => {
    initPasswordToggles();
    await seedDemoUser();

    const pages = {
      login: initLogin,
      registro: initRegister,
      "verificar-registro": () => initVerify("registro"),
      "verificar-recuperacion": () => initVerify("recuperacion"),
      recuperar: initForgot,
      "nueva-contrasena": initNewPassword,
    };
    pages[document.body.dataset.page]?.();
  });
})();
