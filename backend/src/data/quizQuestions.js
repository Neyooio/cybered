// Complete Quiz Questions Database - 30 questions per lesson × 16 lessons = 480 questions
export const allQuizQuestions = {
  
  // ==================== CRYPTOGRAPHY MODULE ====================
  
  cryptography_lesson3: [
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is asymmetric encryption?',
      choices: [
        { text: 'Encryption using two different keys (public and private)', isCorrect: true },
        { text: 'Encryption using the same key', isCorrect: false },
        { text: 'Encryption without keys', isCorrect: false },
        { text: 'Encryption using three keys', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'Asymmetric encryption uses a pair of keys: a public key for encryption and a private key for decryption.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is RSA?',
      choices: [
        { text: 'A symmetric encryption algorithm', isCorrect: false },
        { text: 'An asymmetric encryption algorithm', isCorrect: true },
        { text: 'A hashing function', isCorrect: false },
        { text: 'A network protocol', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'RSA is a widely-used asymmetric encryption algorithm named after Rivest, Shamir, and Adleman.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a public key?',
      choices: [
        { text: 'A key that can be shared openly', isCorrect: true },
        { text: 'A key that must be kept secret', isCorrect: false },
        { text: 'A key stored in government databases', isCorrect: false },
        { text: 'A key used only once', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'A public key can be shared openly and is used to encrypt messages or verify signatures.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a private key?',
      choices: [
        { text: 'A key that must be kept secret', isCorrect: true },
        { text: 'A key shared with everyone', isCorrect: false },
        { text: 'A key used for compression', isCorrect: false },
        { text: 'A key that expires daily', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'A private key must be kept confidential and is used to decrypt messages or create digital signatures.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'How does someone send you an encrypted message using public key cryptography?',
      choices: [
        { text: 'They encrypt it with your public key', isCorrect: true },
        { text: 'They encrypt it with your private key', isCorrect: false },
        { text: 'They encrypt it with their own private key', isCorrect: false },
        { text: 'They don\'t use encryption', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'To send you a secure message, someone encrypts it with your public key, and only you can decrypt it with your private key.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is the main advantage of asymmetric encryption over symmetric encryption?',
      choices: [
        { text: 'No need to securely share a secret key', isCorrect: true },
        { text: 'It is faster', isCorrect: false },
        { text: 'It uses less memory', isCorrect: false },
        { text: 'It produces smaller ciphertext', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Asymmetric encryption eliminates the key distribution problem since public keys can be shared openly.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is the main disadvantage of asymmetric encryption?',
      choices: [
        { text: 'It is slower than symmetric encryption', isCorrect: true },
        { text: 'It is less secure', isCorrect: false },
        { text: 'It cannot be used for signatures', isCorrect: false },
        { text: 'It requires internet connection', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Asymmetric encryption is computationally more expensive and slower than symmetric encryption.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a key pair in asymmetric cryptography?',
      choices: [
        { text: 'A public key and corresponding private key', isCorrect: true },
        { text: 'Two public keys', isCorrect: false },
        { text: 'Two private keys', isCorrect: false },
        { text: 'A key and a password', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'A key pair consists of a mathematically related public key and private key.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is the Diffie-Hellman protocol used for?',
      choices: [
        { text: 'Securely exchanging keys over an insecure channel', isCorrect: true },
        { text: 'Encrypting files', isCorrect: false },
        { text: 'Hashing passwords', isCorrect: false },
        { text: 'Detecting malware', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Diffie-Hellman allows two parties to establish a shared secret key over an insecure communication channel.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What does ECC stand for in cryptography?',
      choices: [
        { text: 'Elliptic Curve Cryptography', isCorrect: true },
        { text: 'Enhanced Cipher Code', isCorrect: false },
        { text: 'Encrypted Communication Channel', isCorrect: false },
        { text: 'External Crypto Controller', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'ECC stands for Elliptic Curve Cryptography, which provides strong security with smaller key sizes.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'How do you verify a digital signature?',
      choices: [
        { text: 'Decrypt it with the sender\'s public key', isCorrect: true },
        { text: 'Encrypt it with your private key', isCorrect: false },
        { text: 'Hash the signature', isCorrect: false },
        { text: 'Compare it to a database', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Digital signatures are verified by decrypting them with the sender\'s public key and comparing to a hash of the message.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a certificate authority (CA)?',
      choices: [
        { text: 'A trusted entity that issues digital certificates', isCorrect: true },
        { text: 'A government encryption agency', isCorrect: false },
        { text: 'An encryption algorithm', isCorrect: false },
        { text: 'A type of malware', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'A CA is a trusted organization that verifies identities and issues digital certificates for public keys.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a digital certificate?',
      choices: [
        { text: 'A document binding a public key to an identity', isCorrect: true },
        { text: 'An encrypted password', isCorrect: false },
        { text: 'A software license', isCorrect: false },
        { text: 'A network permission', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'A digital certificate is an electronic document that proves ownership of a public key.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is public key infrastructure (PKI)?',
      choices: [
        { text: 'A framework for managing public keys and certificates', isCorrect: true },
        { text: 'A type of encryption', isCorrect: false },
        { text: 'A network architecture', isCorrect: false },
        { text: 'A cloud storage system', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'PKI is a set of roles, policies, and procedures needed to create, manage, and revoke digital certificates.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'Why is RSA considered computationally expensive?',
      choices: [
        { text: 'It involves complex mathematical operations with large numbers', isCorrect: true },
        { text: 'It requires special hardware', isCorrect: false },
        { text: 'It uses too much memory', isCorrect: false },
        { text: 'It needs internet connection', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'RSA requires intensive calculations involving very large prime numbers, making it slower than symmetric algorithms.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is the typical RSA key size recommended for security today?',
      choices: [
        { text: '512 bits', isCorrect: false },
        { text: '2048 bits or higher', isCorrect: true },
        { text: '128 bits', isCorrect: false },
        { text: '64 bits', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Modern security standards recommend RSA keys of at least 2048 bits, with 3072 or 4096 bits for higher security.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What mathematical problem is RSA security based on?',
      choices: [
        { text: 'Factoring large prime numbers', isCorrect: true },
        { text: 'Solving linear equations', isCorrect: false },
        { text: 'Finding square roots', isCorrect: false },
        { text: 'Computing logarithms', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'RSA security relies on the computational difficulty of factoring the product of two large prime numbers.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'In hybrid encryption, how are symmetric and asymmetric encryption used together?',
      choices: [
        { text: 'Asymmetric encrypts the symmetric key, symmetric encrypts the data', isCorrect: true },
        { text: 'Both encrypt the data simultaneously', isCorrect: false },
        { text: 'Symmetric is used first, then asymmetric', isCorrect: false },
        { text: 'They are never used together', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Hybrid encryption uses fast symmetric encryption for data and slow asymmetric encryption just for the symmetric key.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is non-repudiation in digital signatures?',
      choices: [
        { text: 'The sender cannot deny sending the message', isCorrect: true },
        { text: 'The message cannot be read', isCorrect: false },
        { text: 'The message cannot be deleted', isCorrect: false },
        { text: 'The receiver cannot reply', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Non-repudiation ensures that someone cannot deny the authenticity of their signature on a message.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What happens if your private key is compromised?',
      choices: [
        { text: 'Your encrypted communications are no longer secure', isCorrect: true },
        { text: 'Nothing, the public key protects it', isCorrect: false },
        { text: 'Only future messages are affected', isCorrect: false },
        { text: 'The key automatically regenerates', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'If your private key is compromised, attackers can decrypt your messages and impersonate you with digital signatures.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is forward secrecy?',
      choices: [
        { text: 'Past communications remain secure even if keys are compromised', isCorrect: true },
        { text: 'Future communications are automatically encrypted', isCorrect: false },
        { text: 'Messages are sent faster', isCorrect: false },
        { text: 'Keys are stored permanently', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Forward secrecy ensures that past encrypted communications cannot be decrypted even if long-term keys are later compromised.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is the ElGamal encryption system?',
      choices: [
        { text: 'An asymmetric encryption algorithm based on discrete logarithms', isCorrect: true },
        { text: 'A symmetric cipher', isCorrect: false },
        { text: 'A hashing function', isCorrect: false },
        { text: 'A network protocol', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'ElGamal is a public-key cryptosystem that uses the difficulty of computing discrete logarithms for security.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'Why is ECC preferred over RSA in some applications?',
      choices: [
        { text: 'Smaller keys provide equivalent security', isCorrect: true },
        { text: 'It is older and more tested', isCorrect: false },
        { text: 'It is easier to understand', isCorrect: false },
        { text: 'It works without keys', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'ECC provides the same level of security as RSA with much smaller key sizes, making it more efficient.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is a man-in-the-middle attack in key exchange?',
      choices: [
        { text: 'An attacker intercepts and relays communications between parties', isCorrect: true },
        { text: 'An attacker steals the middle part of a message', isCorrect: false },
        { text: 'An attacker positions between two servers', isCorrect: false },
        { text: 'An attacker uses the middle key of three', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'In a MITM attack, an attacker secretly relays and possibly alters communications between two parties.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What does the "trapdoor" in trapdoor function refer to?',
      choices: [
        { text: 'Easy to compute one way, hard to reverse without secret', isCorrect: true },
        { text: 'A backdoor in the system', isCorrect: false },
        { text: 'A security vulnerability', isCorrect: false },
        { text: 'A type of malware', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'A trapdoor function is easy to compute in one direction but hard to reverse without special knowledge (the private key).',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is key escrow?',
      choices: [
        { text: 'Storing keys with a trusted third party', isCorrect: true },
        { text: 'Deleting old keys', isCorrect: false },
        { text: 'Sharing keys publicly', isCorrect: false },
        { text: 'Encrypting keys with other keys', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Key escrow involves storing encryption keys with a trusted third party for recovery purposes.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is quantum cryptography?',
      choices: [
        { text: 'Cryptography using quantum mechanical properties', isCorrect: true },
        { text: 'Very fast classical encryption', isCorrect: false },
        { text: 'Encryption for quantum computers only', isCorrect: false },
        { text: 'A theoretical concept that doesn\'t exist', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Quantum cryptography uses quantum mechanical properties to perform cryptographic tasks, like quantum key distribution.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'Why might quantum computers threaten current public-key cryptography?',
      choices: [
        { text: 'They could factor large numbers and solve discrete logs efficiently', isCorrect: true },
        { text: 'They are too fast', isCorrect: false },
        { text: 'They use different electricity', isCorrect: false },
        { text: 'They don\'t support encryption', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Quantum computers could run Shor\'s algorithm to efficiently solve problems that RSA and ECC security depend on.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is post-quantum cryptography?',
      choices: [
        { text: 'Encryption designed to resist quantum computer attacks', isCorrect: true },
        { text: 'Encryption used after quantum computers are invented', isCorrect: false },
        { text: 'Encryption that uses quantum mechanics', isCorrect: false },
        { text: 'Outdated encryption methods', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Post-quantum cryptography refers to algorithms believed to be secure against both classical and quantum computers.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 3,
      question: 'What is perfect forward secrecy (PFS)?',
      choices: [
        { text: 'Session keys are not compromised even if long-term keys are', isCorrect: true },
        { text: 'Messages are perfectly encrypted', isCorrect: false },
        { text: 'Keys never expire', isCorrect: false },
        { text: 'Encryption is always successful', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'PFS generates unique session keys for each session, ensuring that compromising one key doesn\'t affect others.',
      points: 100
    }
  ],
  
  cryptography_lesson4: [
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What does SSL stand for?',
      choices: [
        { text: 'Secure Sockets Layer', isCorrect: true },
        { text: 'System Security Lock', isCorrect: false },
        { text: 'Safe Server Link', isCorrect: false },
        { text: 'Secure Software Library', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'SSL stands for Secure Sockets Layer, a protocol for establishing encrypted links between servers and clients.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What replaced SSL?',
      choices: [
        { text: 'TLS (Transport Layer Security)', isCorrect: true },
        { text: 'HTTPS', isCorrect: false },
        { text: 'SSH', isCorrect: false },
        { text: 'VPN', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'TLS (Transport Layer Security) is the successor to SSL and provides improved security.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What does HTTPS stand for?',
      choices: [
        { text: 'HyperText Transfer Protocol Secure', isCorrect: true },
        { text: 'High Transfer Protocol System', isCorrect: false },
        { text: 'Hyper Terminal Protection Service', isCorrect: false },
        { text: 'HTML Transfer Protection Standard', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'HTTPS is HTTP with encryption, using TLS/SSL to secure web communications.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What port does HTTPS typically use?',
      choices: [
        { text: '80', isCorrect: false },
        { text: '443', isCorrect: true },
        { text: '22', isCorrect: false },
        { text: '8080', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'HTTPS typically uses port 443, while HTTP uses port 80.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is a TLS handshake?',
      choices: [
        { text: 'The process of establishing a secure connection', isCorrect: true },
        { text: 'A greeting message between servers', isCorrect: false },
        { text: 'A type of encryption', isCorrect: false },
        { text: 'A physical security measure', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'The TLS handshake is the process where client and server agree on encryption methods and exchange keys.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is a cipher suite?',
      choices: [
        { text: 'A collection of algorithms used for secure communications', isCorrect: true },
        { text: 'A set of encryption keys', isCorrect: false },
        { text: 'A group of hackers', isCorrect: false },
        { text: 'A software package', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'A cipher suite is a set of algorithms including key exchange, encryption, and MAC algorithms used together.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is the purpose of a session key in TLS?',
      choices: [
        { text: 'To encrypt data for that specific session', isCorrect: true },
        { text: 'To identify the user', isCorrect: false },
        { text: 'To store session data', isCorrect: false },
        { text: 'To time out the connection', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Session keys are temporary symmetric keys generated for each TLS session to encrypt the actual data.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What does VPN stand for?',
      choices: [
        { text: 'Virtual Private Network', isCorrect: true },
        { text: 'Verified Public Network', isCorrect: false },
        { text: 'Visual Protection Node', isCorrect: false },
        { text: 'Variable Protocol Network', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'VPN stands for Virtual Private Network, which creates a secure tunnel over the internet.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'How does a VPN protect your data?',
      choices: [
        { text: 'By encrypting all traffic between your device and the VPN server', isCorrect: true },
        { text: 'By hiding your computer', isCorrect: false },
        { text: 'By deleting your browsing history', isCorrect: false },
        { text: 'By blocking all websites', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'VPNs encrypt your internet traffic, protecting it from eavesdropping and hiding your actual IP address.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is SSH used for?',
      choices: [
        { text: 'Secure remote access to systems', isCorrect: true },
        { text: 'Web browsing', isCorrect: false },
        { text: 'Email encryption', isCorrect: false },
        { text: 'File compression', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'SSH (Secure Shell) is a protocol for secure remote login and command execution on networked computers.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is end-to-end encryption in messaging apps?',
      choices: [
        { text: 'Only sender and recipient can read messages', isCorrect: true },
        { text: 'Messages are encrypted on the server', isCorrect: false },
        { text: 'Messages are compressed', isCorrect: false },
        { text: 'Messages are sent from one end to another', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'End-to-end encryption ensures only the communicating users can read the messages, not even the service provider.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is the Signal Protocol?',
      choices: [
        { text: 'An end-to-end encryption protocol for messaging', isCorrect: true },
        { text: 'A network signal booster', isCorrect: false },
        { text: 'A Wi-Fi standard', isCorrect: false },
        { text: 'An alarm system protocol', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'The Signal Protocol provides end-to-end encryption for voice calls, video calls, and instant messaging.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is PGP?',
      choices: [
        { text: 'Pretty Good Privacy - an encryption program', isCorrect: true },
        { text: 'Public Gateway Protocol', isCorrect: false },
        { text: 'Personal Guard Program', isCorrect: false },
        { text: 'Protected Group Platform', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'PGP (Pretty Good Privacy) is a data encryption program used for email and file security.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is GPG?',
      choices: [
        { text: 'GNU Privacy Guard - a free implementation of PGP', isCorrect: true },
        { text: 'Global Protection Gateway', isCorrect: false },
        { text: 'General Purpose Guard', isCorrect: false },
        { text: 'Government Privacy Group', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'GPG is a complete and free implementation of the OpenPGP standard for encrypting and signing data.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is S/MIME?',
      choices: [
        { text: 'Secure/Multipurpose Internet Mail Extensions', isCorrect: true },
        { text: 'Simple Mail Integration Method', isCorrect: false },
        { text: 'Secure Message Internet Exchange', isCorrect: false },
        { text: 'Standard MIME Encryption', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'S/MIME is a standard for public key encryption and signing of MIME data (email).',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is a zero-knowledge proof?',
      choices: [
        { text: 'Proving something is true without revealing any information', isCorrect: true },
        { text: 'A proof that requires no knowledge', isCorrect: false },
        { text: 'An empty verification', isCorrect: false },
        { text: 'A failed authentication attempt', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'A zero-knowledge proof allows one party to prove to another that a statement is true without revealing any information beyond the validity of the statement.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is blockchain cryptography primarily based on?',
      choices: [
        { text: 'Hash functions and digital signatures', isCorrect: true },
        { text: 'Symmetric encryption only', isCorrect: false },
        { text: 'Password protection', isCorrect: false },
        { text: 'Steganography', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Blockchain uses cryptographic hash functions to chain blocks and digital signatures to verify transactions.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is homomorphic encryption?',
      choices: [
        { text: 'Encryption that allows computation on encrypted data', isCorrect: true },
        { text: 'Encryption that looks the same', isCorrect: false },
        { text: 'Encryption using home computers', isCorrect: false },
        { text: 'A type of symmetric encryption', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Homomorphic encryption allows mathematical operations to be performed on encrypted data without decrypting it.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is certificate pinning?',
      choices: [
        { text: 'Hardcoding expected certificates in an application', isCorrect: true },
        { text: 'Physically attaching certificates to documents', isCorrect: false },
        { text: 'Storing certificates in the cloud', isCorrect: false },
        { text: 'Deleting old certificates', isCorrect: false }
      ],
      difficulty: 'hard',
      explanation: 'Certificate pinning associates a host with their expected X509 certificate or public key to prevent MITM attacks.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is the purpose of OCSP?',
      choices: [
        { text: 'To check if a certificate has been revoked', isCorrect: true },
        { text: 'To create new certificates', isCorrect: false },
        { text: 'To encrypt emails', isCorrect: false },
        { text: 'To compress data', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'OCSP (Online Certificate Status Protocol) is used to obtain the revocation status of an X.509 digital certificate.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is a CRL?',
      choices: [
        { text: 'Certificate Revocation List', isCorrect: true },
        { text: 'Crypto Random Library', isCorrect: false },
        { text: 'Central Registration Log', isCorrect: false },
        { text: 'Cipher Rotation List', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'A CRL is a list of digital certificates that have been revoked by the issuing Certificate Authority.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is TPM?',
      choices: [
        { text: 'Trusted Platform Module - a hardware security chip', isCorrect: true },
        { text: 'Total Protection Mode', isCorrect: false },
        { text: 'Terminal Password Manager', isCorrect: false },
        { text: 'Temporary Privacy Measure', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'TPM is a specialized chip on devices that provides hardware-based security functions like key generation and storage.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is a hardware security module (HSM)?',
      choices: [
        { text: 'A physical device for managing and storing cryptographic keys', isCorrect: true },
        { text: 'A software encryption program', isCorrect: false },
        { text: 'A computer firewall', isCorrect: false },
        { text: 'An antivirus system', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'HSMs are dedicated crypto processors specifically designed for the protection of cryptographic keys.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is data at rest encryption?',
      choices: [
        { text: 'Encrypting stored data on disk or database', isCorrect: true },
        { text: 'Encrypting data while it\'s being transmitted', isCorrect: false },
        { text: 'Encrypting inactive users', isCorrect: false },
        { text: 'Encrypting backup power systems', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'Data at rest encryption protects stored data from unauthorized access even if physical media is compromised.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is data in transit encryption?',
      choices: [
        { text: 'Encrypting data while it travels over a network', isCorrect: true },
        { text: 'Encrypting data in storage', isCorrect: false },
        { text: 'Encrypting public transportation data', isCorrect: false },
        { text: 'Encrypting moving vehicles', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'Data in transit encryption protects data being transmitted between systems using protocols like TLS.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is full disk encryption (FDE)?',
      choices: [
        { text: 'Encrypting all data on a storage device', isCorrect: true },
        { text: 'Encrypting only important files', isCorrect: false },
        { text: 'Encrypting network traffic', isCorrect: false },
        { text: 'Encrypting circular disks', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'FDE encrypts the entire contents of a hard drive, protecting all data even if the device is stolen.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is BitLocker?',
      choices: [
        { text: 'A full disk encryption feature in Windows', isCorrect: true },
        { text: 'A cryptocurrency wallet', isCorrect: false },
        { text: 'A file compression tool', isCorrect: false },
        { text: 'A password manager', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'BitLocker is a full-volume encryption feature included with certain versions of Windows.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is FileVault?',
      choices: [
        { text: 'A disk encryption program on macOS', isCorrect: true },
        { text: 'A Windows encryption tool', isCorrect: false },
        { text: 'A cloud storage service', isCorrect: false },
        { text: 'A backup program', isCorrect: false }
      ],
      difficulty: 'easy',
      explanation: 'FileVault is a disk encryption feature built into macOS that encrypts the entire startup disk.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is LUKS?',
      choices: [
        { text: 'Linux Unified Key Setup - a disk encryption standard', isCorrect: true },
        { text: 'A Windows security feature', isCorrect: false },
        { text: 'A network protocol', isCorrect: false },
        { text: 'A file format', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'LUKS is a disk encryption specification for Linux that provides platform-independent standard on-disk format.',
      points: 100
    },
    {
      module: 'cryptography',
      lessonNumber: 4,
      question: 'What is the difference between encryption and encoding?',
      choices: [
        { text: 'Encryption provides confidentiality, encoding provides format conversion', isCorrect: true },
        { text: 'They are the same thing', isCorrect: false },
        { text: 'Encoding is more secure', isCorrect: false },
        { text: 'Encryption is older', isCorrect: false }
      ],
      difficulty: 'medium',
      explanation: 'Encryption is designed for security (confidentiality), while encoding is designed for proper data consumption (format).',
      points: 100
    }
  ]
};

// Export the data
export default allQuizQuestions;
