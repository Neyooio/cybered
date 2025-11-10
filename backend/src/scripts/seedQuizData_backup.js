import mongoose from 'mongoose';
import QuizQuestion from '../models/QuizQuestion.js';
import Monster from '../models/Monster.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/CyberEdCapstone');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// ==================== CRYPTOGRAPHY MODULE ====================

const cryptographyLesson1Questions = [
  // Question 1
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is plaintext in cryptography?',
    choices: [
      { text: 'The original, readable message before encryption', isCorrect: true },
      { text: 'Text written in plain English', isCorrect: false },
      { text: 'The encrypted form of a message', isCorrect: false },
      { text: 'A simple password', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Plaintext is the original message exactly as it is meant to be read, before any encryption is applied.',
    points: 100
  },
  
  // Question 2
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is ciphertext?',
    choices: [
      { text: 'The encrypted, unreadable form of a message', isCorrect: true },
      { text: 'The original message', isCorrect: false },
      { text: 'A secret code name', isCorrect: false },
      { text: 'The encryption key', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'When plaintext is encrypted, it becomes ciphertext—a scrambled form that appears random and unreadable.',
    points: 100
  },
  
  // Question 3
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a key in cryptographic systems?',
    choices: [
      { text: 'A unique piece of information that dictates how encryption and decryption are performed', isCorrect: true },
      { text: 'A physical device for unlocking computers', isCorrect: false },
      { text: 'The password to your email', isCorrect: false },
      { text: 'The algorithm used for encryption', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The key is a unique value that controls the encryption and decryption process. Without it, the ciphertext remains meaningless.',
    points: 100
  },
  
  // Question 4
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the difference between encryption and decryption?',
    choices: [
      { text: 'Encryption transforms plaintext to ciphertext; decryption reverses it back', isCorrect: true },
      { text: 'Decryption is faster than encryption', isCorrect: false },
      { text: 'They are the same process', isCorrect: false },
      { text: 'Encryption uses keys, decryption does not', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Encryption scrambles plaintext into ciphertext, while decryption reverses it back to readable form.',
    points: 100
  },
  
  // Question 5
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'In symmetric encryption, how many keys are used?',
    choices: [
      { text: 'One—the same key for both encryption and decryption', isCorrect: true },
      { text: 'Two—a public key and a private key', isCorrect: false },
      { text: 'Three—one for encryption, one for decryption, one for storage', isCorrect: false },
      { text: 'No keys are used', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Symmetric encryption uses the same key to encrypt and decrypt data, making key sharing a security challenge.',
    points: 100
  },
  
  // Question 6
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the main challenge with symmetric encryption?',
    choices: [
      { text: 'The key must be shared securely between parties', isCorrect: true },
      { text: 'It is too slow for modern computers', isCorrect: false },
      { text: 'It cannot encrypt large files', isCorrect: false },
      { text: 'It does not work on mobile devices', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Symmetric encryption requires both parties to have the same key, and sharing that key securely can be difficult.',
    points: 100
  },
  
  // Question 7
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'In asymmetric encryption, which key encrypts the message?',
    choices: [
      { text: 'The public key', isCorrect: true },
      { text: 'The private key', isCorrect: false },
      { text: 'Both keys together', isCorrect: false },
      { text: 'No key is needed', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'In asymmetric encryption, anyone can encrypt a message with your public key, but only you can decrypt it with your private key.',
    points: 100
  },
  
  // Question 8
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which key must be kept secret in asymmetric cryptography?',
    choices: [
      { text: 'The private key', isCorrect: true },
      { text: 'The public key', isCorrect: false },
      { text: 'Both keys must be kept secret', isCorrect: false },
      { text: 'Neither key needs to be secret', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The private key must always be kept secret. The public key can be shared openly without compromising security.',
    points: 100
  },
  
  // Question 9
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Why does modern cryptography rely on key secrecy rather than algorithm secrecy?',
    choices: [
      { text: 'So algorithms can be openly analyzed and improved by experts', isCorrect: true },
      { text: 'Because algorithms are too simple to hide', isCorrect: false },
      { text: 'Because keys are easier to remember', isCorrect: false },
      { text: 'Because algorithms cannot be kept secret', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Modern cryptography publishes algorithms openly for peer review and security analysis, relying only on key secrecy.',
    points: 100
  },
  
  // Question 10
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What happens if the encryption key is weak or easily guessed?',
    choices: [
      { text: 'Even the strongest algorithm becomes useless', isCorrect: true },
      { text: 'The algorithm automatically compensates', isCorrect: false },
      { text: 'It only affects older systems', isCorrect: false },
      { text: 'Nothing, keys do not affect security', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A weak key undermines the entire encryption system, regardless of how mathematically strong the algorithm is.',
    points: 100
  },
  
  // Question 11
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is an algorithm in cryptography?',
    choices: [
      { text: 'A mathematical procedure for encryption and decryption', isCorrect: true },
      { text: 'A type of encryption key', isCorrect: false },
      { text: 'A network protocol', isCorrect: false },
      { text: 'A password generator', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'An algorithm is a specific mathematical procedure that explains exactly how to mix plaintext and keys together.',
    points: 100
  },
  
  // Question 12
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'How does asymmetric encryption solve the key-sharing problem?',
    choices: [
      { text: 'By using separate public and private keys', isCorrect: true },
      { text: 'By using shorter keys', isCorrect: false },
      { text: 'By eliminating keys entirely', isCorrect: false },
      { text: 'By using the same key for everyone', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Asymmetric encryption uses a public key (shareable) for encryption and a private key (secret) for decryption.',
    points: 100
  },
  
  // Question 13
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What can asymmetric encryption be used for besides encrypting messages?',
    choices: [
      { text: 'Creating digital signatures', isCorrect: true },
      { text: 'Compressing files', isCorrect: false },
      { text: 'Increasing internet speed', isCorrect: false },
      { text: 'Deleting viruses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Asymmetric encryption also supports digital signatures, which allow you to prove a message genuinely came from you.',
    points: 100
  },
  
  // Question 14
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What does it mean that ciphertext should "reveal nothing" about the original message?',
    choices: [
      { text: 'It should appear completely random and unreadable', isCorrect: true },
      { text: 'It should be shorter than the original', isCorrect: false },
      { text: 'It should be written in a foreign language', isCorrect: false },
      { text: 'It should be deleted after reading', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Good ciphertext appears random and gives no clues about the plaintext, even when carefully studied.',
    points: 100
  },
  
  // Question 15
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Why is symmetric encryption described as "fast and efficient"?',
    choices: [
      { text: 'It uses simpler mathematical operations than asymmetric encryption', isCorrect: true },
      { text: 'It uses smaller files', isCorrect: false },
      { text: 'It requires no keys', isCorrect: false },
      { text: 'It only works on fast computers', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Symmetric encryption is computationally less expensive than asymmetric encryption, making it ideal for large amounts of data.',
    points: 100
  },
  
  // Question 16
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the primary goal of cryptography?',
    choices: [
      { text: 'To allow secure communication even if someone is listening', isCorrect: true },
      { text: 'To make messages shorter', isCorrect: false },
      { text: 'To increase typing speed', isCorrect: false },
      { text: 'To translate languages', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Cryptography aims to allow two parties to communicate securely even if someone else is listening.',
    points: 100
  },
  
  // Question 17
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Can someone who intercepts the ciphertext read it without the key?',
    choices: [
      { text: 'No, not with proper modern encryption', isCorrect: true },
      { text: 'Yes, anyone can read it', isCorrect: false },
      { text: 'Only with special government permission', isCorrect: false },
      { text: 'Only on certain days of the week', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'With proper encryption, no attacker should be able to uncover the original message without the correct key.',
    points: 100
  },
  
  // Question 18
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What happens during the encryption process?',
    choices: [
      { text: 'Plaintext and key are mixed together using an algorithm', isCorrect: true },
      { text: 'The message is deleted', isCorrect: false },
      { text: 'The message is sent to a server', isCorrect: false },
      { text: 'The key becomes the message', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Encryption uses an algorithm to mathematically combine the plaintext with the key to produce ciphertext.',
    points: 100
  },
  
  // Question 19
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'If a key is intercepted during transmission in symmetric encryption, what happens?',
    choices: [
      { text: 'Security is instantly compromised', isCorrect: true },
      { text: 'Nothing, the system remains secure', isCorrect: false },
      { text: 'A new key is automatically generated', isCorrect: false },
      { text: 'The message self-destructs', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'In symmetric encryption, if the shared key is intercepted, an attacker can decrypt all communications.',
    points: 100
  },
  
  // Question 20
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What makes asymmetric encryption unique compared to symmetric encryption?',
    choices: [
      { text: 'It uses two different but mathematically related keys', isCorrect: true },
      { text: 'It does not use any keys', isCorrect: false },
      { text: 'It uses only numbers', isCorrect: false },
      { text: 'It works only on weekends', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Asymmetric encryption uses a public-private key pair that are mathematically linked but serve different functions.',
    points: 100
  },
  
  // Question 21
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Who can send you encrypted messages using asymmetric encryption?',
    choices: [
      { text: 'Anyone who has your public key', isCorrect: true },
      { text: 'Only people with your private key', isCorrect: false },
      { text: 'Only government agencies', isCorrect: false },
      { text: 'No one can send encrypted messages', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Anyone can encrypt messages with your public key, but only you can decrypt them with your private key.',
    points: 100
  },
  
  // Question 22
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What does "key secrecy" mean in modern cryptography?',
    choices: [
      { text: 'Keeping the encryption key private while the algorithm is public', isCorrect: true },
      { text: 'Keeping both the key and algorithm secret', isCorrect: false },
      { text: 'Never using keys', isCorrect: false },
      { text: 'Sharing keys with everyone', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Modern cryptography keeps keys secret but publishes algorithms for transparency and peer review.',
    points: 100
  },
  
  // Question 23
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the foundation of trust in cryptography?',
    choices: [
      { text: 'The combination of strong algorithms and secret keys', isCorrect: true },
      { text: 'Government regulations', isCorrect: false },
      { text: 'Fast internet connections', isCorrect: false },
      { text: 'Expensive computers', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Cryptographic trust comes from mathematically strong algorithms combined with properly protected secret keys.',
    points: 100
  },
  
  // Question 24
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which encryption type is better for encrypting large amounts of data?',
    choices: [
      { text: 'Symmetric encryption, because it is faster', isCorrect: true },
      { text: 'Asymmetric encryption, because it uses two keys', isCorrect: false },
      { text: 'Neither can handle large data', isCorrect: false },
      { text: 'Both are equally fast', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Symmetric encryption is extremely fast and efficient, making it ideal for encrypting large amounts of data.',
    points: 100
  },
  
  // Question 25
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What does decryption require?',
    choices: [
      { text: 'The correct key and algorithm', isCorrect: true },
      { text: 'Only the ciphertext', isCorrect: false },
      { text: 'Permission from the sender', isCorrect: false },
      { text: 'A special government license', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Decryption needs both the correct decryption key and knowledge of the algorithm used for encryption.',
    points: 100
  },
  
  // Question 26
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What protects modern digital systems like HTTPS and VPNs?',
    choices: [
      { text: 'Cryptographic algorithms and keys', isCorrect: true },
      { text: 'Physical locks on servers', isCorrect: false },
      { text: 'Security guards', isCorrect: false },
      { text: 'Antivirus software only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'HTTPS, VPNs, and other secure systems rely on the foundation of cryptographic encryption and keys.',
    points: 100
  },
  
  // Question 27
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Why can you share your public key openly without security risk?',
    choices: [
      { text: 'Because it can only encrypt, not decrypt messages', isCorrect: true },
      { text: 'Because it expires every hour', isCorrect: false },
      { text: 'Because it is too long to remember', isCorrect: false },
      { text: 'Because it changes randomly', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The public key can only encrypt messages or verify signatures—it cannot decrypt or forge them.',
    points: 100
  },
  
  // Question 28
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What would happen if you lost your private key in asymmetric encryption?',
    choices: [
      { text: 'You could no longer decrypt messages sent to you', isCorrect: true },
      { text: 'Nothing, the system would still work', isCorrect: false },
      { text: 'Your public key would automatically become private', isCorrect: false },
      { text: 'All your data would be deleted', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'The private key is essential for decryption. Losing it means you cannot decrypt any messages encrypted with your public key.',
    points: 100
  },
  
  // Question 29
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the invisible shield that protects digital transactions and communications?',
    choices: [
      { text: 'Cryptography', isCorrect: true },
      { text: 'Firewalls only', isCorrect: false },
      { text: 'Passwords only', isCorrect: false },
      { text: 'Internet speed', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Cryptography is the invisible shield protecting nearly everything we do online, from messages to transactions.',
    points: 100
  },
  
  // Question 30
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'According to the lesson, what ensures that messages stay private, identities are real, and data cannot be changed without detection?',
    choices: [
      { text: 'Cryptographic systems combining encryption, authentication, and integrity', isCorrect: true },
      { text: 'Internet service providers', isCorrect: false },
      { text: 'Computer operating systems only', isCorrect: false },
      { text: 'Social media platforms', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Cryptography ensures privacy (encryption), authenticity (signatures), and integrity (hashing) in digital communications.',
    points: 100
  }
];

// Cryptography Lesson 2: Classical and Modern Cryptographic Algorithms
const cryptographyLesson2Questions = [
  // Question 1
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the Caesar cipher?',
    choices: [
      { text: 'A substitution cipher that shifts each letter by a fixed number', isCorrect: true },
      { text: 'A modern encryption algorithm', isCorrect: false },
      { text: 'A hashing function', isCorrect: false },
      { text: 'A digital signature method', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The Caesar cipher is one of the oldest ciphers, shifting each letter in the message by a fixed number of positions in the alphabet.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a key property of cryptographic hash functions?',
    choices: [
      { text: 'They are reversible', isCorrect: false },
      { text: 'They are one-way (irreversible)', isCorrect: true },
      { text: 'They always produce the same length output regardless of input', isCorrect: false },
      { text: 'They require a key', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Cryptographic hash functions are one-way, meaning you cannot reverse the hash to get the original input.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is collision resistance in hashing?',
    choices: [
      { text: 'The difficulty of finding two inputs with the same hash', isCorrect: true },
      { text: 'The speed of the hash function', isCorrect: false },
      { text: 'The size of the hash output', isCorrect: false },
      { text: 'The encryption strength', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Collision resistance means it should be computationally infeasible to find two different inputs that produce the same hash output.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Which of the following is a cryptographic hash function?',
    choices: [
      { text: 'AES', isCorrect: false },
      { text: 'SHA-256', isCorrect: true },
      { text: 'RSA', isCorrect: false },
      { text: 'DES', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 is a widely used cryptographic hash function that produces a 256-bit hash value.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is MD5?',
    choices: [
      { text: 'A modern secure hash function', isCorrect: false },
      { text: 'An older hash function now considered insecure', isCorrect: true },
      { text: 'An encryption algorithm', isCorrect: false },
      { text: 'A digital signature scheme', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'MD5 is an older hash function that has been found to have vulnerabilities and is no longer recommended for security purposes.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What does SHA stand for?',
    choices: [
      { text: 'Secure Hash Algorithm', isCorrect: true },
      { text: 'Super High Authentication', isCorrect: false },
      { text: 'Symmetric Hashing Approach', isCorrect: false },
      { text: 'Secret Hash Activation', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA stands for Secure Hash Algorithm, a family of cryptographic hash functions.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the output size of SHA-256?',
    choices: [
      { text: '128 bits', isCorrect: false },
      { text: '256 bits', isCorrect: true },
      { text: '512 bits', isCorrect: false },
      { text: '1024 bits', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 produces a hash value that is 256 bits (32 bytes) long.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a digital signature?',
    choices: [
      { text: 'A cryptographic way to verify authenticity and integrity', isCorrect: true },
      { text: 'A scanned image of a handwritten signature', isCorrect: false },
      { text: 'An encrypted password', isCorrect: false },
      { text: 'A type of hash function', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A digital signature uses cryptography to verify that a message came from a specific sender and has not been altered.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'How is a digital signature created?',
    choices: [
      { text: 'By encrypting a hash with the sender\'s private key', isCorrect: true },
      { text: 'By encrypting the message with a public key', isCorrect: false },
      { text: 'By hashing the public key', isCorrect: false },
      { text: 'By compressing the file', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A digital signature is created by hashing the message and then encrypting that hash with the sender\'s private key.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a rainbow table attack?',
    choices: [
      { text: 'Using precomputed hashes to crack passwords', isCorrect: true },
      { text: 'A type of DDoS attack', isCorrect: false },
      { text: 'Injecting colorful malware', isCorrect: false },
      { text: 'A network sniffing technique', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A rainbow table attack uses precomputed tables of hash values to quickly reverse hash functions and crack passwords.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the primary use of hash functions in password storage?',
    choices: [
      { text: 'To encrypt passwords reversibly', isCorrect: false },
      { text: 'To store passwords securely without storing the actual password', isCorrect: true },
      { text: 'To compress password databases', isCorrect: false },
      { text: 'To generate random passwords', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hash functions allow systems to verify passwords without storing the actual password text, improving security.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is HMAC?',
    choices: [
      { text: 'Hash-based Message Authentication Code', isCorrect: true },
      { text: 'High-level Malware Analysis Center', isCorrect: false },
      { text: 'Hybrid Encryption Algorithm', isCorrect: false },
      { text: 'Hardware MAC address', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'HMAC is a mechanism for calculating a message authentication code using a cryptographic hash function and a secret key.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Why should you NOT use MD5 for security-critical applications?',
    choices: [
      { text: 'It is too slow', isCorrect: false },
      { text: 'It has known collision vulnerabilities', isCorrect: true },
      { text: 'It requires too much memory', isCorrect: false },
      { text: 'It is not supported anymore', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'MD5 has known collision vulnerabilities, meaning attackers can create two different inputs with the same hash.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the avalanche effect in cryptographic hash functions?',
    choices: [
      { text: 'A small change in input produces a large change in output', isCorrect: true },
      { text: 'Hash functions get faster over time', isCorrect: false },
      { text: 'Multiple hashes are computed simultaneously', isCorrect: false },
      { text: 'The hash size increases with input size', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The avalanche effect means even a tiny change in input (like one bit) drastically changes the hash output.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a Message Authentication Code (MAC)?',
    choices: [
      { text: 'A code that verifies both integrity and authenticity of a message', isCorrect: true },
      { text: 'A network hardware address', isCorrect: false },
      { text: 'A type of virus', isCorrect: false },
      { text: 'An encryption standard', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A MAC is a short piece of information used to authenticate a message and confirm it has not been altered.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the difference between hashing and encryption?',
    choices: [
      { text: 'Hashing is one-way, encryption is two-way', isCorrect: true },
      { text: 'They are the same', isCorrect: false },
      { text: 'Hashing is reversible, encryption is not', isCorrect: false },
      { text: 'Encryption is faster than hashing', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hashing is a one-way function (cannot be reversed), while encryption is two-way (can be decrypted with the right key).',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Which hash function is part of the SHA-2 family?',
    choices: [
      { text: 'MD5', isCorrect: false },
      { text: 'SHA-256', isCorrect: true },
      { text: 'SHA-1', isCorrect: false },
      { text: 'RIPEMD', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 is part of the SHA-2 family of hash functions, which also includes SHA-224, SHA-384, and SHA-512.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a hash collision?',
    choices: [
      { text: 'When two different inputs produce the same hash output', isCorrect: true },
      { text: 'When a hash function crashes', isCorrect: false },
      { text: 'When two hash functions compete', isCorrect: false },
      { text: 'When hashing takes too long', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A hash collision occurs when two different inputs produce the same hash value, which is a security concern.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the purpose of salting passwords?',
    choices: [
      { text: 'To prevent rainbow table attacks', isCorrect: true },
      { text: 'To make passwords longer', isCorrect: false },
      { text: 'To encrypt the database', isCorrect: false },
      { text: 'To speed up authentication', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Adding a salt (random data) to passwords before hashing prevents attackers from using precomputed rainbow tables.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is SHA-3?',
    choices: [
      { text: 'The latest member of the Secure Hash Algorithm family', isCorrect: true },
      { text: 'An encryption algorithm', isCorrect: false },
      { text: 'A digital signature method', isCorrect: false },
      { text: 'A password manager', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-3 is the latest member of the SHA family, using a different internal structure (Keccak) than SHA-1 and SHA-2.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Can you decrypt a hash?',
    choices: [
      { text: 'No, hashing is one-way', isCorrect: true },
      { text: 'Yes, with the right key', isCorrect: false },
      { text: 'Yes, but it takes time', isCorrect: false },
      { text: 'Only with quantum computers', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hashing is a one-way function by design - you cannot reverse a hash to get the original input.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is pre-image resistance?',
    choices: [
      { text: 'Difficulty of finding input from hash output', isCorrect: true },
      { text: 'Speed of the hash function', isCorrect: false },
      { text: 'Protection against viruses', isCorrect: false },
      { text: 'Encryption strength', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Pre-image resistance means it should be computationally infeasible to find the original input given only the hash output.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is second pre-image resistance?',
    choices: [
      { text: 'Difficulty of finding a different input with the same hash as a given input', isCorrect: true },
      { text: 'Running the hash function twice', isCorrect: false },
      { text: 'Using two hash functions', isCorrect: false },
      { text: 'Hashing the hash output again', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Second pre-image resistance means given an input and its hash, it should be hard to find a different input with the same hash.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the Merkle-Damgård construction?',
    choices: [
      { text: 'A method for building hash functions from compression functions', isCorrect: true },
      { text: 'A type of encryption', isCorrect: false },
      { text: 'A digital signature scheme', isCorrect: false },
      { text: 'A key exchange protocol', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Merkle-Damgård is a construction method used to build cryptographic hash functions like MD5 and SHA-1/SHA-2.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Why are hash functions useful for data integrity?',
    choices: [
      { text: 'Any change to data produces a different hash', isCorrect: true },
      { text: 'They encrypt the data', isCorrect: false },
      { text: 'They compress the file', isCorrect: false },
      { text: 'They backup the data', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hash functions are useful for verifying data integrity because even small changes to input produce completely different hashes.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is bcrypt?',
    choices: [
      { text: 'A password hashing function designed to be slow', isCorrect: true },
      { text: 'A fast encryption algorithm', isCorrect: false },
      { text: 'A blockchain protocol', isCorrect: false },
      { text: 'A file compression tool', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Bcrypt is a password hashing function intentionally designed to be slow to make brute-force attacks more difficult.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What does "deterministic" mean for hash functions?',
    choices: [
      { text: 'The same input always produces the same output', isCorrect: true },
      { text: 'The output is random', isCorrect: false },
      { text: 'Different inputs produce the same output', isCorrect: false },
      { text: 'The function is reversible', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A deterministic hash function always produces the same hash output for the same input.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is the birthday paradox in cryptography?',
    choices: [
      { text: 'The probability of hash collisions is higher than expected', isCorrect: true },
      { text: 'Hash functions work better on birthdays', isCorrect: false },
      { text: 'Encryption keys expire annually', isCorrect: false },
      { text: 'A type of brute force attack', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'The birthday paradox explains why finding hash collisions is easier than expected, affecting hash function security.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a checksum?',
    choices: [
      { text: 'A value used to verify data integrity', isCorrect: true },
      { text: 'A payment verification', isCorrect: false },
      { text: 'An encryption key', isCorrect: false },
      { text: 'A firewall rule', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A checksum is a value calculated from data to detect errors or verify that data has not been corrupted.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'Which is more secure: SHA-1 or SHA-256?',
    choices: [
      { text: 'SHA-1', isCorrect: false },
      { text: 'SHA-256', isCorrect: true },
      { text: 'They are equally secure', isCorrect: false },
      { text: 'Neither is secure', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 is more secure than SHA-1, which has known vulnerabilities and is being phased out.',
    points: 100
  }
];

// I'll create a comprehensive set for all modules and lessons
// Due to length, I'll create a helper function to generate variations

const generateQuestions = (module, lessonNumber, topic, baseQuestions) => {
  return baseQuestions.map(q => ({
    ...q,
    module,
    lessonNumber
  }));
};

// Monster data with proper sprite paths (relative to lesson files)
const monsters = [
  // Cryptography monsters
  { name: 'Cipher Slime', module: 'cryptography', spriteUrl: '../../../../assets/images/monsters/malware-slime.png', audioUrl: '../../../../assets/audios/cipher-slime.mp3', maxHealth: 10, level: 1, type: 'defender' },
  { name: 'Hash Dragon', module: 'cryptography', spriteUrl: '../../../../assets/images/monsters/ransomware-dragon.png', audioUrl: '../../../../assets/audios/hash-dragon.ogg', maxHealth: 10, level: 2, type: 'defender' },
  { name: 'Key Phantom', module: 'cryptography', spriteUrl: '../../../../assets/images/monsters/phishing-phantom.png', audioUrl: '../../../../assets/audios/key-phantom.mp3', maxHealth: 10, level: 1, type: 'defender' },
  { name: 'Crypto Miner', module: 'cryptography', spriteUrl: '../../../../assets/images/monsters/cryptojacker-miner.png', audioUrl: '../../../../assets/audios/crypto-miner.mp3', maxHealth: 10, level: 2, type: 'defender' },
  
  // Malware Defense monsters
  { name: 'Trojan Beast', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/trojan-beast.png', audioUrl: '../../../../assets/audios/trojan-beast.mp3', maxHealth: 10, level: 1, type: 'trojan' },
  { name: 'Worm Serpent', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/worm-serpent.png', audioUrl: '../../../../assets/audios/worm-serpent.ogg', maxHealth: 10, level: 1, type: 'worm' },
  { name: 'Spyware Ghost', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/spyware-ghost.png', audioUrl: '../../../../assets/audios/spyware-ghost.ogg', maxHealth: 10, level: 2, type: 'spyware' },
  { name: 'Ransomware Dragon', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/ransomware-dragon.png', audioUrl: '../../../../assets/audios/ransomware-dragon.ogg', maxHealth: 10, level: 3, type: 'ransomware' },
  { name: 'Rootkit Shadow', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/rootkit-shadow.png', audioUrl: '../../../../assets/audios/rootkit-shadow.mp3', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'Keylogger Bat', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/keylogger-bat.png', audioUrl: '../../../../assets/audios/keylogger-bat.mp3', maxHealth: 10, level: 1, type: 'spyware' },
  { name: 'Logic Bomb Timer', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/logic-bomb-timer.png', audioUrl: '../../../../assets/audios/logic-bomb-timer.mp3', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'Adware Swarm', module: 'malware-defense', spriteUrl: '../../../../assets/images/monsters/adware-swarm.png', audioUrl: '../../../../assets/audios/adware-swarm.mp3', maxHealth: 10, level: 1, type: 'virus' },
  
  // Network Defense monsters
  { name: 'DDoS Kraken', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/ddos-kraken.png', audioUrl: '../../../../assets/audios/ddos-kraken.ogg', maxHealth: 10, level: 3, type: 'virus' },
  { name: 'MITM Interceptor', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/mitm-interceptor.png', audioUrl: '../../../../assets/audios/mitm-interceptor.mp3', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'Packet Sniffer', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/packet-sniffer.png', audioUrl: '../../../../assets/audios/packet-sniffer.mp3', maxHealth: 10, level: 1, type: 'spyware' },
  { name: 'DNS Poisoner', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/dns-poisoner.png', audioUrl: '../../../../assets/audios/dns-poisoner.mp3', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'Botnet Swarm', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/botnet-swarm.png', audioUrl: '../../../../assets/audios/botnet-swarm.mp3', maxHealth: 10, level: 2, type: 'worm' },
  { name: 'Rogue Access Point', module: 'network-defense', spriteUrl: '../../../../assets/images/monsters/rogue-access-point.png', audioUrl: '../../../../assets/audios/rogue-access-point.mp3', maxHealth: 10, level: 1, type: 'virus' },
  
  // Web Security monsters
  { name: 'SQL Spider', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/sql-spider.png', audioUrl: '../../../../assets/audios/sql-spider.ogg', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'XSS Viper', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/xss-viper.png', audioUrl: '../../../../assets/audios/xss-viper.mp3', maxHealth: 10, level: 2, type: 'virus' },
  { name: 'CSRF Trickster', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/csrf-trickster.png', audioUrl: '../../../../assets/audios/csrf-trickster.mp3', maxHealth: 10, level: 1, type: 'virus' },
  { name: 'Buffer Overflow Titan', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/buffer-overflow-titan.png', audioUrl: '../../../../assets/audios/blacephalon.mp3', maxHealth: 10, level: 3, type: 'virus' },
  { name: 'Zero-Day Demon', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/zeroday-demon.png', audioUrl: '../../../../assets/audios/brambleghast.mp3', maxHealth: 10, level: 4, type: 'virus' },
  { name: 'Backdoor Trapdoor', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/backdoor-trapdoor.png', audioUrl: '../../../../assets/audios/bramblin.mp3', maxHealth: 10, level: 2, type: 'trojan' },
  { name: 'Brute Force Golem', module: 'web-security', spriteUrl: '../../../../assets/images/monsters/bruteforce-golem.png', audioUrl: '../../../../assets/audios/blacephalon.mp3', maxHealth: 10, level: 3, type: 'virus' }
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('  Clearing existing data...');
    await QuizQuestion.deleteMany({});
    await Monster.deleteMany({});
    
    console.log(' Inserting quiz questions...');
    
    // Insert Cryptography questions (lessons 1 & 2 done above, need 3 & 4)
    await QuizQuestion.insertMany(cryptographyLesson1Questions);
    await QuizQuestion.insertMany(cryptographyLesson2Questions);
    
    console.log(' Inserted Cryptography Lesson 1 & 2 questions (60 total)');
    
    // For remaining lessons, I'll create a template that you can expand
    // This is a framework - you would add specific content per lesson
    
    console.log(' Inserting monsters...');
    await Monster.insertMany(monsters);
    console.log(` Inserted ${monsters.length} monsters`);
    
    // Summary
    const questionCount = await QuizQuestion.countDocuments();
    const monsterCount = await Monster.countDocuments();
    
    console.log('\n Database Seeding Complete!');
    console.log(`   Questions: ${questionCount}`);
    console.log(`   Monsters: ${monsterCount}`);
    console.log('\n  Note: You need to add questions for:');
    console.log('   - Cryptography Lessons 3 & 4');
    console.log('   - Malware Defense Lessons 1-4');
    console.log('   - Network Defense Lessons 1-4');
    console.log('   - Web Security Lessons 1-4');
    console.log('   (Total: 14 lessons × 30 questions = 420 more questions needed)');
    
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
