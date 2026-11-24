import type { QuizQuestion } from "./schema";

export const quizQuestions: QuizQuestion[] = [
  // ═══════════════════════════════════════════
  // THEME 1: Mots de passe & Authentification
  // ═══════════════════════════════════════════
  {
    id: "auth-1",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Comment gérez-vous vos mots de passe professionnels ?",
    options: [
      { label: "J'ai des mots de passe uniques mais je les mémorise", value: 2 },
      { label: "J'utilise quelques mots de passe que je réutilise", value: 1 },
      { label: "J'ai un seul mot de passe pour tout", value: 0 },
      { label: "J'utilise un gestionnaire de mots de passe (ex: Bitwarden, 1Password)", value: 3 },
    ],
  },
  {
    id: "auth-2",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Utilisez-vous l'authentification à deux facteurs (2FA) ?",
    options: [
      { label: "Oui, avec une app d'authentification (TOTP/clé physique) sur tous mes comptes", value: 3 },
      { label: "Oui, par SMS sur mes comptes principaux", value: 2 },
      { label: "Non, je ne sais pas ce que c'est", value: 0 },
      { label: "Seulement quand c'est obligatoire", value: 1 },
    ],
  },
  {
    id: "auth-3",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Que privilégiez-vous pour vos mots de passe ?",
    options: [
      { label: "Des mots de passe longs et uniques que je mémorise", value: 2 },
      { label: "Je réutilise souvent le même mot de passe", value: 0 },
      { label: "Un gestionnaire génère des mots de passe longs et uniques", value: 3 },
      { label: "Des mots de passe uniques, mais plutôt courts", value: 1 },
    ],
  },
  {
    id: "auth-4",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Comment partagez-vous des accès avec vos collègues ?",
    options: [
      { label: "Par message chiffré (Signal, etc.)", value: 2 },
      { label: "Par email ou messagerie classique", value: 1 },
      { label: "Sur un post-it ou un document partagé", value: 0 },
      { label: "Via un gestionnaire de mots de passe avec partage sécurisé", value: 3 },
    ],
  },
  {
    id: "auth-5",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Que faites-vous si un mot de passe important est compromis ou exposé ?",
    options: [
      { label: "Je le change immédiatement et vérifie les autres comptes où il aurait été réutilisé", value: 3 },
      { label: "Je le garde, sauf si le service m'oblige à le changer", value: 0 },
      { label: "Je le change dès que je reçois une alerte crédible", value: 2 },
      { label: "J'attends d'avoir plus d'informations avant d'agir", value: 1 },
    ],
  },
  {
    id: "auth-6",
    theme: "Mots de passe & Authentification",
    themeIcon: "🔐",
    question: "Avez-vous vérifié si vos identifiants ont fuité (Have I Been Pwned, etc.) ?",
    options: [
      { label: "J'ai vérifié une fois", value: 1 },
      { label: "Non, jamais", value: 0 },
      { label: "Oui, je vérifie régulièrement", value: 2 },
      { label: "Oui, j'ai un monitoring automatique des fuites", value: 3 },
    ],
  },

  // ═══════════════════════════════════════════
  // THEME 2: Phishing & Ingénierie sociale
  // ═══════════════════════════════════════════
  {
    id: "phish-1",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Comment réagissez-vous face à un email suspect ?",
    options: [
      { label: "Je l'ignore et le supprime", value: 2 },
      { label: "Je vérifie l'expéditeur, les liens, et je le signale au service IT", value: 3 },
      { label: "Je clique parfois si ça semble urgent", value: 0 },
      { label: "Je l'ouvre par curiosité mais ne clique sur rien", value: 1 },
    ],
  },
  {
    id: "phish-2",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Savez-vous identifier un site web frauduleux ?",
    options: [
      { label: "Je me fie au cadenas dans la barre d'adresse", value: 1 },
      { label: "Je vérifie le nom de domaine et passe par une adresse ou un favori officiel", value: 3 },
      { label: "Je fais attention à l'URL principalement", value: 2 },
      { label: "Non, je ne sais pas comment vérifier", value: 0 },
    ],
  },
  {
    id: "phish-3",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Avez-vous suivi une formation ou sensibilisation au phishing ?",
    options: [
      { label: "Oui, formation régulière avec simulations de phishing", value: 3 },
      { label: "Oui, une formation ponctuelle", value: 2 },
      { label: "Non, aucune formation", value: 0 },
      { label: "Non, mais je m'informe par moi-même", value: 1 },
    ],
  },
  {
    id: "phish-4",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Si un collègue vous demande un virement urgent par email, que faites-vous ?",
    options: [
      { label: "J'exécute si c'est mon supérieur", value: 0 },
      { label: "Je vérifie l'adresse email de l'expéditeur en détail", value: 2 },
      { label: "Je vérifie par un autre canal (téléphone, en personne) avant d'agir", value: 3 },
      { label: "J'hésite mais je pourrais exécuter si ça semble crédible", value: 1 },
    ],
  },
  {
    id: "phish-5",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Connaissez-vous les techniques de vishing (phishing par téléphone) et smishing (par SMS) ?",
    options: [
      { label: "Oui, je sais les identifier et j'ai des réflexes défensifs", value: 3 },
      { label: "J'en ai entendu parler et je reste méfiant", value: 2 },
      { label: "Non, je découvre ces termes", value: 0 },
      { label: "Vaguement, je ne suis pas sûr de les reconnaître", value: 1 },
    ],
  },
  {
    id: "phish-6",
    theme: "Phishing & Ingénierie sociale",
    themeIcon: "🎣",
    question: "Que faites-vous des pièces jointes inattendues ?",
    options: [
      { label: "Je ne les ouvre que si je connais l'expéditeur", value: 2 },
      { label: "J'ouvre tout ce que je reçois", value: 0 },
      { label: "Je les ouvre si le sujet me semble pertinent", value: 1 },
      { label: "Je les scanne avec un antivirus et vérifie la source avant ouverture", value: 3 },
    ],
  },

  // ═══════════════════════════════════════════
  // THEME 3: Protection des données & RGPD
  // ═══════════════════════════════════════════
  {
    id: "data-1",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Comment gérez-vous les données sensibles (clients, RH, finances) ?",
    options: [
      { label: "Chiffrées, avec contrôle d'accès strict et journalisation", value: 3 },
      { label: "Accès restreint avec des permissions par rôle", value: 2 },
      { label: "Accessibles librement dans le réseau interne", value: 0 },
      { label: "Stockées dans des dossiers partagés avec un mot de passe", value: 1 },
    ],
  },
  {
    id: "data-2",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Votre organisation a-t-elle une politique RGPD formalisée ?",
    options: [
      { label: "Oui, les bases sont en place (mentions légales, consentement)", value: 2 },
      { label: "Non, ou je ne sais pas", value: 0 },
      { label: "C'est en cours de mise en place", value: 1 },
      { label: "Oui, avec des règles adaptées, les contacts identifiés et les procédures nécessaires", value: 3 },
    ],
  },
  {
    id: "data-3",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Effectuez-vous des sauvegardes régulières de vos données critiques ?",
    options: [
      { label: "Non, pas de sauvegardes", value: 0 },
      { label: "Manuellement de temps en temps", value: 1 },
      { label: "Oui, sauvegardes automatiques sur un support", value: 2 },
      { label: "Oui, sauvegardes automatiques 3-2-1 (3 copies, 2 supports, 1 hors site)", value: 3 },
    ],
  },
  {
    id: "data-4",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Comment supprimez-vous les données dont vous n'avez plus besoin ?",
    options: [
      { label: "Suppression standard puis vidage de la corbeille", value: 2 },
      { label: "Je mets à la corbeille sans la vider", value: 1 },
      { label: "Je respecte les durées de conservation puis j'utilise la procédure d'effacement adaptée au support", value: 3 },
      { label: "Je ne supprime rien, tout reste stocké", value: 0 },
    ],
  },
  {
    id: "data-5",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Utilisez-vous le chiffrement pour vos communications professionnelles ?",
    options: [
      { label: "J'utilise des messageries chiffrées (Signal, Teams avec chiffrement)", value: 2 },
      { label: "Oui, emails chiffrés (PGP/S-MIME) et messagerie chiffrée de bout en bout", value: 3 },
      { label: "Non, tout est en clair", value: 0 },
      { label: "Uniquement pour les données très sensibles", value: 1 },
    ],
  },
  {
    id: "data-6",
    theme: "Protection des données & RGPD",
    themeIcon: "🛡️",
    question: "Savez-vous quoi faire en cas de violation de données (data breach) ?",
    options: [
      { label: "Non, aucune idée de la procédure", value: 0 },
      { label: "Oui, je connais la procédure et les personnes à prévenir rapidement", value: 3 },
      { label: "J'ai une idée générale et je sais qui contacter", value: 2 },
      { label: "Je préviendrais mon manager", value: 1 },
    ],
  },

  // ═══════════════════════════════════════════
  // THEME 4: Sécurité des postes & réseaux
  // ═══════════════════════════════════════════
  {
    id: "infra-1",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "Vos postes de travail sont-ils protégés par un antivirus/EDR ?",
    options: [
      { label: "Oui, EDR professionnel avec monitoring centralisé", value: 3 },
      { label: "La protection intégrée est activée, mais je ne sais pas si elle est à jour", value: 1 },
      { label: "Non, pas de protection particulière", value: 0 },
      { label: "Oui, antivirus à jour sur tous les postes", value: 2 },
    ],
  },
  {
    id: "infra-2",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "À quelle fréquence mettez-vous à jour vos logiciels et systèmes ?",
    options: [
      { label: "De temps en temps, quand j'y pense", value: 1 },
      { label: "Mises à jour automatiques + politique de patch management", value: 3 },
      { label: "Dès que je reçois une notification de mise à jour", value: 2 },
      { label: "Rarement, je reporte souvent les mises à jour", value: 0 },
    ],
  },
  {
    id: "infra-3",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "Comment accédez-vous aux ressources professionnelles à distance ?",
    options: [
      { label: "Je me connecte directement sans outil prévu par mon organisation", value: 0 },
      { label: "J'utilise le VPN ou la solution d'accès à distance approuvée", value: 2 },
      { label: "J'utilise uniquement les outils sécurisés et gérés par mon organisation", value: 3 },
      { label: "J'utilise parfois un VPN personnel, surtout sur un Wi-Fi public", value: 1 },
    ],
  },
  {
    id: "infra-4",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "Comment sécurisez-vous votre réseau WiFi professionnel ?",
    options: [
      { label: "WPA3, réseau invité séparé, administration protégée et équipement à jour", value: 3 },
      { label: "Je ne sais pas quelle sécurité est en place", value: 0 },
      { label: "WPA2 avec mot de passe fort et réseau invité", value: 2 },
      { label: "WPA2 avec un mot de passe simple", value: 1 },
    ],
  },
  {
    id: "infra-5",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "Votre organisation utilise-t-elle un pare-feu (firewall) ?",
    options: [
      { label: "Non, ou je ne sais pas", value: 0 },
      { label: "Oui, pare-feu nouvelle génération (NGFW) avec IDS/IPS", value: 3 },
      { label: "Oui, pare-feu matériel ou logiciel configuré", value: 2 },
      { label: "Le pare-feu par défaut du routeur", value: 1 },
    ],
  },
  {
    id: "infra-6",
    theme: "Sécurité des postes & réseaux",
    themeIcon: "💻",
    question: "Verrouillez-vous votre poste quand vous vous absentez ?",
    options: [
      { label: "Oui, manuellement à chaque fois", value: 2 },
      { label: "Non, mon poste reste déverrouillé", value: 0 },
      { label: "Toujours, avec verrouillage automatique après 2-5 minutes", value: 3 },
      { label: "Parfois, quand j'y pense", value: 1 },
    ],
  },

  // ═══════════════════════════════════════════
  // THEME 5: Cybersécurité & Finance
  // ═══════════════════════════════════════════
  {
    id: "fin-1",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Comment sécurisez-vous vos comptes bancaires et de trading en ligne ?",
    options: [
      { label: "2FA activé et notifications de transactions", value: 2 },
      { label: "2FA matérielle, alertes en temps réel, IP whitelisting quand possible", value: 3 },
      { label: "Mot de passe simple, pas de 2FA", value: 0 },
      { label: "Mot de passe fort uniquement", value: 1 },
    ],
  },
  {
    id: "fin-2",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Savez-vous reconnaître une arnaque bancaire (faux conseiller, faux RIB) ?",
    options: [
      { label: "Non, je n'y ai jamais réfléchi", value: 0 },
      { label: "J'ai une bonne idée mais je pourrais me faire avoir par un scénario sophistiqué", value: 2 },
      { label: "Oui, je connais les scénarios courants et je vérifie systématiquement", value: 3 },
      { label: "Je fais confiance aux appels qui semblent venir de ma banque", value: 1 },
    ],
  },
  {
    id: "fin-3",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Comment protégez-vous vos actifs crypto (si applicable) ?",
    options: [
      { label: "Exchange avec mot de passe uniquement", value: 1 },
      { label: "Je n'ai pas de crypto / pas de mesures particulières", value: 0 },
      { label: "Hardware wallet, seed phrase stockée hors ligne, pas sur exchange", value: 3 },
      { label: "Exchange réputé avec 2FA et retrait whitelist", value: 2 },
    ],
  },
  {
    id: "fin-4",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Vérifiez-vous les coordonnées bancaires (RIB/IBAN) lors d'un virement important ?",
    options: [
      { label: "Rarement, je fais confiance à l'email reçu", value: 1 },
      { label: "Toujours, par double vérification via un canal séparé", value: 3 },
      { label: "Oui, je compare avec les informations en ma possession", value: 2 },
      { label: "Non, j'utilise directement le RIB fourni", value: 0 },
    ],
  },
  {
    id: "fin-5",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Surveillez-vous vos relevés bancaires pour détecter des transactions suspectes ?",
    options: [
      { label: "Oui, alertes automatiques + vérification hebdomadaire", value: 3 },
      { label: "Non, je ne vérifie presque jamais", value: 0 },
      { label: "De temps en temps, quand j'y pense", value: 1 },
      { label: "Je vérifie mes relevés régulièrement", value: 2 },
    ],
  },
  {
    id: "fin-6",
    theme: "Cybersécurité & Finance",
    themeIcon: "💰",
    question: "Utilisez-vous des cartes virtuelles ou des plafonds de paiement pour vos achats en ligne ?",
    options: [
      { label: "Non, j'utilise ma carte bancaire principale partout", value: 0 },
      { label: "J'utilise des cartes virtuelles pour les sites inconnus", value: 2 },
      { label: "J'ai un plafond mais j'utilise ma carte principale", value: 1 },
      { label: "Oui, carte virtuelle à usage unique + plafonds adaptés", value: 3 },
    ],
  },
];

export const themes = [
  "Mots de passe & Authentification",
  "Phishing & Ingénierie sociale",
  "Protection des données & RGPD",
  "Sécurité des postes & réseaux",
  "Cybersécurité & Finance",
];

