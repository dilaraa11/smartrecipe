<script lang="ts">
  let user = $state<{
    name: string;
    email: string;
    profileImageUrl?: string;
    username?: string;
    createdAt?: string;
    lastLoginAt?: string;
  } | null>(null);
  let loading = $state(true);
  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let username = $state("");
  let currentPassword = $state("");
  let newPassword = $state("");
  let message = $state("");
  let errorMessage = $state("");

  const profileChanged = $derived(
    Boolean(
      user &&
        (getFullName() !== user.name ||
          email !== user.email ||
          username !== (user.username ?? user.name)),
    ),
  );

  function splitName(fullName: string) {
    const [firstPart = "", ...rest] = fullName.trim().split(/\s+/);

    return {
      firstName: firstPart,
      lastName: rest.join(" "),
    };
  }

  function getFullName() {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
  }

  async function loadProfile() {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();

      user = result.user ?? null;

      if (user) {
        const nameParts = splitName(user.name);

        firstName = nameParts.firstName;
        lastName = nameParts.lastName;
        email = user.email;
        username = user.username ?? user.name;
      }
    } finally {
      loading = false;
    }
  }

  async function saveProfile() {
    message = "";
    errorMessage = "";
    const name = getFullName();

    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, username }),
    });

    const result = await response.json();

    if (!response.ok) {
      errorMessage = result.error ?? "Profil konnte nicht gespeichert werden.";
      return;
    }

    if (user) {
      user = { ...user, name, email, username };
    }

    message = "Profil wurde gespeichert.";
  }

  async function saveProfileImage(profileImageUrl: string) {
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileImageUrl }),
    });

    if (!response.ok) {
      throw new Error("Profilbild konnte nicht gespeichert werden.");
    }
  }

  async function uploadProfileImage(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      errorMessage = "Bitte wähle eine Bilddatei aus.";
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const profileImageUrl = String(reader.result);

        await saveProfileImage(profileImageUrl);
        user = { ...user, profileImageUrl };
        message = "Profilbild wurde gespeichert.";
        errorMessage = "";
      } catch (error) {
        console.error(error);
        errorMessage = "Profilbild konnte nicht gespeichert werden.";
      }
    };

    reader.readAsDataURL(file);
  }

  async function changePassword() {
    message = "";
    errorMessage = "";

    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await response.json();

    if (!response.ok) {
      errorMessage = result.error ?? "Passwort konnte nicht geändert werden.";
      return;
    }

    currentPassword = "";
    newPassword = "";
    message = "Passwort wurde geändert.";
  }

  function formatDate(value?: string) {
    if (!value) return "Noch nicht verfügbar";

    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  }

  $effect(() => {
    loadProfile();
  });
</script>

<main class="page">
  <a class="back-button" href="/">Zurück zur Startseite</a>

  {#if loading}
    <section class="status-card">
      <p>Profil wird geladen...</p>
    </section>
  {:else if !user}
    <section class="empty-card">
      <h2>Bitte einloggen</h2>
      <p>Du brauchst ein Konto, um dein Profil anzusehen.</p>
      <a href="/login">Zum Login</a>
    </section>
  {:else}
    <section class="header">
      <p class="eyebrow">Profil</p>
      <h1>Mein Profil</h1>
      <p>Verwalte deine persönlichen Angaben und dein Passwort.</p>
    </section>

    <section class="profile-card">
      <div class="profile-image-field">
        <div class="profile-avatar">
          {#if user.profileImageUrl}
            <img src={user.profileImageUrl} alt={`Profilbild von ${user.name}`} />
          {:else}
            <span>{user.name.slice(0, 1).toUpperCase()}</span>
          {/if}
        </div>

        <label class="profile-upload-button" for="profile-image" title="Profilbild hochladen">
          +
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onchange={uploadProfileImage}
          />
        </label>
      </div>

      <div class="profile-fields">
        <label>
          Vorname
          <input bind:value={firstName} />
        </label>

        <label>
          Nachname
          <input bind:value={lastName} />
        </label>

        <label>
          E-Mail
          <input bind:value={email} type="email" />
        </label>

        <label>
          Benutzername
          <input bind:value={username} />
        </label>

        <label>
          Mitglied seit
          <input value={formatDate(user.createdAt)} readonly />
        </label>

        <label>
          Letzte Anmeldung
          <input value={formatDate(user.lastLoginAt)} readonly />
        </label>
      </div>

      {#if profileChanged}
        <button class="profile-save-button" type="button" onclick={saveProfile}>
          Profil speichern
        </button>
      {/if}
    </section>

    <section class="password-card">
      <div class="password-heading">
        <h2>Passwort ändern</h2>
        <p>Aktuelles Passwort bestätigen und ein neues setzen.</p>
      </div>
      <div class="password-fields">
        <label>
          Aktuelles Passwort
          <input bind:value={currentPassword} type="password" />
        </label>

        <label>
          Neues Passwort
          <input bind:value={newPassword} type="password" />
        </label>

        <button type="button" onclick={changePassword}>Ändern</button>
      </div>
    </section>

    {#if message}
      <div class="message">{message}</div>
    {/if}
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  {/if}
</main>

<style>
  .profile-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .profile-image-field {
    position: relative;
    width: 8rem;
  }

  .profile-avatar {
    display: grid;
    place-items: center;
    width: 8rem;
    height: 8rem;
    overflow: hidden;
    border: 1px solid #ece5da;
    border-radius: 50%;
    background: #faf8f4;
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-avatar span {
    color: #1f1d1a;
    font-size: 3rem;
    font-weight: 900;
  }

  .profile-upload-button {
    position: absolute;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    margin: 0;
    border: 1px solid #1f1d1a;
    background: #1f1d1a;
    color: white;
    font-size: 1.4rem;
    font-weight: 900;
    cursor: pointer;
  }

  .profile-upload-button input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .profile-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .profile-fields label:nth-child(5),
  .profile-fields label:nth-child(6) {
    grid-column: 1 / -1;
  }

  .profile-fields input[readonly] {
    color: #68625a;
  }

  .profile-save-button {
    grid-column: 1 / -1;
    justify-self: end;
    width: auto;
    min-width: 10rem;
    min-height: 3.1rem;
    padding: 0 1.2rem;
    background: #1f1d1a;
    color: white;
    font-weight: 900;
  }

  .password-card {
    margin-top: 1.25rem;
    padding: 1rem 0 0;
    border-top: 1px solid #ece5da;
  }

  .password-heading {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 0.75rem;
  }

  .password-heading h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  .password-heading p {
    margin: 0;
    color: #68625a;
    font-size: 0.9rem;
  }

  .password-fields {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: end;
  }

  .password-fields button {
    min-height: 3.1rem;
    padding: 0 1.1rem;
    background: #1f1d1a;
    color: white;
    font-weight: 900;
  }

  @media (max-width: 760px) {
    .profile-card,
    .profile-fields,
    .password-fields {
      grid-template-columns: 1fr;
    }

    .profile-save-button,
    .password-fields button {
      width: 100%;
    }

    .password-heading {
      display: block;
    }

    .password-heading p {
      margin-top: 0.35rem;
    }
  }
</style>
