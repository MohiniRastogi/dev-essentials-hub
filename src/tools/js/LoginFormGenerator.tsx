import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ToolPanel } from "@/components/common/ToolShell";
import { CodeOutput, Field, inputClass } from "./_shared/CodeOutput";

export function LoginFormGenerator() {
  const [title, setTitle] = useState("Sign in");
  const [emailLabel, setEmailLabel] = useState("Email address");
  const [passwordLabel, setPasswordLabel] = useState("Password");
  const [buttonText, setButtonText] = useState("Log in");
  const [minLength, setMinLength] = useState(8);
  const [showToggle, setShowToggle] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const safeMin = Math.max(1, Math.min(64, Number.isFinite(minLength) ? minLength : 8));

  const code = `<!-- Login form -->
<form id="login-form" novalidate>
  <h2>${title}</h2>

  <label for="login-email">${emailLabel}</label>
  <input id="login-email" name="email" type="email" autocomplete="email" required />

  <label for="login-password">${passwordLabel}</label>
  <div class="password-row">
    <input id="login-password" name="password" type="password" autocomplete="current-password" required />
${showToggle ? `    <button type="button" id="toggle-password" aria-label="Show password">Show</button>\n` : ""}  </div>
${rememberMe ? `\n  <label class="remember">\n    <input id="login-remember" name="remember" type="checkbox" /> Remember me\n  </label>\n` : ""}
  <p id="login-error" role="alert" hidden></p>
  <button type="submit">${buttonText}</button>
</form>

<script>
  (function () {
    var form = document.getElementById("login-form");
    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");
    var error = document.getElementById("login-error");
${showToggle ? `    var toggle = document.getElementById("toggle-password");

    toggle.addEventListener("click", function () {
      var hidden = password.type === "password";
      password.type = hidden ? "text" : "password";
      toggle.textContent = hidden ? "Hide" : "Show";
      toggle.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    });
` : ""}
    function showError(message) {
      error.textContent = message;
      error.hidden = !message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;

      if (!email.value.trim()) return showError("${emailLabel} is required.");
      if (!emailPattern.test(email.value.trim())) return showError("Enter a valid email address.");
      if (!password.value) return showError("${passwordLabel} is required.");
      if (password.value.length < ${safeMin}) {
        return showError("${passwordLabel} must be at least ${safeMin} characters.");
      }

      showError("");
      // Replace with your own submit logic (fetch, redirect, etc.)
      console.log("Login submitted", {
        email: email.value.trim(),
        password: password.value${rememberMe ? `,\n        remember: document.getElementById("login-remember").checked` : ""}
      });
    });
  })();
</script>`;

  function validatePreview(e: React.FormEvent) {
    e.preventDefault();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.trim()) return setPreviewError(`${emailLabel} is required.`);
    if (!pattern.test(email.trim())) return setPreviewError("Enter a valid email address.");
    if (!password) return setPreviewError(`${passwordLabel} is required.`);
    if (password.length < safeMin)
      return setPreviewError(`${passwordLabel} must be at least ${safeMin} characters.`);
    setPreviewError("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel title="Controls">
        <div className="grid gap-4">
          <Field label="Form title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Email field label">
            <input value={emailLabel} onChange={(e) => setEmailLabel(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Password field label">
            <input value={passwordLabel} onChange={(e) => setPasswordLabel(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Button text">
            <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Minimum password length">
            <input
              type="number"
              min={1}
              max={64}
              value={minLength}
              onChange={(e) => setMinLength(parseInt(e.target.value, 10) || 1)}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showToggle} onChange={(e) => setShowToggle(e.target.checked)} />
            Show / hide password toggle
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Include “Remember me” checkbox
          </label>
        </div>
      </ToolPanel>

      <ToolPanel title="Live preview">
        <form onSubmit={validatePreview} className="grid gap-3 rounded-xl border border-border bg-card/40 p-5" noValidate>
          <h3 className="text-lg font-bold">{title || "Sign in"}</h3>
          <Field label={emailLabel || "Email"}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} type="email" />
          </Field>
          <Field label={passwordLabel || "Password"}>
            <div className="flex gap-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                type={previewVisible ? "text" : "password"}
              />
              {showToggle && (
                <button
                  type="button"
                  aria-label={previewVisible ? "Hide password" : "Show password"}
                  onClick={() => setPreviewVisible((v) => !v)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-card/40"
                >
                  {previewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </Field>
          {rememberMe && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" /> Remember me
            </label>
          )}
          {previewError ? (
            <p className="text-sm text-destructive">{previewError}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Submit to test the generated validation rules.</p>
          )}
          <button
            type="submit"
            className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {buttonText || "Log in"}
          </button>
        </form>
      </ToolPanel>

      <CodeOutput
        title="Generated HTML + JS"
        code={code}
        filename="login-form.html"
        mime="text/html"
        className="lg:col-span-2"
      />
    </div>
  );
}
