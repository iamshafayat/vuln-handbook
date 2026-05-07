# 🛡️ vuln-handbook

> An interactive, hands-on web reference for learning common web vulnerabilities.

---

## 📖 About

**vuln-handbook** is an open educational resource designed to teach web application security through interactive demonstrations and clear explanations. Each vulnerability is covered in its own dedicated page with:

- **What it is** — plain-English explanation of the vulnerability
- **How it works** — technical breakdown and attack flow
- **Live demo** — interactive examples you can run in your browser
- **Prevention** — how to defend against it in real applications

This handbook is intended for use in classroom settings, security workshops, and self-study.

> ⚠️ **Disclaimer**: All demonstrations are sandboxed and for educational purposes only. Do **not** use these techniques on systems you do not own or have explicit permission to test.

---

## 🗂️ Vulnerabilities Covered

| # | Vulnerability | Status |
|---|---------------|--------|
| 1 | [Cross-Site Scripting (XSS)](https://iamshafayat.github.io/vuln-handbook/xss/) | ✅ Available |
| 2 | [Insecure Direct Object Reference (IDOR)](https://iamshafayat.github.io/vuln-handbook/idor/) | ✅ Available |
| 3 | [CMS Security (Wordpress)](https://iamshafayat.github.io/vuln-handbook/wp-security/) | ✅ Available |
| 4 | SQL Injection (SQLi) | 🔜 Coming Soon |
| 5 | Cross-Site Request Forgery (CSRF) | 🔜 Coming Soon |
| 6 | Command Injection | 🔜 Coming Soon |
| 7 | Broken Authentication | 🔜 Coming Soon |

More vulnerabilities will be added over time. Contributions welcome!

---

## 🚀 Getting Started

### View Online
**Link:** [https://iamshafayat.github.io/vuln-handbook/](https://iamshafayat.github.io/vuln-handbook/)

### Run Locally

No build tools or dependencies required. Just clone and open:

```bash
git clone https://github.com/iamshafayat/vuln-handbook.git
cd vuln-handbook
# Open index.html in your browser
open index.html
```

Or serve it with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

---

## 🤝 Contributing

Found a bug? Want to add a new vulnerability module?

1. Fork the repo
2. Create a new branch: `git checkout -b add-csrf-module`
3. Add your content following the existing page structure
4. Open a Pull Request with a clear description

Please keep all demos sandboxed and educational in nature.

---

## 📚 Resources & Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">Made for security education 🔐</p>
