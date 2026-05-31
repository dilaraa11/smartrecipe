<script lang="ts">
  import { goto } from "$app/navigation";

  let mode = $state<"login" | "signup">("login");
  let name = $state("");
  let email = $state("");
  let password = $state("");
  let message = $state("");
  let error = $state("");
  let loading = $state(false);

  async function submitForm() {
    message = "";
    error = "";
    loading = true;

    try {
      const response = await fetch(
        mode === "login" ? "/api/auth/login" : "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        error = result.error ?? "Etwas ist schiefgelaufen.";
        return;
      }

      message =
        mode === "login"
          ? `Willkommen zurück, ${result.user.name}!`
          : `Dein Konto wurde erstellt, ${result.user.name}!`;

      name = "";
      email = "";
      password = "";
      goto("/");
    } catch {
      error = "Verbindung fehlgeschlagen. Bitte versuche es erneut.";
    } finally {
      loading = false;
    }
  }
</script>

<main class="page">
  <a class="back-button" href="/">Zurück zur Startseite</a>

  <section class="header">
    <p class="eyebrow">Benutzerkonto</p>
    <h1>{mode === "login" ? "Einloggen" : "Registrieren"}</h1>
    <p>
      Melde dich an oder erstelle ein Konto, um deine Rezepte und Favoriten
      persönlich zu verwalten.
    </p>
  </section>

  <section class="form-card auth-card">
    <div class="auth-switch" aria-label="Login oder Registrierung auswählen">
      <button
        class:active={mode === "login"}
        type="button"
        onclick={() => (mode = "login")}
      >
        Login
      </button>
      <button
        class:active={mode === "signup"}
        type="button"
        onclick={() => (mode = "signup")}
      >
        Signup
      </button>
    </div>

    {#if mode === "signup"}
      <label>
        Name
        <input bind:value={name} placeholder="Dein Name" />
      </label>
    {/if}

    <label>
      E-Mail
      <input bind:value={email} type="email" placeholder="name@example.com" />
    </label>

    <label>
      Passwort
      <input bind:value={password} type="password" placeholder="Passwort" />
    </label>

    <button class="primary-button" onclick={submitForm} disabled={loading}>
      {#if loading}
        Bitte warten...
      {:else}
        {mode === "login" ? "Einloggen" : "Konto erstellen"}
      {/if}
    </button>

    {#if message}
      <div class="message">{message}</div>
    {/if}
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
  </section>
</main>
