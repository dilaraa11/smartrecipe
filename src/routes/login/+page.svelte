<script lang="ts">
  let mode = $state<"login" | "signup">("login");
  let name = $state("");
  let email = $state("");
  let password = $state("");
  let message = $state("");

  function submitForm() {
    message =
      mode === "login"
        ? "Login ist vorbereitet."
        : "Registrierung ist vorbereitet.";

    name = "";
    email = "";
    password = "";
  }
</script>

<main class="page">
  <a class="back-button" href="/">Zurueck zur Startseite</a>

  <section class="header">
    <p class="eyebrow">Benutzerkonto</p>
    <h1>{mode === "login" ? "Einloggen" : "Registrieren"}</h1>
    <p>
      Melde dich an oder erstelle ein Konto, um deine Rezepte und Favoriten
      persönlich zu verwalten.
    </p>
  </section>

  <section class="form-card auth-card">
    <div class="auth-switch" aria-label="Login oder Registrierung auswaehlen">
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

    <button class="primary-button" onclick={submitForm}>
      {mode === "login" ? "Einloggen" : "Konto erstellen"}
    </button>

    {#if message}
      <div class="message">{message}</div>
    {/if}
  </section>
</main>
