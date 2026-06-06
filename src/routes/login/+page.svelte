<script lang="ts">
  import { goto } from "$app/navigation";

  let mode = $state<"login" | "signup">("login");
  let firstName = $state("");
  let lastName = $state("");
  let username = $state("");
  let identifier = $state("");
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
            firstName,
            lastName,
            username,
            identifier,
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

      firstName = "";
      lastName = "";
      username = "";
      identifier = "";
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
        Register
      </button>
    </div>

    {#if mode === "signup"}
      <label>
        Vorname
        <input bind:value={firstName} placeholder="Dein Vorname" />
      </label>

      <label>
        Nachname
        <input bind:value={lastName} placeholder="Dein Nachname" />
      </label>

      <label>
        Benutzername
        <input bind:value={username} placeholder="Dein Benutzername" />
      </label>
    {/if}

    {#if mode === "login"}
      <label>
        E-Mail oder Benutzername
        <input bind:value={identifier} placeholder="name@example.com oder Benutzername" />
      </label>
    {:else}
      <label>
        E-Mail
        <input bind:value={email} type="email" placeholder="name@example.com" />
      </label>
    {/if}

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
