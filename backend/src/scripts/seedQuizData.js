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
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the primary purpose of cryptography?',
    choices: [
      { text: 'To make data unreadable to unauthorized users', isCorrect: true },
      { text: 'To compress data files', isCorrect: false },
      { text: 'To speed up network transmission', isCorrect: false },
      { text: 'To organize database records', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Cryptography protects information by converting it into an unreadable format for unauthorized users.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is plaintext in cryptography?',
    choices: [
      { text: 'Encrypted data', isCorrect: false },
      { text: 'Original, unencrypted data', isCorrect: true },
      { text: 'A type of cipher', isCorrect: false },
      { text: 'A hashing algorithm', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Plaintext is the original, readable data before encryption is applied.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is ciphertext?',
    choices: [
      { text: 'The original message', isCorrect: false },
      { text: 'The encrypted message', isCorrect: true },
      { text: 'The encryption key', isCorrect: false },
      { text: 'A decryption algorithm', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Ciphertext is the encrypted, unreadable output of an encryption algorithm.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which of the following is an example of symmetric encryption?',
    choices: [
      { text: 'RSA', isCorrect: false },
      { text: 'AES', isCorrect: true },
      { text: 'Diffie-Hellman', isCorrect: false },
      { text: 'ECC', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'AES (Advanced Encryption Standard) is a symmetric encryption algorithm where the same key is used for encryption and decryption.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a key in cryptography?',
    choices: [
      { text: 'A password hint', isCorrect: false },
      { text: 'A parameter that determines the encryption output', isCorrect: true },
      { text: 'A type of malware', isCorrect: false },
      { text: 'An antivirus program', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A cryptographic key is a piece of information used by an encryption algorithm to transform plaintext into ciphertext.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What does "encryption" mean?',
    choices: [
      { text: 'Deleting data permanently', isCorrect: false },
      { text: 'Converting plaintext to ciphertext', isCorrect: true },
      { text: 'Backing up files', isCorrect: false },
      { text: 'Scanning for viruses', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Encryption is the process of converting readable plaintext into unreadable ciphertext.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is decryption?',
    choices: [
      { text: 'Converting ciphertext back to plaintext', isCorrect: true },
      { text: 'Breaking an encryption algorithm', isCorrect: false },
      { text: 'Compressing files', isCorrect: false },
      { text: 'Detecting malware', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Decryption is the reverse of encryption, converting ciphertext back into readable plaintext.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which cryptographic concept ensures that data has not been altered?',
    choices: [
      { text: 'Confidentiality', isCorrect: false },
      { text: 'Integrity', isCorrect: true },
      { text: 'Availability', isCorrect: false },
      { text: 'Authentication', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Integrity ensures that data remains unchanged and has not been tampered with during transmission or storage.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a cipher?',
    choices: [
      { text: 'An encryption algorithm', isCorrect: true },
      { text: 'A type of virus', isCorrect: false },
      { text: 'A network protocol', isCorrect: false },
      { text: 'A firewall rule', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A cipher is an algorithm used to perform encryption or decryption.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the Caesar cipher?',
    choices: [
      { text: 'A modern encryption standard', isCorrect: false },
      { text: 'A substitution cipher that shifts letters', isCorrect: true },
      { text: 'A hashing algorithm', isCorrect: false },
      { text: 'A digital signature method', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The Caesar cipher is a simple substitution cipher that shifts each letter by a fixed number of positions.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'In symmetric encryption, how many keys are used?',
    choices: [
      { text: 'One key for both encryption and decryption', isCorrect: true },
      { text: 'Two different keys', isCorrect: false },
      { text: 'Three keys', isCorrect: false },
      { text: 'No keys are needed', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Symmetric encryption uses a single shared key for both encryption and decryption.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is cryptanalysis?',
    choices: [
      { text: 'The study of breaking cryptographic systems', isCorrect: true },
      { text: 'Creating new encryption algorithms', isCorrect: false },
      { text: 'Implementing security policies', isCorrect: false },
      { text: 'Network traffic analysis', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Cryptanalysis is the science of analyzing and breaking encryption schemes and cryptographic protocols.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What makes a strong encryption algorithm?',
    choices: [
      { text: 'It is fast to compute', isCorrect: false },
      { text: 'It is computationally infeasible to break', isCorrect: true },
      { text: 'It uses short keys', isCorrect: false },
      { text: 'It is easy to remember', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A strong encryption algorithm should be computationally infeasible to break without the key, even with significant resources.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the purpose of a cryptographic salt?',
    choices: [
      { text: 'To add random data to passwords before hashing', isCorrect: true },
      { text: 'To encrypt network traffic', isCorrect: false },
      { text: 'To compress data', isCorrect: false },
      { text: 'To detect viruses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A salt is random data added to passwords before hashing to prevent rainbow table attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is confidentiality in cryptography?',
    choices: [
      { text: 'Ensuring only authorized parties can read the data', isCorrect: true },
      { text: 'Verifying the sender identity', isCorrect: false },
      { text: 'Preventing data deletion', isCorrect: false },
      { text: 'Speeding up data transmission', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Confidentiality ensures that information is accessible only to those authorized to access it.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which is NOT a goal of cryptography?',
    choices: [
      { text: 'Confidentiality', isCorrect: false },
      { text: 'Integrity', isCorrect: false },
      { text: 'Authentication', isCorrect: false },
      { text: 'Data compression', isCorrect: true }
    ],
    difficulty: 'easy',
    explanation: 'The main goals of cryptography are confidentiality, integrity, authentication, and non-repudiation, not data compression.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a brute force attack in cryptography?',
    choices: [
      { text: 'Trying all possible keys until finding the correct one', isCorrect: true },
      { text: 'Physically destroying encryption hardware', isCorrect: false },
      { text: 'Sending too many requests to a server', isCorrect: false },
      { text: 'Infecting systems with malware', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A brute force attack systematically tries all possible keys or passwords until finding the correct one.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is key length in encryption?',
    choices: [
      { text: 'The number of characters in a password', isCorrect: false },
      { text: 'The size of the encryption key in bits', isCorrect: true },
      { text: 'The time it takes to encrypt', isCorrect: false },
      { text: 'The file size after encryption', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Key length refers to the size of the cryptographic key measured in bits, which affects the strength of encryption.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Why is a longer key generally more secure?',
    choices: [
      { text: 'It makes encryption faster', isCorrect: false },
      { text: 'It increases the number of possible keys', isCorrect: true },
      { text: 'It reduces file size', isCorrect: false },
      { text: 'It is easier to remember', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A longer key exponentially increases the number of possible combinations, making brute force attacks more difficult.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is authentication in cryptography?',
    choices: [
      { text: 'Verifying the identity of a user or system', isCorrect: true },
      { text: 'Encrypting data', isCorrect: false },
      { text: 'Deleting unauthorized files', isCorrect: false },
      { text: 'Backing up data', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Authentication verifies that users, systems, or data are who or what they claim to be.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is steganography?',
    choices: [
      { text: 'Hiding data within other data', isCorrect: true },
      { text: 'A type of encryption', isCorrect: false },
      { text: 'A password manager', isCorrect: false },
      { text: 'A firewall technique', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Steganography is the practice of hiding secret information within ordinary data, like hiding text in an image.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the difference between encoding and encryption?',
    choices: [
      { text: 'Encoding is reversible without a key, encryption requires a key', isCorrect: true },
      { text: 'They are the same thing', isCorrect: false },
      { text: 'Encoding is more secure', isCorrect: false },
      { text: 'Encryption is older than encoding', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Encoding transforms data using a publicly available scheme (like Base64), while encryption uses a secret key for security.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a substitution cipher?',
    choices: [
      { text: 'Replacing each character with another character', isCorrect: true },
      { text: 'Rearranging the order of characters', isCorrect: false },
      { text: 'Deleting certain characters', isCorrect: false },
      { text: 'Adding random characters', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A substitution cipher replaces each letter or symbol with another letter or symbol according to a fixed system.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a transposition cipher?',
    choices: [
      { text: 'Changing the position of characters', isCorrect: true },
      { text: 'Replacing characters with others', isCorrect: false },
      { text: 'Removing characters', isCorrect: false },
      { text: 'Converting to binary', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A transposition cipher rearranges the positions of characters in the plaintext according to a specific system.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What does "end-to-end encryption" mean?',
    choices: [
      { text: 'Data is encrypted only at the sender', isCorrect: false },
      { text: 'Data is encrypted from sender to receiver with no intermediary access', isCorrect: true },
      { text: 'Data is never encrypted', isCorrect: false },
      { text: 'Only the server can decrypt messages', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'End-to-end encryption ensures that only the sender and intended recipient can read messages, not intermediaries.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is a cryptographic primitive?',
    choices: [
      { text: 'A basic cryptographic building block', isCorrect: true },
      { text: 'An old encryption method', isCorrect: false },
      { text: 'A simple password', isCorrect: false },
      { text: 'A type of malware', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Cryptographic primitives are basic, well-established algorithms that serve as building blocks for cryptographic protocols.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the main weakness of classical ciphers like Caesar cipher?',
    choices: [
      { text: 'They are too slow', isCorrect: false },
      { text: 'They can be easily broken with frequency analysis', isCorrect: true },
      { text: 'They require computers', isCorrect: false },
      { text: 'They use too much memory', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Classical ciphers are vulnerable to frequency analysis because they preserve patterns in the original text.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is the Vigenère cipher?',
    choices: [
      { text: 'A polyalphabetic substitution cipher using a keyword', isCorrect: true },
      { text: 'A modern block cipher', isCorrect: false },
      { text: 'A hashing algorithm', isCorrect: false },
      { text: 'A public key system', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Vigenère cipher uses a keyword to perform multiple Caesar cipher shifts, making it stronger than simple substitution.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'What is perfect secrecy in cryptography?',
    choices: [
      { text: 'When ciphertext provides no information about plaintext', isCorrect: true },
      { text: 'When encryption is very fast', isCorrect: false },
      { text: 'When no one knows the algorithm', isCorrect: false },
      { text: 'When the key is very long', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Perfect secrecy (or information-theoretic security) means the ciphertext reveals absolutely no information about the plaintext.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 1,
    question: 'Which principle states that security should not rely on keeping the algorithm secret?',
    choices: [
      { text: 'Shannon\'s maxim', isCorrect: false },
      { text: 'Kerckhoffs\'s principle', isCorrect: true },
      { text: 'Diffie-Hellman principle', isCorrect: false },
      { text: 'RSA principle', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Kerckhoffs\'s principle states that a cryptosystem should be secure even if everything except the key is public knowledge.',
    points: 100
  }
];

// Continue with Cryptography Lesson 2 (30 questions about hashing, digital signatures, etc.)
const cryptographyLesson2Questions = [
  {
    module: 'cryptography',
    lessonNumber: 2,
    question: 'What is a hash function?',
    choices: [
      { text: 'A function that converts data into a fixed-size value', isCorrect: true },
      { text: 'A type of encryption', isCorrect: false },
      { text: 'A password generator', isCorrect: false },
      { text: 'A compression algorithm', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A hash function takes input data of any size and produces a fixed-size output called a hash or digest.',
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

// Cryptography Lesson 3: Hash Functions & Digital Signatures (30 questions)
const cryptographyLesson3Questions = [
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a hash function?',
    choices: [
      { text: 'A one-way function that converts data into a fixed-size value', isCorrect: true },
      { text: 'A reversible encryption algorithm', isCorrect: false },
      { text: 'A type of symmetric key', isCorrect: false },
      { text: 'A password storage method', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hash functions are one-way cryptographic functions that produce a fixed-size output (hash) from any input, and cannot be reversed.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is collision resistance in hash functions?',
    choices: [
      { text: 'The difficulty of finding two different inputs that produce the same hash', isCorrect: true },
      { text: 'Protection against network collisions', isCorrect: false },
      { text: 'The ability to reverse a hash', isCorrect: false },
      { text: 'Speed of hash computation', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Collision resistance ensures it\'s computationally infeasible to find two different inputs that hash to the same output.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'Which hash algorithm is considered secure for modern use?',
    choices: [
      { text: 'SHA-256', isCorrect: true },
      { text: 'MD5', isCorrect: false },
      { text: 'SHA-1', isCorrect: false },
      { text: 'CRC32', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 (part of SHA-2 family) is currently considered secure, while MD5 and SHA-1 have known vulnerabilities.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the purpose of digital signatures?',
    choices: [
      { text: 'To verify authenticity and integrity of messages', isCorrect: true },
      { text: 'To encrypt messages', isCorrect: false },
      { text: 'To compress data', isCorrect: false },
      { text: 'To delete messages', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Digital signatures use asymmetric cryptography to prove a message came from a specific sender and wasn\'t altered.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'How does a digital signature work?',
    choices: [
      { text: 'Hash the message and encrypt the hash with the sender\'s private key', isCorrect: true },
      { text: 'Encrypt the entire message with a public key', isCorrect: false },
      { text: 'Use symmetric encryption on the message', isCorrect: false },
      { text: 'Just hash the message without encryption', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'The sender hashes the message and encrypts the hash with their private key. Recipients verify using the sender\'s public key.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What does non-repudiation mean?',
    choices: [
      { text: 'The sender cannot deny having sent a message', isCorrect: true },
      { text: 'Messages cannot be deleted', isCorrect: false },
      { text: 'Encryption cannot be broken', isCorrect: false },
      { text: 'Keys cannot be shared', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Non-repudiation, provided by digital signatures, prevents the sender from denying they created or sent a message.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a Message Authentication Code (MAC)?',
    choices: [
      { text: 'A code that verifies both integrity and authenticity using a shared key', isCorrect: true },
      { text: 'A computer address', isCorrect: false },
      { text: 'An encryption algorithm', isCorrect: false },
      { text: 'A type of virus', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'MAC uses a symmetric key to create a tag that verifies the message came from someone with the shared secret key.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the difference between MAC and digital signature?',
    choices: [
      { text: 'MAC uses symmetric keys, signatures use asymmetric keys', isCorrect: true },
      { text: 'They are the same thing', isCorrect: false },
      { text: 'MAC is more secure', isCorrect: false },
      { text: 'Signatures are faster', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'MACs use shared symmetric keys (both parties have same key), while digital signatures use asymmetric key pairs.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'Why can\'t you reverse a cryptographic hash?',
    choices: [
      { text: 'Information is lost during the hashing process', isCorrect: true },
      { text: 'It\'s just not implemented', isCorrect: false },
      { text: 'You can reverse it with enough computing power', isCorrect: false },
      { text: 'Hashes are encrypted', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Hash functions are designed to lose information - many possible inputs map to the same output, making reversal impossible.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a hash collision?',
    choices: [
      { text: 'When two different inputs produce the same hash output', isCorrect: true },
      { text: 'When a hash function crashes', isCorrect: false },
      { text: 'When network packets collide', isCorrect: false },
      { text: 'When two people use the same password', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'A collision occurs when different inputs produce identical hash values, which should be extremely rare in secure hash functions.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the avalanche effect in hash functions?',
    choices: [
      { text: 'A small change in input causes a large change in output', isCorrect: true },
      { text: 'Hashes spread like an avalanche', isCorrect: false },
      { text: 'The function gets slower over time', isCorrect: false },
      { text: 'Errors cascade through the system', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The avalanche effect means even a single bit change in input dramatically changes the hash, making patterns undetectable.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is HMAC?',
    choices: [
      { text: 'Hash-based Message Authentication Code', isCorrect: true },
      { text: 'High-speed MAC protocol', isCorrect: false },
      { text: 'Hashed Malware Access Control', isCorrect: false },
      { text: 'Hardware MAC address', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'HMAC combines a hash function with a secret key to provide both integrity and authentication.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'Why is MD5 no longer recommended?',
    choices: [
      { text: 'Practical collision attacks have been demonstrated', isCorrect: true },
      { text: 'It\'s too slow', isCorrect: false },
      { text: 'It produces hashes that are too long', isCorrect: false },
      { text: 'It requires too much memory', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Researchers have found ways to create MD5 collisions, making it unsafe for security applications.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What size hash does SHA-256 produce?',
    choices: [
      { text: '256 bits', isCorrect: true },
      { text: '256 bytes', isCorrect: false },
      { text: '128 bits', isCorrect: false },
      { text: '512 bits', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SHA-256 produces a 256-bit (32-byte) hash output regardless of input size.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the primary purpose of hashing passwords?',
    choices: [
      { text: 'To store them securely without revealing the original password', isCorrect: true },
      { text: 'To make them shorter', isCorrect: false },
      { text: 'To encrypt them', isCorrect: false },
      { text: 'To make login faster', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hashing passwords means even if the database is breached, attackers get hashes instead of actual passwords.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a salt in password hashing?',
    choices: [
      { text: 'Random data added to passwords before hashing', isCorrect: true },
      { text: 'A chemical compound', isCorrect: false },
      { text: 'The hash output', isCorrect: false },
      { text: 'A type of encryption key', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Salts are unique random values added to each password before hashing to prevent rainbow table attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a rainbow table?',
    choices: [
      { text: 'Precomputed table of hashes for common passwords', isCorrect: true },
      { text: 'A colorful data structure', isCorrect: false },
      { text: 'A network routing table', isCorrect: false },
      { text: 'An encryption algorithm', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Rainbow tables store precomputed hashes of common passwords to speed up password cracking attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'How does salting prevent rainbow table attacks?',
    choices: [
      { text: 'Each password has a unique salt, requiring unique rainbow tables', isCorrect: true },
      { text: 'It makes hashes longer', isCorrect: false },
      { text: 'It encrypts the rainbow table', isCorrect: false },
      { text: 'It deletes rainbow tables', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'With unique salts per password, attackers would need separate rainbow tables for each salt value, making attacks impractical.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What does data integrity ensure?',
    choices: [
      { text: 'Data has not been altered or tampered with', isCorrect: true },
      { text: 'Data is encrypted', isCorrect: false },
      { text: 'Data is backed up', isCorrect: false },
      { text: 'Data is deleted properly', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Integrity verification, often using hashes, ensures data remains unchanged from its original form.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is a checksum?',
    choices: [
      { text: 'A value used to verify data integrity', isCorrect: true },
      { text: 'A total of all checks received', isCorrect: false },
      { text: 'An encryption key', isCorrect: false },
      { text: 'A type of virus', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Checksums are calculated values (often hashes) used to detect errors or changes in data.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'Which property ensures authentication in digital signatures?',
    choices: [
      { text: 'Only the holder of the private key could create the signature', isCorrect: true },
      { text: 'The signature is encrypted', isCorrect: false },
      { text: 'The signature is long', isCorrect: false },
      { text: 'Multiple people can create the same signature', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Since only the legitimate sender has the private key, a valid signature proves the sender\'s identity.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the birthday paradox in relation to hash functions?',
    choices: [
      { text: 'Finding collisions is easier than finding a specific hash', isCorrect: true },
      { text: 'Hashes change on birthdays', isCorrect: false },
      { text: 'Hash functions were invented on someone\'s birthday', isCorrect: false },
      { text: 'Collisions happen on specific dates', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'The birthday attack exploits that finding any two matching items is easier than finding a match for a specific item.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is certificate authority verification based on?',
    choices: [
      { text: 'Digital signatures', isCorrect: true },
      { text: 'Passwords', isCorrect: false },
      { text: 'IP addresses', isCorrect: false },
      { text: 'Physical documents', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Certificate Authorities (CAs) use digital signatures to certify the authenticity of public keys.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is pre-image resistance?',
    choices: [
      { text: 'Given a hash, it should be hard to find an input that produces it', isCorrect: true },
      { text: 'Images cannot be hashed', isCorrect: false },
      { text: 'Hashes cannot be previewed', isCorrect: false },
      { text: 'Protection against pre-computing hashes', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Pre-image resistance means you cannot work backwards from a hash to discover the original input.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'Why are hash functions important for blockchain?',
    choices: [
      { text: 'They link blocks together and ensure tamper-evidence', isCorrect: true },
      { text: 'They encrypt the blockchain', isCorrect: false },
      { text: 'They make transactions faster', isCorrect: false },
      { text: 'They store cryptocurrency', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Each block contains the hash of the previous block, creating a chain where any alteration is detectable.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is code signing?',
    choices: [
      { text: 'Using digital signatures to verify software authenticity', isCorrect: true },
      { text: 'Writing code in sign language', isCorrect: false },
      { text: 'Encrypting source code', isCorrect: false },
      { text: 'Commenting code', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Code signing uses digital signatures to prove software comes from a verified publisher and hasn\'t been altered.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What does second pre-image resistance mean?',
    choices: [
      { text: 'Given an input and its hash, it\'s hard to find a different input with the same hash', isCorrect: true },
      { text: 'You can hash something twice', isCorrect: false },
      { text: 'The second hash is always different', isCorrect: false },
      { text: 'Images resist hashing twice', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Second pre-image resistance prevents attackers from finding an alternative message that hashes to the same value.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is file integrity monitoring (FIM)?',
    choices: [
      { text: 'Using hashes to detect unauthorized file changes', isCorrect: true },
      { text: 'Backing up files', isCorrect: false },
      { text: 'Encrypting files', isCorrect: false },
      { text: 'Deleting old files', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'FIM compares current file hashes to baseline hashes to detect modifications, indicating potential security breaches.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What is the main advantage of asymmetric crypto for digital signatures?',
    choices: [
      { text: 'Public verification without sharing the signing key', isCorrect: true },
      { text: 'It\'s faster than symmetric crypto', isCorrect: false },
      { text: 'It produces shorter signatures', isCorrect: false },
      { text: 'It doesn\'t need keys', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Anyone can verify a signature using the public key, but only the private key holder can create valid signatures.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 3,
    question: 'What hash function family is currently recommended by NIST?',
    choices: [
      { text: 'SHA-2 (including SHA-256, SHA-512)', isCorrect: true },
      { text: 'MD5 family', isCorrect: false },
      { text: 'SHA-1', isCorrect: false },
      { text: 'CRC family', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NIST recommends SHA-2 family (SHA-256, SHA-384, SHA-512) and SHA-3 for cryptographic applications.',
    points: 100
  }
];

// Cryptography Lesson 4: Applied Cryptography (30 questions)
const cryptographyLesson4Questions = [
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What does HTTPS stand for?',
    choices: [
      { text: 'HyperText Transfer Protocol Secure', isCorrect: true },
      { text: 'High-Tech Transmission Protocol System', isCorrect: false },
      { text: 'Hyperlink Text Processing Service', isCorrect: false },
      { text: 'HTML Transfer Protocol Standard', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'HTTPS is the secure version of HTTP, using TLS/SSL to encrypt communications between browsers and servers.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What protocol does HTTPS use for encryption?',
    choices: [
      { text: 'TLS (Transport Layer Security)', isCorrect: true },
      { text: 'FTP', isCorrect: false },
      { text: 'SMTP', isCorrect: false },
      { text: 'DNS', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'HTTPS uses TLS (formerly SSL) to provide encrypted, authenticated communications over the internet.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is a VPN?',
    choices: [
      { text: 'Virtual Private Network - encrypted tunnel over public networks', isCorrect: true },
      { text: 'Very Private Network', isCorrect: false },
      { text: 'Verified Public Network', isCorrect: false },
      { text: 'Virtual Protection Node', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'VPNs create encrypted tunnels through public networks, protecting data and providing privacy.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is end-to-end encryption?',
    choices: [
      { text: 'Only sender and recipient can decrypt messages, not intermediaries', isCorrect: true },
      { text: 'Encryption that works from start to finish of a process', isCorrect: false },
      { text: 'Encrypting both ends of a cable', isCorrect: false },
      { text: 'Terminal-to-terminal connection', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'E2E encryption ensures only communicating parties can read messages, even service providers cannot access content.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is full-disk encryption?',
    choices: [
      { text: 'Encrypting an entire storage device including OS and files', isCorrect: true },
      { text: 'Filling a disk completely with encrypted data', isCorrect: false },
      { text: 'Encrypting only full files, not partial ones', isCorrect: false },
      { text: 'A type of RAID configuration', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Full-disk encryption (FDE) protects all data on a drive, preventing unauthorized access if the device is stolen.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is BitLocker?',
    choices: [
      { text: 'Microsoft\'s full-disk encryption tool for Windows', isCorrect: true },
      { text: 'A cryptocurrency wallet', isCorrect: false },
      { text: 'A file compression tool', isCorrect: false },
      { text: 'An antivirus program', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'BitLocker is Windows\' built-in encryption feature that protects data by encrypting entire drives.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What cryptographic technique do cryptocurrencies like Bitcoin use?',
    choices: [
      { text: 'Public-key cryptography and cryptographic hashing', isCorrect: true },
      { text: 'Only symmetric encryption', isCorrect: false },
      { text: 'No encryption at all', isCorrect: false },
      { text: 'Physical security only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Cryptocurrencies use asymmetric cryptography for wallets/signatures and hashing for blockchain integrity.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is a blockchain?',
    choices: [
      { text: 'A distributed ledger using cryptographic hashes to link blocks', isCorrect: true },
      { text: 'A chain made of blocks', isCorrect: false },
      { text: 'A type of encryption algorithm', isCorrect: false },
      { text: 'A firewall technology', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Blockchain is a tamper-evident ledger where each block contains the hash of the previous block, creating an immutable chain.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'Why should passwords be hashed with salt?',
    choices: [
      { text: 'To prevent rainbow table attacks and make identical passwords hash differently', isCorrect: true },
      { text: 'To make them taste better', isCorrect: false },
      { text: 'To make hashing faster', isCorrect: false },
      { text: 'To reduce storage space', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Salting adds unique random data to each password before hashing, preventing precomputed hash attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is bcrypt?',
    choices: [
      { text: 'A password hashing function designed to be slow', isCorrect: true },
      { text: 'A type of malware', isCorrect: false },
      { text: 'An encryption algorithm', isCorrect: false },
      { text: 'A compression tool', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'bcrypt intentionally slows down hashing to make brute-force attacks impractical, protecting password databases.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is the purpose of the TLS handshake?',
    choices: [
      { text: 'To establish encryption parameters and authenticate the server', isCorrect: true },
      { text: 'To shake hands with the server', isCorrect: false },
      { text: 'To compress data', isCorrect: false },
      { text: 'To delete cookies', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The TLS handshake negotiates encryption algorithms, exchanges keys, and verifies server identity using certificates.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is Perfect Forward Secrecy (PFS)?',
    choices: [
      { text: 'Session keys remain secure even if long-term keys are compromised', isCorrect: true },
      { text: 'Encryption that never fails', isCorrect: false },
      { text: 'A type of perfect cipher', isCorrect: false },
      { text: 'Forward error correction', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'PFS ensures past communications stay secure even if private keys are later compromised, using ephemeral session keys.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What does SSL certificate contain?',
    choices: [
      { text: 'Public key, domain name, issuer info, and digital signature', isCorrect: true },
      { text: 'Private keys and passwords', isCorrect: false },
      { text: 'Only the domain name', isCorrect: false },
      { text: 'Website source code', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'SSL/TLS certificates bind a public key to a domain, signed by a trusted Certificate Authority.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is two-factor authentication (2FA)?',
    choices: [
      { text: 'Using two different types of credentials to verify identity', isCorrect: true },
      { text: 'Logging in twice', isCorrect: false },
      { text: 'Using two passwords', isCorrect: false },
      { text: 'Authentication for two people', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: '2FA combines something you know (password) with something you have (phone/token) or are (biometrics).',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is encrypted messaging\'s main benefit?',
    choices: [
      { text: 'Protects message content from interception and eavesdropping', isCorrect: true },
      { text: 'Makes messages send faster', isCorrect: false },
      { text: 'Reduces data usage', isCorrect: false },
      { text: 'Improves battery life', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Encrypted messaging prevents unauthorized parties from reading message content, ensuring privacy.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is encryption at rest?',
    choices: [
      { text: 'Encrypting data when stored on disk or backup', isCorrect: true },
      { text: 'Encryption that doesn\'t work', isCorrect: false },
      { text: 'Sleeping computer encryption', isCorrect: false },
      { text: 'Encrypting resting employees', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Encryption at rest protects stored data from unauthorized access if physical storage is stolen or accessed.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is encryption in transit?',
    choices: [
      { text: 'Encrypting data while it travels over networks', isCorrect: true },
      { text: 'Encrypting public transportation', isCorrect: false },
      { text: 'Temporary encryption', isCorrect: false },
      { text: 'Moving encrypted files', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Encryption in transit (like HTTPS/TLS) protects data during transmission from eavesdropping attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is a key derivation function (KDF)?',
    choices: [
      { text: 'Function that derives cryptographic keys from passwords', isCorrect: true },
      { text: 'Function that derives passwords from keys', isCorrect: false },
      { text: 'Mathematical derivative function', isCorrect: false },
      { text: 'Key deletion function', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'KDFs like PBKDF2 convert weak passwords into strong cryptographic keys using salting and iteration.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is the purpose of certificate pinning?',
    choices: [
      { text: 'To prevent man-in-the-middle attacks by hardcoding expected certificates', isCorrect: true },
      { text: 'To physically pin certificates to a board', isCorrect: false },
      { text: 'To compress certificates', isCorrect: false },
      { text: 'To share certificates publicly', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Certificate pinning validates that a specific certificate is expected, preventing attackers from using fraudulent certificates.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What does PGP stand for?',
    choices: [
      { text: 'Pretty Good Privacy', isCorrect: true },
      { text: 'Public Group Protocol', isCorrect: false },
      { text: 'Personal Guard Program', isCorrect: false },
      { text: 'Protected Gateway Process', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'PGP is an encryption program for email and file encryption using public-key cryptography.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is SSH used for?',
    choices: [
      { text: 'Secure remote access to computers and servers', isCorrect: true },
      { text: 'Social media sharing', isCorrect: false },
      { text: 'Sending spam', isCorrect: false },
      { text: 'Screen sharing only', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SSH (Secure Shell) provides encrypted remote terminal access and secure file transfers.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is signal protocol known for?',
    choices: [
      { text: 'Providing end-to-end encryption for messaging apps', isCorrect: true },
      { text: 'Radio signal transmission', isCorrect: false },
      { text: 'Traffic signal control', isCorrect: false },
      { text: 'Wi-Fi protocols', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Signal Protocol powers encrypted messaging in apps like Signal, WhatsApp, and others.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is the main weakness of WEP Wi-Fi encryption?',
    choices: [
      { text: 'Weak encryption that can be cracked in minutes', isCorrect: true },
      { text: 'It\'s too strong', isCorrect: false },
      { text: 'It\'s too slow', isCorrect: false },
      { text: 'It has no weaknesses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'WEP has serious cryptographic flaws and can be cracked quickly; WPA2/WPA3 should be used instead.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is WPA3?',
    choices: [
      { text: 'The latest Wi-Fi security protocol with improved encryption', isCorrect: true },
      { text: 'Third version of Windows Password Authentication', isCorrect: false },
      { text: 'Web Page Authentication 3', isCorrect: false },
      { text: 'Wireless Phone Application', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'WPA3 is the newest Wi-Fi security standard, offering stronger encryption and protection against attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is homomorphic encryption?',
    choices: [
      { text: 'Encryption that allows computations on encrypted data', isCorrect: true },
      { text: 'Encryption of similar things', isCorrect: false },
      { text: 'Home-based encryption', isCorrect: false },
      { text: 'Encryption for morphing images', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Homomorphic encryption enables performing calculations on encrypted data without decrypting it first.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is quantum-resistant cryptography?',
    choices: [
      { text: 'Algorithms designed to resist attacks from quantum computers', isCorrect: true },
      { text: 'Encryption for quantum physics', isCorrect: false },
      { text: 'Encryption that resists everything', isCorrect: false },
      { text: 'Ultra-fast encryption', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Post-quantum cryptography aims to develop algorithms secure against both classical and quantum computer attacks.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'Why is random number generation important in cryptography?',
    choices: [
      { text: 'Keys and initialization vectors must be unpredictable', isCorrect: true },
      { text: 'For lottery number selection', isCorrect: false },
      { text: 'To slow down encryption', isCorrect: false },
      { text: 'It\'s not important', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Cryptographically secure random numbers ensure keys and nonces cannot be predicted or reproduced by attackers.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is a Hardware Security Module (HSM)?',
    choices: [
      { text: 'Physical device that safeguards and manages cryptographic keys', isCorrect: true },
      { text: 'Software security module', isCorrect: false },
      { text: 'High-speed memory', isCorrect: false },
      { text: 'Hard drive security', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'HSMs are tamper-resistant hardware devices that securely generate, store, and use cryptographic keys.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What is the purpose of a nonce in encryption?',
    choices: [
      { text: 'A number used once to ensure uniqueness and prevent replay attacks', isCorrect: true },
      { text: 'A permanent key', isCorrect: false },
      { text: 'An error code', isCorrect: false },
      { text: 'A type of hash', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Nonces (number used once) add randomness to encryption, preventing attackers from reusing or replaying messages.',
    points: 100
  },
  {
    module: 'cryptography',
    lessonNumber: 4,
    question: 'What makes AES-256 stronger than AES-128?',
    choices: [
      { text: 'Longer key length provides more possible key combinations', isCorrect: true },
      { text: 'It\'s faster', isCorrect: false },
      { text: 'It uses less memory', isCorrect: false },
      { text: 'It\'s easier to implement', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'AES-256\'s 256-bit keys have 2^256 possibilities versus AES-128\'s 2^128, making brute force attacks vastly harder.',
    points: 100
  }
];

// ===============================================
// WEB SECURITY MODULE - All Lessons (120 questions)
// ===============================================

// Web Security Lesson 1: Web Application Security Fundamentals (30 questions)
// Web Security Lesson 1: Web Application Security Fundamentals (30 questions)
const webSecurityLesson1Questions = [
  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What does the CIA triad stand for in information security?",
    choices: [
      { text: "Confidentiality, Integrity, and Availability", isCorrect: true },
      { text: "Central Intelligence Agency", isCorrect: false },
      { text: "Computer Internet Access", isCorrect: false },
      { text: "Cybersecurity Investigation Agency", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "The CIA triad represents the three core principles of information security: protecting data confidentiality, ensuring data integrity, and maintaining system availability.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is confidentiality in web security?",
    choices: [
      { text: "Ensuring only authorized users can access sensitive information", isCorrect: true },
      { text: "Making all data publicly available", isCorrect: false },
      { text: "Deleting old data regularly", isCorrect: false },
      { text: "Speeding up website performance", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Confidentiality protects sensitive data from unauthorized disclosure through encryption, access controls, and authentication.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is data integrity?",
    choices: [
      { text: "Ensuring data remains accurate and unaltered by unauthorized parties", isCorrect: true },
      { text: "Making data available 24/7", isCorrect: false },
      { text: "Encrypting all communications", isCorrect: false },
      { text: "Backing up data daily", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Integrity ensures data authenticity and prevents unauthorized modification through checksums, hashes, and digital signatures.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What does availability mean in the CIA triad?",
    choices: [
      { text: "Ensuring systems and data are accessible when needed", isCorrect: true },
      { text: "Making websites free to use", isCorrect: false },
      { text: "Sharing data with everyone", isCorrect: false },
      { text: "Working only during business hours", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Availability ensures authorized users can access systems and data without disruption through redundancy, DDoS protection, and proper maintenance.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What are the three layers of security?",
    choices: [
      { text: "Physical, Network, and Application security", isCorrect: true },
      { text: "Hardware, Software, and Users", isCorrect: false },
      { text: "Firewall, Antivirus, and Passwords", isCorrect: false },
      { text: "Front-end, Back-end, and Database", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Defense-in-depth uses physical security (building access), network security (firewalls), and application security (input validation) as layered protection.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is a threat agent?",
    choices: [
      { text: "An entity that can cause harm to a system (hackers, malware, insiders)", isCorrect: true },
      { text: "A security guard", isCorrect: false },
      { text: "An antivirus program", isCorrect: false },
      { text: "A network cable", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Threat agents include hackers, malicious insiders, automated bots, and nation-state actors who exploit vulnerabilities.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is a vulnerability?",
    choices: [
      { text: "A weakness in a system that can be exploited", isCorrect: true },
      { text: "A type of malware", isCorrect: false },
      { text: "A security feature", isCorrect: false },
      { text: "An encrypted connection", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Vulnerabilities are flaws or weaknesses in software, configurations, or processes that attackers can exploit to compromise systems.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is an attack in the security context?",
    choices: [
      { text: "An exploitation of a vulnerability to cause harm", isCorrect: true },
      { text: "A security update", isCorrect: false },
      { text: "A firewall rule", isCorrect: false },
      { text: "A backup procedure", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Attacks occur when threat agents exploit vulnerabilities using specific techniques to compromise confidentiality, integrity, or availability.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What are security controls?",
    choices: [
      { text: "Measures implemented to reduce risk and prevent attacks", isCorrect: true },
      { text: "Remote control devices", isCorrect: false },
      { text: "User passwords only", isCorrect: false },
      { text: "Physical locks", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security controls include technical measures (firewalls, encryption), administrative controls (policies), and physical controls (access badges).",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is technical impact?",
    choices: [
      { text: "The direct effect of an attack on systems (data loss, downtime, compromise)", isCorrect: true },
      { text: "The speed of computers", isCorrect: false },
      { text: "Employee productivity", isCorrect: false },
      { text: "Internet bandwidth", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Technical impact measures system-level consequences like unauthorized access, data corruption, or service disruption.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is business impact?",
    choices: [
      { text: "The effect on operations, reputation, and finances", isCorrect: true },
      { text: "Only financial losses", isCorrect: false },
      { text: "Technical specifications", isCorrect: false },
      { text: "Network speed", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Business impact includes revenue loss, brand damage, legal liability, customer trust erosion, and regulatory penalties.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "Why is web application security critical?",
    choices: [
      { text: "Web apps handle sensitive data and are publicly accessible", isCorrect: true },
      { text: "It makes websites prettier", isCorrect: false },
      { text: "It's only important for banks", isCorrect: false },
      { text: "Web security is optional", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Web applications process personal data, financial transactions, and business information while facing constant internet-wide attack attempts.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What makes web applications attractive targets?",
    choices: [
      { text: "They are internet-facing, handle valuable data, and often have vulnerabilities", isCorrect: true },
      { text: "They are physically located", isCorrect: false },
      { text: "They are cheap to attack", isCorrect: false },
      { text: "They are not attractive targets", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Public accessibility, valuable data storage, and common coding errors make web apps prime targets for attackers worldwide.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is authentication?",
    choices: [
      { text: "Verifying the identity of a user or system", isCorrect: true },
      { text: "Encrypting passwords", isCorrect: false },
      { text: "Blocking hackers", isCorrect: false },
      { text: "Deleting old accounts", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Authentication confirms \"you are who you say you are\" through passwords, biometrics, tokens, or multi-factor methods.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is authorization?",
    choices: [
      { text: "Determining what actions an authenticated user can perform", isCorrect: true },
      { text: "Logging into a system", isCorrect: false },
      { text: "Creating user accounts", isCorrect: false },
      { text: "Encrypting data", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Authorization controls access rights, defining what resources and operations authenticated users are permitted to use.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the difference between authentication and authorization?",
    choices: [
      { text: "Authentication verifies identity; authorization controls access rights", isCorrect: true },
      { text: "They are exactly the same", isCorrect: false },
      { text: "Authorization comes before authentication", isCorrect: false },
      { text: "Only one is needed for security", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Authentication answers \"who are you?\" while authorization answers \"what can you do?\" - both are essential for access control.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is input validation?",
    choices: [
      { text: "Checking user input for malicious or unexpected data before processing", isCorrect: true },
      { text: "Accepting all user input without checking", isCorrect: false },
      { text: "Encrypting form data", isCorrect: false },
      { text: "Storing user passwords", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Input validation sanitizes and verifies user data to prevent injection attacks, XSS, and other input-based exploits.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "Why should user input never be trusted?",
    choices: [
      { text: "Attackers can inject malicious code through input fields", isCorrect: true },
      { text: "Users always make typing mistakes", isCorrect: false },
      { text: "Input is always encrypted", isCorrect: false },
      { text: "Trust is not a security concern", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Trusting user input enables SQL injection, XSS, command injection, and other attacks that exploit unsanitized data.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is session management?",
    choices: [
      { text: "Securely tracking user interactions across multiple requests", isCorrect: true },
      { text: "Scheduling meetings", isCorrect: false },
      { text: "Managing database connections", isCorrect: false },
      { text: "Controlling network traffic", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Session management maintains user state using secure tokens, cookies, and timeouts to prevent hijacking and fixation attacks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the principle of least privilege?",
    choices: [
      { text: "Users should have only the minimum access needed for their role", isCorrect: true },
      { text: "Give all users administrator rights", isCorrect: false },
      { text: "Limit the number of users", isCorrect: false },
      { text: "Restrict internet access", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Least privilege limits damage from compromised accounts by restricting permissions to only essential functions and data.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is defense-in-depth?",
    choices: [
      { text: "Using multiple layers of security controls", isCorrect: true },
      { text: "Having only one strong firewall", isCorrect: false },
      { text: "Deep packet inspection only", isCorrect: false },
      { text: "Physical security alone", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Defense-in-depth employs overlapping security measures so that if one fails, others still provide protection.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "Why use HTTPS instead of HTTP?",
    choices: [
      { text: "HTTPS encrypts data in transit, protecting confidentiality", isCorrect: true },
      { text: "HTTPS is faster", isCorrect: false },
      { text: "HTTP is more secure", isCorrect: false },
      { text: "They are identical", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "HTTPS uses TLS/SSL to encrypt communications, preventing eavesdropping and man-in-the-middle attacks on sensitive data.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is a security misconfiguration?",
    choices: [
      { text: "Improperly configured security settings that create vulnerabilities", isCorrect: true },
      { text: "A type of malware", isCorrect: false },
      { text: "A firewall brand", isCorrect: false },
      { text: "A programming language", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Misconfigurations include default passwords, unnecessary services, verbose error messages, and unpatched systems.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the purpose of security logging?",
    choices: [
      { text: "To record security events for detection, investigation, and compliance", isCorrect: true },
      { text: "To slow down systems", isCorrect: false },
      { text: "To create backups", isCorrect: false },
      { text: "Logging serves no purpose", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Logs provide audit trails, enable incident detection, support forensic analysis, and demonstrate compliance with regulations.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is an attack surface?",
    choices: [
      { text: "All potential entry points that attackers can exploit", isCorrect: true },
      { text: "The physical area of a data center", isCorrect: false },
      { text: "The size of a website", isCorrect: false },
      { text: "Network bandwidth", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Attack surface includes all interfaces (APIs, forms, services) and assets that could be exploited; minimizing it reduces risk.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "Why patch and update software regularly?",
    choices: [
      { text: "To fix known vulnerabilities before attackers exploit them", isCorrect: true },
      { text: "Only for new features", isCorrect: false },
      { text: "Patching is unnecessary", isCorrect: false },
      { text: "To change software appearance", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security patches close discovered vulnerabilities, preventing exploitation by attackers who study published CVEs.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the security development lifecycle?",
    choices: [
      { text: "Integrating security practices throughout software development", isCorrect: true },
      { text: "Adding security only at the end", isCorrect: false },
      { text: "A type of encryption", isCorrect: false },
      { text: "A network protocol", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security should be embedded from requirements through design, coding, testing, and deployment - not bolted on afterward.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is a security baseline?",
    choices: [
      { text: "Minimum security standards and configurations required", isCorrect: true },
      { text: "The fastest security setting", isCorrect: false },
      { text: "Maximum security only", isCorrect: false },
      { text: "A network cable type", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security baselines establish consistent, minimum security requirements across systems to ensure adequate protection.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the shared responsibility model in cloud security?",
    choices: [
      { text: "Provider secures infrastructure; customer secures their data and applications", isCorrect: true },
      { text: "The provider handles all security", isCorrect: false },
      { text: "Customers are fully responsible for everything", isCorrect: false },
      { text: "Security is not needed in the cloud", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Cloud providers secure physical infrastructure and hypervisors while customers secure their apps, data, and access controls.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 1,
    question: "What is the ultimate goal of web application security?",
    choices: [
      { text: "To protect data, users, and operations from cyber threats", isCorrect: true },
      { text: "To make websites colorful", isCorrect: false },
      { text: "To increase page load speed", isCorrect: false },
      { text: "To eliminate all features", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Web security aims to maintain CIA triad principles while enabling safe, trustworthy online services for users and businesses.",
    points: 100
  }
];

// Web Security Lesson 2: Application Security Components (30 questions)
const webSecurityLesson2Questions = [
  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is an attack vector?",
    choices: [
      { text: "The path or method an attacker uses to reach a target", isCorrect: true },
      { text: "A mathematical formula", isCorrect: false },
      { text: "A type of antivirus", isCorrect: false },
      { text: "A network router", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Attack vectors include methods like phishing emails, SQL injection, XSS, or exploiting unpatched vulnerabilities.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is a security weakness?",
    choices: [
      { text: "A flaw that could potentially be exploited but hasn't been yet", isCorrect: true },
      { text: "A weak password only", isCorrect: false },
      { text: "Slow internet connection", isCorrect: false },
      { text: "Old computer hardware", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security weaknesses include poor coding practices, missing validation, or weak encryption that may become exploitable vulnerabilities.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is exploit likelihood?",
    choices: [
      { text: "The probability that a vulnerability will be successfully exploited", isCorrect: true },
      { text: "How fast attacks occur", isCorrect: false },
      { text: "The cost of an attack", isCorrect: false },
      { text: "Number of hackers worldwide", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Likelihood depends on factors like vulnerability accessibility, attacker skill required, and availability of exploit tools.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What factors increase exploit likelihood?",
    choices: [
      { text: "Easy to exploit, publicly known, automated tools available", isCorrect: true },
      { text: "Strong encryption", isCorrect: false },
      { text: "Regular patching", isCorrect: false },
      { text: "Multi-factor authentication", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Vulnerabilities with public exploits, low skill requirements, and automated scanning tools have high exploitation likelihood.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security risk?",
    choices: [
      { text: "The combination of threat likelihood and potential impact", isCorrect: true },
      { text: "Only financial loss", isCorrect: false },
      { text: "Network latency", isCorrect: false },
      { text: "User errors", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Risk = Likelihood × Impact. High-risk items have both high probability of exploitation and severe consequences.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is risk assessment?",
    choices: [
      { text: "Identifying and evaluating security risks to prioritize remediation", isCorrect: true },
      { text: "Guessing future attacks randomly", isCorrect: false },
      { text: "Installing antivirus software", isCorrect: false },
      { text: "Creating backups", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Risk assessments identify vulnerabilities, evaluate their severity and likelihood, and help prioritize security investments.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security testing?",
    choices: [
      { text: "Proactively finding vulnerabilities before attackers do", isCorrect: true },
      { text: "Testing network speed", isCorrect: false },
      { text: "Checking hardware functionality", isCorrect: false },
      { text: "User acceptance testing", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security testing includes penetration testing, vulnerability scanning, code review, and automated security scans.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is penetration testing?",
    choices: [
      { text: "Simulating real attacks to find exploitable vulnerabilities", isCorrect: true },
      { text: "Testing network cables", isCorrect: false },
      { text: "Database performance testing", isCorrect: false },
      { text: "User interface testing", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Pen testing uses ethical hackers to attempt real exploits, revealing how attackers could compromise systems.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is vulnerability scanning?",
    choices: [
      { text: "Automated tools that identify known security weaknesses", isCorrect: true },
      { text: "Manual code review only", isCorrect: false },
      { text: "Physical inspection of servers", isCorrect: false },
      { text: "Reading security news", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Vulnerability scanners automatically check systems against databases of known CVEs and misconfigurations.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is code review in security?",
    choices: [
      { text: "Examining source code for security flaws and vulnerabilities", isCorrect: true },
      { text: "Checking code formatting only", isCorrect: false },
      { text: "Measuring code performance", isCorrect: false },
      { text: "Counting lines of code", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security-focused code review identifies injection flaws, authentication issues, and other vulnerabilities in source code.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is a security control?",
    choices: [
      { text: "A safeguard implemented to reduce or eliminate risk", isCorrect: true },
      { text: "A remote control device", isCorrect: false },
      { text: "A type of malware", isCorrect: false },
      { text: "A programming language", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security controls include preventive (firewalls), detective (IDS), and corrective (patches) measures.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What are preventive controls?",
    choices: [
      { text: "Measures that stop attacks before they occur", isCorrect: true },
      { text: "Controls that only detect attacks", isCorrect: false },
      { text: "Post-incident recovery tools", isCorrect: false },
      { text: "Documentation only", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Preventive controls include firewalls, input validation, access controls, and encryption that block attacks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What are detective controls?",
    choices: [
      { text: "Measures that identify attacks in progress or after they occur", isCorrect: true },
      { text: "Controls that prevent all attacks", isCorrect: false },
      { text: "Recovery mechanisms only", isCorrect: false },
      { text: "User training programs", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Detective controls include IDS, logging, monitoring, and alerting systems that identify security incidents.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What are corrective controls?",
    choices: [
      { text: "Measures that restore systems after an incident", isCorrect: true },
      { text: "Controls that only prevent attacks", isCorrect: false },
      { text: "Attack detection systems", isCorrect: false },
      { text: "Firewall rules", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Corrective controls include backups, incident response plans, and patches that remediate damage and restore operations.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security awareness training?",
    choices: [
      { text: "Educating users about threats and secure practices", isCorrect: true },
      { text: "Technical training for programmers only", isCorrect: false },
      { text: "Hardware installation courses", isCorrect: false },
      { text: "Marketing training", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Awareness training teaches employees to recognize phishing, use strong passwords, and follow security policies.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "Why is the human element important in security?",
    choices: [
      { text: "Users are often the weakest link and first line of defense", isCorrect: true },
      { text: "Humans are not important in security", isCorrect: false },
      { text: "Only technical controls matter", isCorrect: false },
      { text: "Automation eliminates human factors", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Social engineering exploits human psychology, making trained, aware users critical to overall security posture.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is a security policy?",
    choices: [
      { text: "Formal rules defining how to protect assets and handle incidents", isCorrect: true },
      { text: "A type of insurance", isCorrect: false },
      { text: "Antivirus software", isCorrect: false },
      { text: "A firewall configuration", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security policies establish organizational standards for acceptable use, data handling, access control, and response procedures.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is an incident response plan?",
    choices: [
      { text: "Documented procedures for handling security breaches", isCorrect: true },
      { text: "A backup schedule", isCorrect: false },
      { text: "User manual", isCorrect: false },
      { text: "Network diagram", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Incident response plans define roles, communication, containment, eradication, and recovery steps for security events.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is secure coding?",
    choices: [
      { text: "Writing software with security considerations from the start", isCorrect: true },
      { text: "Encrypting source code files", isCorrect: false },
      { text: "Using only one programming language", isCorrect: false },
      { text: "Writing code quickly", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Secure coding practices include input validation, parameterized queries, proper error handling, and avoiding known vulnerabilities.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is the OWASP Top 10?",
    choices: [
      { text: "A list of the most critical web application security risks", isCorrect: true },
      { text: "Top 10 programming languages", isCorrect: false },
      { text: "Best antivirus programs", isCorrect: false },
      { text: "Fastest web servers", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "OWASP Top 10 identifies the most common and dangerous web vulnerabilities, guiding developers in security priorities.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "Why follow security frameworks and standards?",
    choices: [
      { text: "They provide proven best practices and ensure comprehensive coverage", isCorrect: true },
      { text: "They are legally required everywhere", isCorrect: false },
      { text: "They replace all other security measures", isCorrect: false },
      { text: "Frameworks are unnecessary", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Frameworks like NIST, ISO 27001, and OWASP offer structured approaches based on collective industry experience.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is threat modeling?",
    choices: [
      { text: "Identifying potential threats and attack scenarios during design", isCorrect: true },
      { text: "Creating 3D models of threats", isCorrect: false },
      { text: "Photography of attackers", isCorrect: false },
      { text: "Random threat generation", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Threat modeling analyzes system architecture to identify assets, threats, vulnerabilities, and required mitigations early.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security by design?",
    choices: [
      { text: "Building security into systems from the beginning, not adding it later", isCorrect: true },
      { text: "Designing pretty security logos", isCorrect: false },
      { text: "Adding security as an afterthought", isCorrect: false },
      { text: "Graphic design for security teams", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security by design embeds protection throughout architecture and development, making it stronger and more cost-effective.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is a security audit?",
    choices: [
      { text: "Systematic evaluation of security controls and compliance", isCorrect: true },
      { text: "Financial auditing only", isCorrect: false },
      { text: "User satisfaction survey", isCorrect: false },
      { text: "Network speed test", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Security audits assess whether controls are effective, policies are followed, and regulatory requirements are met.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is compliance in security?",
    choices: [
      { text: "Adhering to legal, regulatory, and industry security requirements", isCorrect: true },
      { text: "Agreeing with everyone", isCorrect: false },
      { text: "Using the same software as competitors", isCorrect: false },
      { text: "Following fashion trends", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Compliance ensures organizations meet standards like GDPR, HIPAA, PCI-DSS, or SOC 2 to protect data and avoid penalties.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is continuous monitoring?",
    choices: [
      { text: "Ongoing observation of systems for security events and anomalies", isCorrect: true },
      { text: "Checking security once per year", isCorrect: false },
      { text: "Watching employees constantly", isCorrect: false },
      { text: "Monitoring is unnecessary", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Continuous monitoring provides real-time visibility into threats, enabling rapid detection and response to incidents.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security automation?",
    choices: [
      { text: "Using tools to automatically handle repetitive security tasks", isCorrect: true },
      { text: "Replacing all security staff with robots", isCorrect: false },
      { text: "Self-driving cars", isCorrect: false },
      { text: "Automation eliminates all security needs", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Automation handles tasks like patch deployment, log analysis, and threat response, improving speed and consistency.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is a security baseline?",
    choices: [
      { text: "Minimum security configurations required for all systems", isCorrect: true },
      { text: "The lowest security possible", isCorrect: false },
      { text: "A type of firewall", isCorrect: false },
      { text: "Network bandwidth measurement", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security baselines standardize configurations across systems, ensuring consistent minimum protection levels.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is security governance?",
    choices: [
      { text: "Leadership and organizational structure for security management", isCorrect: true },
      { text: "Government regulations only", isCorrect: false },
      { text: "Technical security tools", isCorrect: false },
      { text: "User permissions", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Governance establishes security roles, responsibilities, oversight, and alignment with business objectives.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 2,
    question: "What is the goal of application security components?",
    choices: [
      { text: "To create comprehensive protection through people, process, and technology", isCorrect: true },
      { text: "To use only one security tool", isCorrect: false },
      { text: "To eliminate all users", isCorrect: false },
      { text: "To make systems slower", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Effective security combines technical controls, secure processes, trained people, and continuous improvement.",
    points: 100
  }
];

// Web Security Lesson 3: OWASP Top 10 Part 1 - A1-A5 (30 questions)
const webSecurityLesson3Questions = [
  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is injection according to OWASP A1?",
    choices: [
      { text: "Inserting malicious code into queries or commands", isCorrect: true },
      { text: "Medical procedure", isCorrect: false },
      { text: "Installing software", isCorrect: false },
      { text: "Network configuration", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query, allowing attackers to execute unintended commands.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is SQL injection?",
    choices: [
      { text: "Inserting malicious SQL code to manipulate databases", isCorrect: true },
      { text: "A database optimization technique", isCorrect: false },
      { text: "A type of backup", isCorrect: false },
      { text: "Database encryption", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "SQL injection allows attackers to view, modify, or delete database data by injecting SQL commands through vulnerable input fields.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "How can you prevent SQL injection?",
    choices: [
      { text: "Use parameterized queries and prepared statements", isCorrect: true },
      { text: "Never use databases", isCorrect: false },
      { text: "Use only GET requests", isCorrect: false },
      { text: "Disable all input fields", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Parameterized queries separate code from data, preventing injected SQL from being executed as commands.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is broken authentication (OWASP A2)?",
    choices: [
      { text: "Flaws in authentication and session management", isCorrect: true },
      { text: "Cracked computer screens", isCorrect: false },
      { text: "Network disconnections", isCorrect: false },
      { text: "Hardware failures", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Broken authentication includes weak passwords, session hijacking, credential stuffing, and poor session management.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What makes a password weak?",
    choices: [
      { text: "Short length, common words, predictable patterns, no complexity", isCorrect: true },
      { text: "Using special characters", isCorrect: false },
      { text: "Being long and random", isCorrect: false },
      { text: "Using multi-factor authentication", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Weak passwords like \"password123\" or \"qwerty\" are easily guessed or cracked through dictionary and brute-force attacks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is session hijacking?",
    choices: [
      { text: "Stealing session tokens to impersonate legitimate users", isCorrect: true },
      { text: "Scheduling too many meetings", isCorrect: false },
      { text: "Network traffic analysis", isCorrect: false },
      { text: "User logout", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Attackers steal session cookies/tokens through XSS, packet sniffing, or other means to access accounts without credentials.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is multi-factor authentication (MFA)?",
    choices: [
      { text: "Requiring two or more verification methods to authenticate", isCorrect: true },
      { text: "Using multiple passwords", isCorrect: false },
      { text: "Logging in multiple times", isCorrect: false },
      { text: "Having many user accounts", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "MFA combines something you know (password), have (phone/token), and/or are (biometrics) for stronger security.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is sensitive data exposure (OWASP A3)?",
    choices: [
      { text: "Inadequate protection of sensitive information", isCorrect: true },
      { text: "Publishing all data publicly", isCorrect: false },
      { text: "Using HTTPS", isCorrect: false },
      { text: "Encrypting everything", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Sensitive data exposure occurs when applications fail to encrypt data in transit/at rest or use weak cryptography.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What types of data need encryption?",
    choices: [
      { text: "Passwords, credit cards, personal information, health records", isCorrect: true },
      { text: "Only public information", isCorrect: false },
      { text: "Nothing needs encryption", isCorrect: false },
      { text: "Only images", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Any data that could cause harm if disclosed (PII, financial, health, credentials) must be encrypted.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is the difference between encryption in transit and at rest?",
    choices: [
      { text: "In transit protects data being transmitted; at rest protects stored data", isCorrect: true },
      { text: "They are the same thing", isCorrect: false },
      { text: "Only one is needed", isCorrect: false },
      { text: "Neither is important", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "TLS/HTTPS encrypts data in transit across networks; at-rest encryption protects data stored in databases and files.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is XML External Entities (XXE) - OWASP A4?",
    choices: [
      { text: "Exploiting vulnerable XML processors to access files or execute code", isCorrect: true },
      { text: "A markup language", isCorrect: false },
      { text: "A database type", isCorrect: false },
      { text: "An encryption method", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "XXE attacks exploit XML parsers that process external entities, allowing file disclosure, SSRF, or denial of service.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "How can you prevent XXE attacks?",
    choices: [
      { text: "Disable external entity processing in XML parsers", isCorrect: true },
      { text: "Never use XML", isCorrect: false },
      { text: "Only use JSON", isCorrect: false },
      { text: "XXE cannot be prevented", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Disabling DTD processing and external entities in XML libraries prevents XXE exploitation.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is broken access control (OWASP A5)?",
    choices: [
      { text: "Failures in restricting what authenticated users can access", isCorrect: true },
      { text: "Physical door locks not working", isCorrect: false },
      { text: "Network disconnections", isCorrect: false },
      { text: "Slow website performance", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Broken access control lets users access unauthorized functionality or data by bypassing authorization checks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is an Insecure Direct Object Reference (IDOR)?",
    choices: [
      { text: "Accessing objects by manipulating IDs without authorization checks", isCorrect: true },
      { text: "Using pointers in programming", isCorrect: false },
      { text: "Database indexing", isCorrect: false },
      { text: "File compression", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "IDOR occurs when applications expose internal object references (IDs) without verifying user authorization to access them.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "How can attackers exploit IDOR vulnerabilities?",
    choices: [
      { text: "By changing ID parameters in URLs to access other users' data", isCorrect: true },
      { text: "Through physical access only", isCorrect: false },
      { text: "By using strong passwords", isCorrect: false },
      { text: "IDOR cannot be exploited", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Attackers modify IDs in requests (e.g., user_id=123 to user_id=124) to view or modify unauthorized records.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is privilege escalation?",
    choices: [
      { text: "Gaining higher access rights than authorized", isCorrect: true },
      { text: "Using elevators", isCorrect: false },
      { text: "Increasing system speed", isCorrect: false },
      { text: "Network optimization", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Privilege escalation allows regular users to gain admin rights through access control flaws or exploitation.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is horizontal privilege escalation?",
    choices: [
      { text: "Accessing resources of users at the same privilege level", isCorrect: true },
      { text: "Becoming an administrator", isCorrect: false },
      { text: "Lateral network movement", isCorrect: false },
      { text: "Horizontal scaling", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Horizontal escalation lets attackers access other users' data without gaining higher privileges (e.g., viewing another customer's orders).",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is vertical privilege escalation?",
    choices: [
      { text: "Gaining higher-level privileges like admin access", isCorrect: true },
      { text: "Accessing peer user data", isCorrect: false },
      { text: "Vertical network topology", isCorrect: false },
      { text: "Vertical scaling", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Vertical escalation elevates user privileges from regular user to admin, enabling system-wide control.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "How do you prevent access control vulnerabilities?",
    choices: [
      { text: "Implement server-side access checks for every request", isCorrect: true },
      { text: "Use client-side validation only", isCorrect: false },
      { text: "Hide buttons in the UI", isCorrect: false },
      { text: "Prevention is impossible", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Server-side authorization checks verify user permissions for each resource access, not relying on client-side controls.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is the principle of deny by default?",
    choices: [
      { text: "Deny all access unless explicitly permitted", isCorrect: true },
      { text: "Allow everything by default", isCorrect: false },
      { text: "Never deny anything", isCorrect: false },
      { text: "Random access decisions", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Deny by default requires explicit permission grants, reducing risk from forgotten or misconfigured access controls.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What makes injection attacks so dangerous?",
    choices: [
      { text: "They can lead to complete data compromise and system takeover", isCorrect: true },
      { text: "They are harmless", isCorrect: false },
      { text: "They only affect old systems", isCorrect: false },
      { text: "They cannot be exploited", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Successful injection can expose entire databases, execute OS commands, or compromise server infrastructure.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is command injection?",
    choices: [
      { text: "Executing arbitrary OS commands through vulnerable inputs", isCorrect: true },
      { text: "Terminal commands only", isCorrect: false },
      { text: "SQL queries", isCorrect: false },
      { text: "User instructions", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Command injection allows attackers to run system commands, potentially taking complete control of servers.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is LDAP injection?",
    choices: [
      { text: "Injecting malicious LDAP statements to manipulate directory queries", isCorrect: true },
      { text: "A network protocol", isCorrect: false },
      { text: "Database backup method", isCorrect: false },
      { text: "Encryption technique", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "LDAP injection exploits applications constructing LDAP queries from user input, potentially exposing directory information.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "Why should you never store passwords in plain text?",
    choices: [
      { text: "Database breaches would immediately expose all credentials", isCorrect: true },
      { text: "Plain text uses more storage", isCorrect: false },
      { text: "It's acceptable for small applications", isCorrect: false },
      { text: "Encryption is unnecessary", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Storing passwords in plain text means any data breach instantly compromises all user accounts across potentially multiple sites.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is password hashing?",
    choices: [
      { text: "Converting passwords into irreversible cryptographic values", isCorrect: true },
      { text: "Encrypting passwords with keys", isCorrect: false },
      { text: "Storing passwords as-is", isCorrect: false },
      { text: "Creating password hints", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Hashing transforms passwords into fixed-length values that cannot be reversed, protecting credentials even if databases leak.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is salting in password security?",
    choices: [
      { text: "Adding random data to passwords before hashing", isCorrect: true },
      { text: "Adding salt to food", isCorrect: false },
      { text: "Password complexity rules", isCorrect: false },
      { text: "Encrypting hashes", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Salts prevent rainbow table attacks by ensuring identical passwords produce different hashes.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is a rainbow table attack?",
    choices: [
      { text: "Using precomputed hashes to crack passwords", isCorrect: true },
      { text: "Weather-based attack", isCorrect: false },
      { text: "Colorful visualization", isCorrect: false },
      { text: "Network flood attack", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Rainbow tables contain precomputed hashes of common passwords, making unsalted password cracking faster.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is credential stuffing?",
    choices: [
      { text: "Using leaked credentials from one site to access other sites", isCorrect: true },
      { text: "Creating many accounts", isCorrect: false },
      { text: "Brute force attacks", isCorrect: false },
      { text: "Password managers", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Credential stuffing exploits password reuse by testing breached credentials across multiple services.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is account enumeration?",
    choices: [
      { text: "Discovering valid usernames through system responses", isCorrect: true },
      { text: "Counting user accounts", isCorrect: false },
      { text: "Listing file numbers", isCorrect: false },
      { text: "Database indexing", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Different error messages for valid vs. invalid usernames allow attackers to identify legitimate accounts for targeted attacks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 3,
    question: "What is the impact of OWASP Top 10 vulnerabilities?",
    choices: [
      { text: "Data breaches, financial loss, reputation damage, and regulatory penalties", isCorrect: true },
      { text: "No real impact", isCorrect: false },
      { text: "Only minor inconveniences", isCorrect: false },
      { text: "Positive effects", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "These common vulnerabilities cause billions in damages annually through breaches, ransomware, fraud, and business disruption.",
    points: 100
  }
];

// Web Security Lesson 4: OWASP Top 10 Part 2 - A6-A10 (30 questions)
const webSecurityLesson4Questions = [
  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is security misconfiguration (OWASP A6)?",
    choices: [
      { text: "Insecure default settings, incomplete setups, or exposed error messages", isCorrect: true },
      { text: "Perfectly configured systems", isCorrect: false },
      { text: "Hardware failures", isCorrect: false },
      { text: "User preferences", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Misconfigurations include default credentials, unnecessary services, directory listings, and verbose errors revealing system details.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What dangers do default credentials pose?",
    choices: [
      { text: "Attackers can easily gain access using well-known default passwords", isCorrect: true },
      { text: "They improve security", isCorrect: false },
      { text: "No danger exists", isCorrect: false },
      { text: "They prevent attacks", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Default admin/admin, root/root, or similar credentials are publicly known and frequently exploited.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What information can verbose error messages leak?",
    choices: [
      { text: "System paths, database structure, software versions, and internal architecture", isCorrect: true },
      { text: "Only error codes", isCorrect: false },
      { text: "Nothing useful", isCorrect: false },
      { text: "User preferences", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Detailed errors reveal attack surfaces, helping attackers craft targeted exploits.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is Cross-Site Scripting (XSS) - OWASP A7?",
    choices: [
      { text: "Injecting malicious scripts into web pages viewed by other users", isCorrect: true },
      { text: "Legitimate JavaScript", isCorrect: false },
      { text: "CSS styling", isCorrect: false },
      { text: "Server-side code", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "XSS allows attackers to execute JavaScript in victims' browsers, stealing data or hijacking sessions.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is reflected XSS?",
    choices: [
      { text: "Malicious script reflected from web server in immediate response", isCorrect: true },
      { text: "Permanently stored scripts", isCorrect: false },
      { text: "Light reflection", isCorrect: false },
      { text: "Database queries", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Reflected XSS occurs when malicious input is immediately echoed back in responses (e.g., search results).",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is stored XSS?",
    choices: [
      { text: "Malicious scripts permanently stored on servers and executed when viewed", isCorrect: true },
      { text: "Temporary cache", isCorrect: false },
      { text: "Backup files", isCorrect: false },
      { text: "Cookie storage", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Stored XSS persists in databases (comments, posts) and executes whenever users view the infected content.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is DOM-based XSS?",
    choices: [
      { text: "Client-side script manipulation without server involvement", isCorrect: true },
      { text: "Server-side attacks", isCorrect: false },
      { text: "Database attacks", isCorrect: false },
      { text: "Network attacks", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "DOM XSS occurs entirely in the browser when JavaScript modifies the DOM using unsafe data sources.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "How can you prevent XSS attacks?",
    choices: [
      { text: "Encode output, validate input, and use Content Security Policy", isCorrect: true },
      { text: "Disable JavaScript entirely", isCorrect: false },
      { text: "Never accept user input", isCorrect: false },
      { text: "XSS cannot be prevented", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Output encoding escapes special characters, preventing scripts from executing. CSP restricts script sources.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is Content Security Policy (CSP)?",
    choices: [
      { text: "HTTP header defining allowed sources for scripts and resources", isCorrect: true },
      { text: "Privacy policy document", isCorrect: false },
      { text: "Content management system", isCorrect: false },
      { text: "Firewall rule", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "CSP whitelists trusted sources for scripts, styles, and other resources, blocking inline and untrusted code.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is insecure deserialization (OWASP A8)?",
    choices: [
      { text: "Exploiting flaws when converting serialized data back to objects", isCorrect: true },
      { text: "Safe data conversion", isCorrect: false },
      { text: "File compression", isCorrect: false },
      { text: "Database normalization", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Insecure deserialization can lead to remote code execution, injection, or privilege escalation when processing untrusted serialized data.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is serialization?",
    choices: [
      { text: "Converting objects into a format for storage or transmission", isCorrect: true },
      { text: "TV show episodes", isCorrect: false },
      { text: "Product serial numbers", isCorrect: false },
      { text: "Network protocols", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Serialization transforms complex data structures into byte streams (JSON, XML, binary) for saving or sending.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is using components with known vulnerabilities (OWASP A9)?",
    choices: [
      { text: "Using outdated libraries and frameworks with public exploits", isCorrect: true },
      { text: "Using latest software", isCorrect: false },
      { text: "Custom-built components", isCorrect: false },
      { text: "Secure dependencies", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Vulnerable components like outdated frameworks, libraries, or plugins can be exploited using publicly available attack tools.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "Why are third-party components risky?",
    choices: [
      { text: "They may contain vulnerabilities and increase attack surface", isCorrect: true },
      { text: "They are always malicious", isCorrect: false },
      { text: "They cost money", isCorrect: false },
      { text: "They have no risks", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Dependencies introduce code you don't control; vulnerabilities in them affect your application.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "How do you manage component vulnerabilities?",
    choices: [
      { text: "Inventory dependencies, monitor for CVEs, and apply updates promptly", isCorrect: true },
      { text: "Never update anything", isCorrect: false },
      { text: "Ignore security advisories", isCorrect: false },
      { text: "Use only custom code", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Dependency scanning tools, security advisories, and timely patching reduce risk from vulnerable components.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is insufficient logging and monitoring (OWASP A10)?",
    choices: [
      { text: "Inadequate detection and response to security events", isCorrect: true },
      { text: "Too much logging", isCorrect: false },
      { text: "Perfect monitoring", isCorrect: false },
      { text: "Automated backups", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Without proper logging and monitoring, breaches go undetected for months, allowing extensive damage.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What should security logs include?",
    choices: [
      { text: "Login attempts, access control failures, input validation errors, timestamps", isCorrect: true },
      { text: "Only successful actions", isCorrect: false },
      { text: "User passwords", isCorrect: false },
      { text: "Nothing sensitive", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Comprehensive logs capture security-relevant events enabling detection, investigation, and incident response.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is a SIEM system?",
    choices: [
      { text: "Security Information and Event Management - centralized log analysis", isCorrect: true },
      { text: "Email system", isCorrect: false },
      { text: "Database backup", isCorrect: false },
      { text: "Web server", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "SIEM aggregates, correlates, and analyzes logs from multiple sources to detect threats and support compliance.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is an indicator of compromise (IOC)?",
    choices: [
      { text: "Evidence that a system has been breached", isCorrect: true },
      { text: "Normal system behavior", isCorrect: false },
      { text: "User productivity metric", isCorrect: false },
      { text: "Software license", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "IOCs include unusual logins, file modifications, network connections, or processes indicating security incidents.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is CSRF (Cross-Site Request Forgery)?",
    choices: [
      { text: "Tricking users into performing unwanted actions while authenticated", isCorrect: true },
      { text: "SQL injection variant", isCorrect: false },
      { text: "Password attack", isCorrect: false },
      { text: "Firewall bypass", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "CSRF exploits user trust in websites to perform unauthorized actions (transfers, settings changes) using their credentials.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "How can you prevent CSRF attacks?",
    choices: [
      { text: "Use anti-CSRF tokens and verify request origins", isCorrect: true },
      { text: "Disable all forms", isCorrect: false },
      { text: "Never use cookies", isCorrect: false },
      { text: "CSRF cannot be prevented", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "CSRF tokens are unique per session/request, preventing attackers from forging valid requests.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is clickjacking?",
    choices: [
      { text: "Tricking users into clicking hidden malicious elements", isCorrect: true },
      { text: "Fast clicking technique", isCorrect: false },
      { text: "Mouse malfunction", isCorrect: false },
      { text: "Advertisement blocking", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Clickjacking uses transparent iframes to overlay malicious content over legitimate pages, hijacking clicks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What HTTP header prevents clickjacking?",
    choices: [
      { text: "X-Frame-Options or Content-Security-Policy frame-ancestors", isCorrect: true },
      { text: "Content-Type", isCorrect: false },
      { text: "Accept-Language", isCorrect: false },
      { text: "User-Agent", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "X-Frame-Options: DENY prevents your site from being framed, blocking clickjacking attacks.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is Server-Side Request Forgery (SSRF)?",
    choices: [
      { text: "Forcing servers to make requests to unintended destinations", isCorrect: true },
      { text: "Client-side attacks", isCorrect: false },
      { text: "Database queries", isCorrect: false },
      { text: "Email spoofing", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "SSRF tricks servers into accessing internal resources or external systems, bypassing firewalls and access controls.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is open redirect vulnerability?",
    choices: [
      { text: "Redirecting users to malicious sites via trusted domains", isCorrect: true },
      { text: "Public website access", isCorrect: false },
      { text: "Fast page loading", isCorrect: false },
      { text: "SEO technique", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Unvalidated redirects let attackers send victims from legitimate sites to phishing pages, exploiting trust.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is file upload vulnerability?",
    choices: [
      { text: "Uploading malicious files to execute code or access sensitive data", isCorrect: true },
      { text: "Normal file sharing", isCorrect: false },
      { text: "Cloud storage", isCorrect: false },
      { text: "Email attachments", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Unrestricted file uploads enable attackers to upload web shells, malware, or overwrite critical files.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "How should file uploads be secured?",
    choices: [
      { text: "Validate type/size, rename files, scan for malware, store outside webroot", isCorrect: true },
      { text: "Accept any file type", isCorrect: false },
      { text: "Store in public directories", isCorrect: false },
      { text: "Never allow uploads", isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: "Multiple layers (validation, sandboxing, scanning, isolation) prevent malicious file execution.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is directory traversal?",
    choices: [
      { text: "Accessing files outside intended directories using path manipulation", isCorrect: true },
      { text: "Browsing website folders normally", isCorrect: false },
      { text: "Database navigation", isCorrect: false },
      { text: "Menu navigation", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Path traversal uses ../ sequences to escape directories and access sensitive files like /etc/passwd.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is security through obscurity?",
    choices: [
      { text: "Relying on secrecy rather than strong security measures", isCorrect: true },
      { text: "Effective security strategy", isCorrect: false },
      { text: "Encryption standard", isCorrect: false },
      { text: "Best practice approach", isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: "Security through obscurity (hiding implementations) is weak; assume attackers know your system and use strong controls.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is defense in depth?",
    choices: [
      { text: "Layering multiple independent security controls", isCorrect: true },
      { text: "Single strong firewall", isCorrect: false },
      { text: "Physical security only", isCorrect: false },
      { text: "Passwords alone", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Multiple overlapping defenses ensure that if one fails, others still provide protection.",
    points: 100
  },

  {
    module: 'web-security',
    lessonNumber: 4,
    question: "What is the key takeaway from OWASP Top 10?",
    choices: [
      { text: "Common vulnerabilities are preventable with proper security practices", isCorrect: true },
      { text: "Security is impossible", isCorrect: false },
      { text: "Only large companies need security", isCorrect: false },
      { text: "Attacks are unavoidable", isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: "Following secure development practices, testing, and staying updated prevents most common web vulnerabilities.",
    points: 100
  }
];

// ========================================
// NETWORK DEFENSE MODULE (120 questions)
// ========================================

// Network Defense Lesson 1: OSI Model & Network Fundamentals (30 questions)
const networkDefenseLesson1Questions = [
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does OSI stand for?',
    choices: [
      { text: 'Open Systems Interconnection', isCorrect: true },
      { text: 'Operating System Interface', isCorrect: false },
      { text: 'Optical Signal Integration', isCorrect: false },
      { text: 'Online Security Infrastructure', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'OSI (Open Systems Interconnection) is a conceptual model that standardizes network communication functions.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'How many layers does the OSI model have?',
    choices: [
      { text: '7 layers', isCorrect: true },
      { text: '5 layers', isCorrect: false },
      { text: '4 layers', isCorrect: false },
      { text: '9 layers', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is Layer 1 of the OSI model?',
    choices: [
      { text: 'Physical Layer - deals with cables, voltages, and bits', isCorrect: true },
      { text: 'Application Layer', isCorrect: false },
      { text: 'Network Layer', isCorrect: false },
      { text: 'Transport Layer', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The Physical Layer (Layer 1) handles the physical transmission of raw bits over network cables or wireless signals.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the primary function of Layer 2 (Data Link)?',
    choices: [
      { text: 'Frame creation, MAC addressing, and error detection', isCorrect: true },
      { text: 'IP addressing and routing', isCorrect: false },
      { text: 'User application interfaces', isCorrect: false },
      { text: 'Physical signal transmission', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Data Link Layer organizes bits into frames, uses MAC addresses, and provides error detection for local network transmission.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does MAC stand for in MAC address?',
    choices: [
      { text: 'Media Access Control', isCorrect: true },
      { text: 'Macintosh Computer', isCorrect: false },
      { text: 'Maximum Address Count', isCorrect: false },
      { text: 'Mandatory Access Code', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'MAC (Media Access Control) addresses are unique hardware identifiers assigned to network interface cards.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Which layer handles IP addressing and routing?',
    choices: [
      { text: 'Network Layer (Layer 3)', isCorrect: true },
      { text: 'Transport Layer (Layer 4)', isCorrect: false },
      { text: 'Data Link Layer (Layer 2)', isCorrect: false },
      { text: 'Application Layer (Layer 7)', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Network Layer (Layer 3) handles logical addressing (IP), routing, and path determination across networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What protocols operate at Layer 4 (Transport)?',
    choices: [
      { text: 'TCP and UDP', isCorrect: true },
      { text: 'IP and ICMP', isCorrect: false },
      { text: 'HTTP and FTP', isCorrect: false },
      { text: 'ARP and RARP', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TCP and UDP are Layer 4 protocols responsible for end-to-end communication, port numbers, and data segmentation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the difference between TCP and UDP?',
    choices: [
      { text: 'TCP is connection-oriented and reliable; UDP is connectionless and faster', isCorrect: true },
      { text: 'UDP is more secure than TCP', isCorrect: false },
      { text: 'TCP is faster than UDP', isCorrect: false },
      { text: 'They are the same protocol', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TCP provides reliable, ordered delivery with error checking, while UDP offers faster, connectionless transmission without guarantees.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a port number used for?',
    choices: [
      { text: 'To identify specific applications or services on a device', isCorrect: true },
      { text: 'To identify physical network ports', isCorrect: false },
      { text: 'To encrypt network traffic', isCorrect: false },
      { text: 'To assign IP addresses', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Port numbers (0-65535) identify specific services, allowing multiple applications to use the network simultaneously.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Which layer do HTTP, FTP, and SMTP operate on?',
    choices: [
      { text: 'Application Layer (Layer 7)', isCorrect: true },
      { text: 'Transport Layer (Layer 4)', isCorrect: false },
      { text: 'Network Layer (Layer 3)', isCorrect: false },
      { text: 'Session Layer (Layer 5)', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'HTTP, FTP, and SMTP are Application Layer protocols that provide services directly to users.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is an IP address?',
    choices: [
      { text: 'A logical address identifying a device on a network', isCorrect: true },
      { text: 'A physical hardware identifier', isCorrect: false },
      { text: 'An encryption key', isCorrect: false },
      { text: 'A port number', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'IP addresses are numerical labels that identify devices on IP networks, enabling routing and communication.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the difference between IPv4 and IPv6?',
    choices: [
      { text: 'IPv4 uses 32-bit addresses; IPv6 uses 128-bit addresses', isCorrect: true },
      { text: 'IPv6 is slower than IPv4', isCorrect: false },
      { text: 'IPv4 is more secure', isCorrect: false },
      { text: 'There is no difference', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IPv6 provides vastly more addresses (128-bit vs 32-bit), built-in security, and improved routing efficiency.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does DNS do?',
    choices: [
      { text: 'Translates domain names to IP addresses', isCorrect: true },
      { text: 'Encrypts network traffic', isCorrect: false },
      { text: 'Assigns IP addresses to devices', isCorrect: false },
      { text: 'Routes packets across networks', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'DNS (Domain Name System) converts human-readable domain names (like google.com) into IP addresses.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is DHCP used for?',
    choices: [
      { text: 'Automatically assigning IP addresses to devices', isCorrect: true },
      { text: 'Encrypting data', isCorrect: false },
      { text: 'Translating domain names', isCorrect: false },
      { text: 'Routing packets', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configurations to devices.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a subnet mask?',
    choices: [
      { text: 'Identifies which portion of an IP address is the network vs host', isCorrect: true },
      { text: 'A security encryption method', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'A network cable type', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Subnet masks divide IP addresses into network and host portions, enabling network segmentation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a default gateway?',
    choices: [
      { text: 'The router that connects a local network to external networks', isCorrect: true },
      { text: 'The first device on a network', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'The DNS server address', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The default gateway is the router that forwards traffic from the local network to destinations outside it.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What protocol does ping use?',
    choices: [
      { text: 'ICMP (Internet Control Message Protocol)', isCorrect: true },
      { text: 'TCP', isCorrect: false },
      { text: 'UDP', isCorrect: false },
      { text: 'HTTP', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Ping uses ICMP Echo Request and Echo Reply messages to test network connectivity and measure latency.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is ARP used for?',
    choices: [
      { text: 'Resolving IP addresses to MAC addresses', isCorrect: true },
      { text: 'Routing packets between networks', isCorrect: false },
      { text: 'Encrypting communications', isCorrect: false },
      { text: 'Assigning IP addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'ARP (Address Resolution Protocol) maps IP addresses to physical MAC addresses on local networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a switch in networking?',
    choices: [
      { text: 'A device that forwards frames based on MAC addresses within a LAN', isCorrect: true },
      { text: 'A device that routes packets between different networks', isCorrect: false },
      { text: 'A physical cable connector', isCorrect: false },
      { text: 'An encryption device', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Switches operate at Layer 2, learning MAC addresses and intelligently forwarding frames only to intended recipients.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a router?',
    choices: [
      { text: 'A device that forwards packets between different networks using IP addresses', isCorrect: true },
      { text: 'A device that connects devices within a single network', isCorrect: false },
      { text: 'A type of firewall only', isCorrect: false },
      { text: 'A wireless access point', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Routers operate at Layer 3, making forwarding decisions based on IP addresses to connect different networks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the Session Layer (Layer 5) responsible for?',
    choices: [
      { text: 'Establishing, maintaining, and terminating communication sessions', isCorrect: true },
      { text: 'Physical signal transmission', isCorrect: false },
      { text: 'Data encryption', isCorrect: false },
      { text: 'IP addressing', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Session Layer manages dialog control and synchronization between communicating applications.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does the Presentation Layer (Layer 6) handle?',
    choices: [
      { text: 'Data formatting, encryption, and compression', isCorrect: true },
      { text: 'Routing decisions', isCorrect: false },
      { text: 'Physical connections', isCorrect: false },
      { text: 'MAC addressing', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The Presentation Layer translates data between application and network formats, handling encryption and compression.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a broadcast address used for?',
    choices: [
      { text: 'Sending data to all devices on a network segment', isCorrect: true },
      { text: 'Routing to the internet', isCorrect: false },
      { text: 'Encrypting communications', isCorrect: false },
      { text: 'DNS lookup', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Broadcast addresses allow sending packets to all hosts on a subnet simultaneously.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is NAT (Network Address Translation)?',
    choices: [
      { text: 'Translating private IP addresses to public ones for internet access', isCorrect: true },
      { text: 'Encrypting network traffic', isCorrect: false },
      { text: 'Resolving domain names', isCorrect: false },
      { text: 'Assigning MAC addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NAT allows multiple devices with private IPs to share a single public IP for internet connectivity.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is the loopback address in IPv4?',
    choices: [
      { text: '127.0.0.1', isCorrect: true },
      { text: '192.168.0.1', isCorrect: false },
      { text: '0.0.0.0', isCorrect: false },
      { text: '255.255.255.255', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The loopback address (127.0.0.1) refers to the local machine itself, used for testing network software.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What are private IP address ranges used for?',
    choices: [
      { text: 'Internal networks that don\'t directly connect to the internet', isCorrect: true },
      { text: 'Public internet servers only', isCorrect: false },
      { text: 'Encryption keys', isCorrect: false },
      { text: 'DNS servers', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Private IPs (10.x.x.x, 172.16-31.x.x, 192.168.x.x) are used internally and require NAT for internet access.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is encapsulation in networking?',
    choices: [
      { text: 'Wrapping data with protocol headers as it moves down the OSI layers', isCorrect: true },
      { text: 'Encrypting all network traffic', isCorrect: false },
      { text: 'Compressing data packets', isCorrect: false },
      { text: 'Physical cable shielding', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Encapsulation adds headers (and trailers) at each OSI layer, packaging data for transmission.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What is a VLAN?',
    choices: [
      { text: 'Virtual LAN that logically segments networks on the same physical infrastructure', isCorrect: true },
      { text: 'A type of VPN', isCorrect: false },
      { text: 'A wireless network', isCorrect: false },
      { text: 'A firewall rule', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'VLANs create logical network separations on switches, improving security and traffic management.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'What does TTL stand for in IP packets?',
    choices: [
      { text: 'Time To Live - prevents packets from circulating indefinitely', isCorrect: true },
      { text: 'Total Transmission Length', isCorrect: false },
      { text: 'Temporary Transport Layer', isCorrect: false },
      { text: 'Trusted Transfer Link', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'TTL is decremented at each router hop; when it reaches zero, the packet is discarded to prevent routing loops.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 1,
    question: 'Why is understanding the OSI model important for network security?',
    choices: [
      { text: 'It helps identify where attacks occur and where to apply defenses', isCorrect: true },
      { text: 'It encrypts all network traffic', isCorrect: false },
      { text: 'It prevents all cyberattacks', isCorrect: false },
      { text: 'It\'s not important for security', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Understanding each layer helps security professionals identify attack vectors and implement appropriate countermeasures.',
    points: 100
  }
];

// Network Defense Lesson 2: Common Network Threats (30 questions)
const networkDefenseLesson2Questions = [
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What does DDoS stand for?',
    choices: [
      { text: 'Distributed Denial of Service', isCorrect: true },
      { text: 'Direct Data over System', isCorrect: false },
      { text: 'Decentralized Disk Operating System', isCorrect: false },
      { text: 'Dynamic Domain Security', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'DDoS attacks overwhelm systems with traffic from multiple sources, making services unavailable.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a Man-in-the-Middle (MITM) attack?',
    choices: [
      { text: 'An attacker intercepts communication between two parties', isCorrect: true },
      { text: 'A virus that spreads through email', isCorrect: false },
      { text: 'A firewall configuration error', isCorrect: false },
      { text: 'A password cracking technique', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'MITM attacks allow attackers to eavesdrop or alter communications between two parties who believe they are communicating directly.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is ARP spoofing?',
    choices: [
      { text: 'Sending fake ARP messages to associate attacker\'s MAC with another IP', isCorrect: true },
      { text: 'Creating fake email addresses', isCorrect: false },
      { text: 'Spoofing DNS records', isCorrect: false },
      { text: 'Faking wireless access points', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'ARP spoofing allows attackers to intercept network traffic by associating their MAC address with another device\'s IP address.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is DNS poisoning?',
    choices: [
      { text: 'Corrupting DNS cache to redirect users to malicious sites', isCorrect: true },
      { text: 'Deleting DNS records', isCorrect: false },
      { text: 'Overloading DNS servers', isCorrect: false },
      { text: 'Encrypting DNS queries', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'DNS poisoning corrupts the DNS cache, causing users to be redirected to fraudulent websites.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is packet sniffing?',
    choices: [
      { text: 'Capturing and analyzing network traffic', isCorrect: true },
      { text: 'Blocking network packets', isCorrect: false },
      { text: 'Encrypting packets', isCorrect: false },
      { text: 'Routing packets', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Packet sniffing involves capturing network packets to analyze data, which can be used maliciously to steal information.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'How can you protect against packet sniffing?',
    choices: [
      { text: 'Use encryption (HTTPS, VPN, TLS)', isCorrect: true },
      { text: 'Use longer passwords', isCorrect: false },
      { text: 'Install antivirus software', isCorrect: false },
      { text: 'Disable JavaScript', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Encryption protects data even if packets are sniffed, making captured data unreadable to attackers.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is port scanning?',
    choices: [
      { text: 'Probing a system to find open ports and services', isCorrect: true },
      { text: 'Closing all network ports', isCorrect: false },
      { text: 'Encrypting port communications', isCorrect: false },
      { text: 'Assigning port numbers', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Port scanning is a reconnaissance technique attackers use to identify open ports and potential vulnerabilities.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What tool is commonly used for port scanning?',
    choices: [
      { text: 'Nmap', isCorrect: true },
      { text: 'Microsoft Word', isCorrect: false },
      { text: 'Photoshop', isCorrect: false },
      { text: 'Excel', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Nmap (Network Mapper) is a popular open-source tool for network discovery and security auditing.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a rogue access point?',
    choices: [
      { text: 'An unauthorized wireless access point on a network', isCorrect: true },
      { text: 'A broken router', isCorrect: false },
      { text: 'A firewall misconfiguration', isCorrect: false },
      { text: 'A legitimate guest network', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Rogue access points can be installed by attackers or employees, bypassing network security controls.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is an IP spoofing attack?',
    choices: [
      { text: 'Creating packets with a false source IP address', isCorrect: true },
      { text: 'Stealing IP addresses from DHCP', isCorrect: false },
      { text: 'Using private IP addresses', isCorrect: false },
      { text: 'Blocking IP traffic', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IP spoofing involves forging the source IP address in packets to hide the attacker\'s identity or impersonate another system.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a SYN flood attack?',
    choices: [
      { text: 'A DDoS attack that exploits TCP three-way handshake', isCorrect: true },
      { text: 'Flooding a network with UDP packets', isCorrect: false },
      { text: 'Sending too many emails', isCorrect: false },
      { text: 'DNS amplification', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'SYN flood attacks send numerous SYN requests without completing the handshake, exhausting server resources.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a Smurf attack?',
    choices: [
      { text: 'A DDoS attack using ICMP broadcasts with spoofed source IP', isCorrect: true },
      { text: 'A virus that affects small networks', isCorrect: false },
      { text: 'A phishing campaign', isCorrect: false },
      { text: 'A password attack', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Smurf attacks send ICMP echo requests to broadcast addresses with the victim\'s spoofed IP, causing amplified responses to flood the target.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'How does a ping of death attack work?',
    choices: [
      { text: 'Sending malformed or oversized ICMP packets to crash systems', isCorrect: true },
      { text: 'Sending too many normal pings', isCorrect: false },
      { text: 'Blocking ping responses', isCorrect: false },
      { text: 'Encrypting ping packets', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Ping of death attacks exploit vulnerabilities in handling oversized ICMP packets, causing system crashes or instability.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is session hijacking?',
    choices: [
      { text: 'Taking over an active session between a client and server', isCorrect: true },
      { text: 'Stealing passwords', isCorrect: false },
      { text: 'Blocking network sessions', isCorrect: false },
      { text: 'Creating fake user accounts', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Session hijacking involves stealing or predicting session tokens to impersonate legitimate users.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a botnet?',
    choices: [
      { text: 'A network of compromised computers controlled by an attacker', isCorrect: true },
      { text: 'A legitimate network of servers', isCorrect: false },
      { text: 'An antivirus program', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Botnets consist of infected devices (bots/zombies) that attackers control remotely, often used for DDoS attacks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a zero-day vulnerability?',
    choices: [
      { text: 'A vulnerability unknown to the vendor with no available patch', isCorrect: true },
      { text: 'A vulnerability that lasts only one day', isCorrect: false },
      { text: 'A completely harmless bug', isCorrect: false },
      { text: 'A vulnerability in calendar software', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Zero-day vulnerabilities are especially dangerous because no fix exists when they are discovered and exploited.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a replay attack?',
    choices: [
      { text: 'Capturing and retransmitting valid data to gain unauthorized access', isCorrect: true },
      { text: 'Replaying video files', isCorrect: false },
      { text: 'Backing up network data', isCorrect: false },
      { text: 'Restoring deleted files', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Replay attacks intercept legitimate authentication data and resend it to impersonate authorized users.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is MAC flooding?',
    choices: [
      { text: 'Overwhelming a switch\'s MAC address table to cause it to broadcast traffic', isCorrect: true },
      { text: 'Changing all MAC addresses on a network', isCorrect: false },
      { text: 'Flooding with email attachments', isCorrect: false },
      { text: 'Filling up hard drive space', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'MAC flooding attacks fill the switch\'s MAC table, forcing it into hub mode and allowing packet sniffing.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is DNS amplification?',
    choices: [
      { text: 'A DDoS attack that exploits DNS servers to amplify traffic to a target', isCorrect: true },
      { text: 'Making DNS servers faster', isCorrect: false },
      { text: 'Adding more DNS records', isCorrect: false },
      { text: 'Encrypting DNS queries', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'DNS amplification attacks send small queries with spoofed source IPs, causing large responses to flood the victim.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a watering hole attack?',
    choices: [
      { text: 'Compromising websites frequently visited by target users', isCorrect: true },
      { text: 'Attacking water treatment facilities', isCorrect: false },
      { text: 'Phishing via social media', isCorrect: false },
      { text: 'Physical surveillance', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Watering hole attacks infect websites that target users commonly visit, spreading malware when they visit.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is VLAN hopping?',
    choices: [
      { text: 'Exploiting misconfigurations to access unauthorized VLANs', isCorrect: true },
      { text: 'Moving devices between VLANs legitimately', isCorrect: false },
      { text: 'Creating new VLANs', isCorrect: false },
      { text: 'Deleting VLAN configurations', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'VLAN hopping attacks exploit switch configurations to send traffic to VLANs the attacker shouldn\'t access.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is evil twin attack?',
    choices: [
      { text: 'Creating a fake wireless access point with the same SSID as legitimate one', isCorrect: true },
      { text: 'Hacking identical twin computers', isCorrect: false },
      { text: 'Duplicating hard drives', isCorrect: false },
      { text: 'Cloning MAC addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Evil twin attacks trick users into connecting to a malicious AP that looks identical to a trusted network.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is a land attack?',
    choices: [
      { text: 'Sending packets with same source and destination IP/port causing a loop', isCorrect: true },
      { text: 'Physical network cable damage', isCorrect: false },
      { text: 'Attacking from land-based locations', isCorrect: false },
      { text: 'Grounding electrical systems', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Land attacks create a loop by sending packets where source and destination are identical, potentially crashing systems.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is BlueBorne?',
    choices: [
      { text: 'A collection of Bluetooth vulnerabilities allowing device takeover', isCorrect: true },
      { text: 'A blue-colored network cable', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'A wireless encryption protocol', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'BlueBorne vulnerabilities allow attackers to take control of Bluetooth-enabled devices without user interaction.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is deauthentication attack in WiFi?',
    choices: [
      { text: 'Sending deauth frames to disconnect users from wireless networks', isCorrect: true },
      { text: 'Removing user authentication from servers', isCorrect: false },
      { text: 'Deleting user accounts', isCorrect: false },
      { text: 'Disabling password requirements', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Deauth attacks send spoofed deauthentication frames to disconnect clients, often used to capture handshakes for cracking.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is fragmentation attack?',
    choices: [
      { text: 'Exploiting the way systems reassemble fragmented packets', isCorrect: true },
      { text: 'Breaking hard drives into fragments', isCorrect: false },
      { text: 'Deleting file fragments', isCorrect: false },
      { text: 'Disk defragmentation', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Fragmentation attacks send malformed packet fragments to evade firewalls or crash systems during reassembly.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is BGP hijacking?',
    choices: [
      { text: 'Maliciously announcing incorrect BGP routes to redirect traffic', isCorrect: true },
      { text: 'Stealing router configurations', isCorrect: false },
      { text: 'Blocking gateway protocols', isCorrect: false },
      { text: 'Hijacking wireless signals', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'BGP hijacking manipulates Border Gateway Protocol announcements to redirect internet traffic through malicious routes.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'How can organizations protect against DDoS attacks?',
    choices: [
      { text: 'Use CDNs, rate limiting, traffic filtering, and DDoS protection services', isCorrect: true },
      { text: 'Only use antivirus software', isCorrect: false },
      { text: 'Disable all network services', isCorrect: false },
      { text: 'Use longer passwords', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'DDoS protection requires multiple strategies including traffic distribution, filtering, and specialized mitigation services.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'What is the primary goal of reconnaissance in network attacks?',
    choices: [
      { text: 'Gathering information about the target network and systems', isCorrect: true },
      { text: 'Destroying data immediately', isCorrect: false },
      { text: 'Installing backdoors', isCorrect: false },
      { text: 'Encrypting files', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Reconnaissance is the information gathering phase where attackers identify vulnerabilities and plan their attack strategy.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 2,
    question: 'Why are network threats constantly evolving?',
    choices: [
      { text: 'Attackers adapt to new defenses and discover new vulnerabilities', isCorrect: true },
      { text: 'Networks become slower over time', isCorrect: false },
      { text: 'Hardware degrades naturally', isCorrect: false },
      { text: 'Users forget passwords', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The cybersecurity landscape is an ongoing arms race where attackers continuously develop new techniques to bypass defenses.',
    points: 100
  }
];

// Network Defense Lesson 3: Firewalls and IDS/IPS (30 questions)
const networkDefenseLesson3Questions = [
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a firewall?',
    choices: [
      { text: 'A security device that monitors and controls network traffic based on rules', isCorrect: true },
      { text: 'A physical wall to protect servers', isCorrect: false },
      { text: 'An antivirus program', isCorrect: false },
      { text: 'A backup system', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Firewalls act as barriers between trusted internal networks and untrusted external networks, filtering traffic based on security rules.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What are the main types of firewalls?',
    choices: [
      { text: 'Packet-filtering, stateful, application-layer, and next-generation', isCorrect: true },
      { text: 'Only hardware firewalls', isCorrect: false },
      { text: 'Only software firewalls', isCorrect: false },
      { text: 'Windows and Mac firewalls', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Modern networks use different firewall types, each offering progressively more sophisticated inspection and control capabilities.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a packet-filtering firewall?',
    choices: [
      { text: 'Examines each packet independently based on IP, port, and protocol', isCorrect: true },
      { text: 'Filters packets by color', isCorrect: false },
      { text: 'Only inspects application data', isCorrect: false },
      { text: 'Blocks all packets', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Packet-filtering firewalls operate at Layers 3-4, making simple allow/deny decisions based on packet headers.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What advantage does a stateful firewall have over packet-filtering?',
    choices: [
      { text: 'Tracks the state of active connections for better security', isCorrect: true },
      { text: 'It\'s faster', isCorrect: false },
      { text: 'It\'s cheaper', isCorrect: false },
      { text: 'It requires no configuration', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Stateful firewalls remember connection states, allowing them to make intelligent decisions about packet legitimacy.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What does an application-layer firewall inspect?',
    choices: [
      { text: 'The actual application data and content (Layer 7)', isCorrect: true },
      { text: 'Only IP addresses', isCorrect: false },
      { text: 'Only physical connections', isCorrect: false },
      { text: 'Only MAC addresses', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Application-layer (proxy) firewalls can inspect HTTP, FTP, and other application protocols for threats.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is the difference between IDS and IPS?',
    choices: [
      { text: 'IDS detects and alerts; IPS detects and actively blocks threats', isCorrect: true },
      { text: 'They are the same thing', isCorrect: false },
      { text: 'IPS is slower than IDS', isCorrect: false },
      { text: 'IDS is more expensive', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IDS (Intrusion Detection System) monitors passively, while IPS (Intrusion Prevention System) actively prevents attacks.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is signature-based detection?',
    choices: [
      { text: 'Detecting threats by matching known attack patterns', isCorrect: true },
      { text: 'Requiring digital signatures for all packets', isCorrect: false },
      { text: 'Detecting handwritten signatures', isCorrect: false },
      { text: 'Encrypting all signatures', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Signature-based detection uses databases of known attack patterns, similar to antivirus signatures.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is anomaly-based detection?',
    choices: [
      { text: 'Detecting threats by identifying deviations from normal behavior', isCorrect: true },
      { text: 'Only detecting known threats', isCorrect: false },
      { text: 'Detecting grammatical errors', isCorrect: false },
      { text: 'Blocking all unusual packets', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Anomaly-based detection establishes a baseline of normal activity and alerts on deviations, catching unknown threats.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What advantage does anomaly-based detection have?',
    choices: [
      { text: 'Can detect new, unknown attacks (zero-day threats)', isCorrect: true },
      { text: 'Never has false positives', isCorrect: false },
      { text: 'Requires no training period', isCorrect: false },
      { text: 'Is faster than signature-based', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Anomaly detection can identify novel attacks that don\'t match any known signatures, though it may generate more false positives.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a DMZ in network security?',
    choices: [
      { text: 'Demilitarized Zone - a network segment between internal and external networks', isCorrect: true },
      { text: 'A type of malware', isCorrect: false },
      { text: 'A physical security zone', isCorrect: false },
      { text: 'An encryption method', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'A DMZ isolates public-facing servers from the internal network, adding a layer of protection.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'Why place web servers in a DMZ?',
    choices: [
      { text: 'Protects internal network if the web server is compromised', isCorrect: true },
      { text: 'Makes servers faster', isCorrect: false },
      { text: 'Reduces bandwidth costs', isCorrect: false },
      { text: 'Improves SEO rankings', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'DMZ placement ensures that even if internet-facing servers are hacked, attackers still face barriers to the internal network.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is network segmentation?',
    choices: [
      { text: 'Dividing a network into multiple isolated segments for security', isCorrect: true },
      { text: 'Cutting network cables', isCorrect: false },
      { text: 'Fragmenting packets', isCorrect: false },
      { text: 'Dividing bandwidth equally', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Segmentation limits lateral movement of attackers and contains breaches to specific network areas.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'How do VLANs improve security?',
    choices: [
      { text: 'Logically separate traffic between different user groups', isCorrect: true },
      { text: 'Encrypt all traffic automatically', isCorrect: false },
      { text: 'Increase network speed', isCorrect: false },
      { text: 'Reduce hardware costs', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'VLANs create logical network boundaries, preventing unauthorized access between departments or security zones.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is an implicit deny rule?',
    choices: [
      { text: 'Default rule that blocks all traffic not explicitly allowed', isCorrect: true },
      { text: 'A rule that denies specific IPs', isCorrect: false },
      { text: 'An encrypted firewall rule', isCorrect: false },
      { text: 'A temporary blocking rule', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Implicit deny follows the security principle of "deny by default, allow by exception" for stronger security.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is egress filtering?',
    choices: [
      { text: 'Filtering outbound traffic leaving the network', isCorrect: true },
      { text: 'Filtering only inbound traffic', isCorrect: false },
      { text: 'Filtering email attachments', isCorrect: false },
      { text: 'Blocking all external websites', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Egress filtering prevents malware from communicating with command servers and stops data exfiltration.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is ingress filtering?',
    choices: [
      { text: 'Filtering inbound traffic entering the network', isCorrect: true },
      { text: 'Filtering outbound traffic only', isCorrect: false },
      { text: 'Blocking internal communication', isCorrect: false },
      { text: 'Filtering physical access', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Ingress filtering blocks malicious traffic from entering the network, a fundamental security control.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a next-generation firewall (NGFW)?',
    choices: [
      { text: 'Advanced firewall with IPS, application awareness, and threat intelligence', isCorrect: true },
      { text: 'Just a faster traditional firewall', isCorrect: false },
      { text: 'A firewall for next-generation networks only', isCorrect: false },
      { text: 'A software-only firewall', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NGFWs combine traditional firewall functions with advanced features like deep packet inspection and integrated threat prevention.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a false positive in IDS/IPS?',
    choices: [
      { text: 'Legitimate traffic incorrectly identified as malicious', isCorrect: true },
      { text: 'An attack that goes undetected', isCorrect: false },
      { text: 'A system configuration error', isCorrect: false },
      { text: 'An encryption failure', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'False positives waste resources investigating benign activity; tuning IDS/IPS rules helps minimize them.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a false negative in IDS/IPS?',
    choices: [
      { text: 'An actual attack that goes undetected', isCorrect: true },
      { text: 'Legitimate traffic blocked incorrectly', isCorrect: false },
      { text: 'A system performance issue', isCorrect: false },
      { text: 'A configuration warning', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'False negatives are dangerous because real threats bypass security without detection.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'Where should IDS sensors be placed?',
    choices: [
      { text: 'At strategic points like network perimeter, DMZ, and critical segments', isCorrect: true },
      { text: 'Only at the internet gateway', isCorrect: false },
      { text: 'Only on end-user computers', isCorrect: false },
      { text: 'Randomly throughout the network', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Strategic placement ensures visibility into key network traffic flows and potential attack vectors.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is unified threat management (UTM)?',
    choices: [
      { text: 'Single device combining firewall, IPS, antivirus, and other security functions', isCorrect: true },
      { text: 'A cloud security service', isCorrect: false },
      { text: 'An employee training program', isCorrect: false },
      { text: 'A type of malware', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'UTM devices simplify security management by integrating multiple protective technologies in one platform.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is the purpose of firewall rules?',
    choices: [
      { text: 'Define what traffic is allowed or blocked based on criteria', isCorrect: true },
      { text: 'Encrypt all network traffic', isCorrect: false },
      { text: 'Increase network bandwidth', isCorrect: false },
      { text: 'Backup network configurations', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Firewall rules implement security policies by specifying permit/deny actions for traffic based on source, destination, port, and protocol.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is rule ordering in firewalls?',
    choices: [
      { text: 'Rules are evaluated top-to-bottom; first match wins', isCorrect: true },
      { text: 'All rules are evaluated simultaneously', isCorrect: false },
      { text: 'Rules are evaluated randomly', isCorrect: false },
      { text: 'Only the last rule matters', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Proper rule ordering is critical; more specific rules should come before general ones to ensure correct policy enforcement.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is stateful packet inspection (SPI)?',
    choices: [
      { text: 'Tracking connection states to validate packets belong to established sessions', isCorrect: true },
      { text: 'Inspecting each packet independently', isCorrect: false },
      { text: 'Only checking packet headers', isCorrect: false },
      { text: 'Encrypting packet contents', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'SPI maintains a state table of connections, allowing only packets from legitimate, established sessions.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is geo-blocking?',
    choices: [
      { text: 'Blocking traffic from specific countries or geographic regions', isCorrect: true },
      { text: 'Blocking GPS signals', isCorrect: false },
      { text: 'Blocking geological data', isCorrect: false },
      { text: 'Blocking geography websites', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Geo-blocking can reduce threats from regions where you have no legitimate business or known threat sources.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is deep packet inspection (DPI)?',
    choices: [
      { text: 'Examining the data payload of packets, not just headers', isCorrect: true },
      { text: 'Only inspecting IP headers', isCorrect: false },
      { text: 'Encrypting packet contents', isCorrect: false },
      { text: 'Compressing packet data', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'DPI analyzes packet contents to identify applications, detect malware, and enforce granular policies.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a host-based IDS (HIDS)?',
    choices: [
      { text: 'IDS that runs on individual hosts monitoring that system', isCorrect: true },
      { text: 'IDS that monitors network traffic', isCorrect: false },
      { text: 'IDS that monitors wireless networks', isCorrect: false },
      { text: 'IDS that monitors web applications', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'HIDS monitors system logs, file integrity, and host activities to detect compromises on specific machines.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is a network-based IDS (NIDS)?',
    choices: [
      { text: 'IDS that monitors network traffic at strategic points', isCorrect: true },
      { text: 'IDS that runs on individual computers', isCorrect: false },
      { text: 'IDS that only monitors wireless', isCorrect: false },
      { text: 'IDS that blocks all traffic', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NIDS analyzes network traffic flows to detect attacks, often placed at network borders or key segments.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'Why is firewall log analysis important?',
    choices: [
      { text: 'Identifies attack patterns, policy violations, and system issues', isCorrect: true },
      { text: 'It\'s not important', isCorrect: false },
      { text: 'Only required for compliance', isCorrect: false },
      { text: 'Just for backup purposes', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Log analysis reveals security incidents, helps tune rules, and provides audit trails for investigations.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 3,
    question: 'What is the benefit of defense in depth with firewalls and IDS/IPS?',
    choices: [
      { text: 'Multiple layers provide redundancy if one security control fails', isCorrect: true },
      { text: 'It makes networks slower', isCorrect: false },
      { text: 'It\'s more expensive with no benefit', isCorrect: false },
      { text: 'It complicates management unnecessarily', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Layered security ensures that if attackers bypass one control, others still protect the network.',
    points: 100
  }
];

// Network Defense Lesson 4: Network Monitoring & Incident Response (30 questions)
const networkDefenseLesson4Questions = [
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What does SIEM stand for?',
    choices: [
      { text: 'Security Information and Event Management', isCorrect: true },
      { text: 'System Integration and Error Monitoring', isCorrect: false },
      { text: 'Secure Internet Email Management', isCorrect: false },
      { text: 'Software Installation and Execution Manager', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SIEM systems collect, analyze, and correlate security events from multiple sources for threat detection.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is the primary function of a SIEM?',
    choices: [
      { text: 'Aggregate and correlate security logs from multiple sources', isCorrect: true },
      { text: 'Block all suspicious traffic', isCorrect: false },
      { text: 'Encrypt network communications', isCorrect: false },
      { text: 'Backup all system data', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'SIEMs provide centralized visibility by collecting logs and using correlation rules to identify security incidents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is log correlation?',
    choices: [
      { text: 'Analyzing relationships between events from different sources to identify patterns', isCorrect: true },
      { text: 'Deleting old log files', isCorrect: false },
      { text: 'Encrypting log data', isCorrect: false },
      { text: 'Backing up logs', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Correlation connects seemingly unrelated events to reveal coordinated attacks or security incidents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why is network traffic analysis important?',
    choices: [
      { text: 'Identifies anomalies, threats, and performance issues', isCorrect: true },
      { text: 'Only for billing purposes', isCorrect: false },
      { text: 'To slow down the network', isCorrect: false },
      { text: 'It has no security benefit', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Traffic analysis reveals malware communications, data exfiltration, and policy violations that other tools might miss.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is NetFlow?',
    choices: [
      { text: 'A protocol for collecting IP traffic flow information', isCorrect: true },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'An encryption standard', isCorrect: false },
      { text: 'A malware family', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'NetFlow captures metadata about network conversations (who, what, when, how much) without recording actual packet contents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is a security baseline?',
    choices: [
      { text: 'A snapshot of normal network behavior for comparison', isCorrect: true },
      { text: 'The minimum security requirements', isCorrect: false },
      { text: 'A type of firewall rule', isCorrect: false },
      { text: 'An encryption key', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Baselines establish "normal" so that deviations indicating attacks or issues can be quickly identified.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What are Indicators of Compromise (IOCs)?',
    choices: [
      { text: 'Artifacts that suggest a security breach has occurred', isCorrect: true },
      { text: 'Software vulnerabilities', isCorrect: false },
      { text: 'Network performance metrics', isCorrect: false },
      { text: 'User login credentials', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IOCs include malicious IPs, file hashes, domains, or behaviors that indicate compromise.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is incident response?',
    choices: [
      { text: 'Organized approach to addressing and managing security breaches', isCorrect: true },
      { text: 'Installing security software', isCorrect: false },
      { text: 'Regular system backups', isCorrect: false },
      { text: 'User security training', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Incident response follows a structured process to detect, contain, eradicate, and recover from security incidents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What are the main phases of incident response?',
    choices: [
      { text: 'Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned', isCorrect: true },
      { text: 'Install, Configure, Monitor, Delete', isCorrect: false },
      { text: 'Plan, Execute, Close', isCorrect: false },
      { text: 'Scan, Detect, Block', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'The six-phase incident response lifecycle ensures systematic handling of security incidents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why is containment important in incident response?',
    choices: [
      { text: 'Prevents the incident from spreading and causing more damage', isCorrect: true },
      { text: 'It\'s not important', isCorrect: false },
      { text: 'Only required for legal compliance', isCorrect: false },
      { text: 'It speeds up the network', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Quick containment limits damage, prevents lateral movement, and buys time for proper investigation and remediation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is network forensics?',
    choices: [
      { text: 'Capturing and analyzing network traffic to investigate security incidents', isCorrect: true },
      { text: 'Destroying evidence', isCorrect: false },
      { text: 'Encrypting all network data', isCorrect: false },
      { text: 'Upgrading network hardware', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Network forensics preserves evidence and reconstructs events for investigation and potential legal proceedings.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is chain of custody in forensics?',
    choices: [
      { text: 'Documented chronological record of evidence handling', isCorrect: true },
      { text: 'The order of network devices', isCorrect: false },
      { text: 'A list of users', isCorrect: false },
      { text: 'Backup procedures', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Chain of custody ensures evidence integrity and admissibility in legal proceedings by documenting all handling.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What tools are used for packet capture and analysis?',
    choices: [
      { text: 'Wireshark, tcpdump, and similar network protocol analyzers', isCorrect: true },
      { text: 'Microsoft Word and Excel', isCorrect: false },
      { text: 'Web browsers', isCorrect: false },
      { text: 'Email clients', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Protocol analyzers capture and decode network traffic for detailed inspection during investigations.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is threat intelligence?',
    choices: [
      { text: 'Information about current and emerging threats to inform security decisions', isCorrect: true },
      { text: 'Spying on users', isCorrect: false },
      { text: 'Marketing data', isCorrect: false },
      { text: 'Network speed measurements', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Threat intelligence provides context about adversaries, their tactics, and IOCs to improve defensive capabilities.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What are threat feeds?',
    choices: [
      { text: 'Continuously updated lists of malicious IPs, domains, and file hashes', isCorrect: true },
      { text: 'Social media posts', isCorrect: false },
      { text: 'News articles', isCorrect: false },
      { text: 'Network bandwidth statistics', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Threat feeds provide actionable intelligence to block known malicious indicators proactively.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is a Security Operations Center (SOC)?',
    choices: [
      { text: 'Centralized team that monitors and responds to security incidents', isCorrect: true },
      { text: 'A physical vault for servers', isCorrect: false },
      { text: 'An encryption standard', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'SOCs provide 24/7 monitoring, threat detection, and incident response capabilities.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is security orchestration and automation (SOAR)?',
    choices: [
      { text: 'Technology that automates repetitive security tasks and orchestrates responses', isCorrect: true },
      { text: 'A musical performance', isCorrect: false },
      { text: 'A type of malware', isCorrect: false },
      { text: 'An encryption method', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'SOAR platforms accelerate incident response by automating workflows and integrating security tools.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why create an incident response plan?',
    choices: [
      { text: 'Ensures organized, effective response reducing confusion during incidents', isCorrect: true },
      { text: 'Only required for compliance', isCorrect: false },
      { text: 'To slow down operations', isCorrect: false },
      { text: 'It\'s not necessary', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Pre-planned responses enable faster, more effective incident handling with clear roles and procedures.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is a playbook in security operations?',
    choices: [
      { text: 'Documented procedures for handling specific types of security incidents', isCorrect: true },
      { text: 'A book about network security', isCorrect: false },
      { text: 'User training manual', isCorrect: false },
      { text: 'Network diagram', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Playbooks provide step-by-step guidance for responding to common incidents, ensuring consistency and completeness.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What should be done during the eradication phase?',
    choices: [
      { text: 'Remove malware, close vulnerabilities, and eliminate attacker access', isCorrect: true },
      { text: 'Just reboot all systems', isCorrect: false },
      { text: 'Ignore the problem', isCorrect: false },
      { text: 'Only change passwords', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Eradication ensures threats are completely removed and attack vectors are closed to prevent reinfection.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is the recovery phase?',
    choices: [
      { text: 'Restoring systems to normal operation while monitoring for residual threats', isCorrect: true },
      { text: 'Just turning systems back on', isCorrect: false },
      { text: 'Deleting all data', isCorrect: false },
      { text: 'Ignoring the incident', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Recovery carefully returns systems to production with enhanced monitoring to detect any remaining attacker presence.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why conduct lessons learned sessions?',
    choices: [
      { text: 'Improve processes and prevent similar incidents in the future', isCorrect: true },
      { text: 'To blame individuals', isCorrect: false },
      { text: 'It\'s not necessary', isCorrect: false },
      { text: 'Only for documentation', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Post-incident reviews identify improvements to detection, response, and prevention capabilities.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is mean time to detect (MTTD)?',
    choices: [
      { text: 'Average time between when an incident occurs and when it\'s discovered', isCorrect: true },
      { text: 'Time to install security software', isCorrect: false },
      { text: 'Average uptime', isCorrect: false },
      { text: 'Network latency', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Lower MTTD indicates better monitoring and detection capabilities, reducing potential damage.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is mean time to respond (MTTR)?',
    choices: [
      { text: 'Average time between incident detection and complete resolution', isCorrect: true },
      { text: 'Network response time', isCorrect: false },
      { text: 'User response speed', isCorrect: false },
      { text: 'System boot time', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Lower MTTR minimizes damage by quickly containing and resolving security incidents.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is a war room in incident response?',
    choices: [
      { text: 'Dedicated space where incident response team coordinates during major incidents', isCorrect: true },
      { text: 'A military facility', isCorrect: false },
      { text: 'A conference room for regular meetings', isCorrect: false },
      { text: 'A server room', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'War rooms facilitate communication and coordination during crisis situations requiring rapid response.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is threat hunting?',
    choices: [
      { text: 'Proactively searching for threats that evaded automated defenses', isCorrect: true },
      { text: 'Waiting for alerts', isCorrect: false },
      { text: 'Hunting animals', isCorrect: false },
      { text: 'Deleting suspicious files', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Threat hunting uses hypothesis-driven investigations to find sophisticated threats hiding in the environment.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What information should be logged for security monitoring?',
    choices: [
      { text: 'Authentication attempts, network connections, file access, and system changes', isCorrect: true },
      { text: 'Only errors', isCorrect: false },
      { text: 'Nothing to preserve privacy', isCorrect: false },
      { text: 'Only successful logins', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Comprehensive logging captures evidence of both successful attacks and failed attempts for investigation.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why is time synchronization important for security monitoring?',
    choices: [
      { text: 'Enables accurate correlation of events across different systems', isCorrect: true },
      { text: 'It\'s not important', isCorrect: false },
      { text: 'Only for scheduling backups', isCorrect: false },
      { text: 'To set alarms', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Synchronized timestamps (via NTP) allow accurate sequencing of events during investigations.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'What is the benefit of security monitoring dashboards?',
    choices: [
      { text: 'Provide real-time visibility into security posture and key metrics', isCorrect: true },
      { text: 'They make networks slower', isCorrect: false },
      { text: 'Only for management presentations', isCorrect: false },
      { text: 'No actual benefit', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Dashboards enable quick identification of anomalies and trends, improving situational awareness.',
    points: 100
  },
  {
    module: 'network-defense',
    lessonNumber: 4,
    question: 'Why is continuous monitoring essential for network defense?',
    choices: [
      { text: 'Threats can occur at any time; constant vigilance is needed', isCorrect: true },
      { text: 'Periodic checks are sufficient', isCorrect: false },
      { text: 'Monitoring wastes resources', isCorrect: false },
      { text: 'Attacks only happen during business hours', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Continuous monitoring detects threats quickly, reducing dwell time and potential damage from attacks.',
    points: 100
  }
];

// ========================================
// MALWARE DEFENSE MODULE (120 questions)
// ========================================

// Malware Defense Lesson 1: What is Malware? (30 questions)
const malwareDefenseLesson1Questions = [
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What does the term "malware" mean?',
    choices: [
      { text: 'Malicious software designed to harm or exploit systems', isCorrect: true },
      { text: 'Software errors and bugs', isCorrect: false },
      { text: 'Legitimate security software', isCorrect: false },
      { text: 'Network protocols', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Malware is an umbrella term for any software intentionally designed to cause damage or unauthorized access.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a computer virus?',
    choices: [
      { text: 'Malware that attaches to files and spreads when files are executed', isCorrect: true },
      { text: 'A biological disease affecting computers', isCorrect: false },
      { text: 'A hardware malfunction', isCorrect: false },
      { text: 'An antivirus program', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Viruses replicate by inserting copies of themselves into other programs or files, requiring user action to spread.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'How does a worm differ from a virus?',
    choices: [
      { text: 'Worms self-replicate and spread automatically without user interaction', isCorrect: true },
      { text: 'Worms are less dangerous', isCorrect: false },
      { text: 'Worms only affect networks', isCorrect: false },
      { text: 'There is no difference', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Worms are standalone programs that replicate across networks independently, while viruses need host files.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a Trojan horse?',
    choices: [
      { text: 'Malware disguised as legitimate software to trick users into installing it', isCorrect: true },
      { text: 'A self-replicating worm', isCorrect: false },
      { text: 'An antivirus scanner', isCorrect: false },
      { text: 'A network monitoring tool', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Trojans masquerade as useful programs but perform malicious actions once installed, like the Greek mythological horse.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is ransomware?',
    choices: [
      { text: 'Malware that encrypts files and demands payment for decryption', isCorrect: true },
      { text: 'Software that randomly deletes files', isCorrect: false },
      { text: 'A type of antivirus', isCorrect: false },
      { text: 'A backup utility', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Ransomware holds data hostage by encrypting it, demanding ransom (usually cryptocurrency) for the decryption key.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is spyware?',
    choices: [
      { text: 'Malware that secretly monitors and collects user information', isCorrect: true },
      { text: 'Software for legitimate espionage', isCorrect: false },
      { text: 'A privacy protection tool', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Spyware covertly gathers personal information, browsing habits, credentials, or other sensitive data.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is adware?',
    choices: [
      { text: 'Software that displays unwanted advertisements', isCorrect: true },
      { text: 'Advertising management software', isCorrect: false },
      { text: 'A type of ransomware', isCorrect: false },
      { text: 'An ad-blocking tool', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Adware displays intrusive ads and may track browsing to serve targeted advertisements, sometimes bundled with free software.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a rootkit?',
    choices: [
      { text: 'Malware that hides its presence and provides privileged access', isCorrect: true },
      { text: 'A tool for managing root passwords', isCorrect: false },
      { text: 'A legitimate system administration tool', isCorrect: false },
      { text: 'A type of antivirus', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Rootkits conceal themselves and other malware, operating at deep system levels to evade detection.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a keylogger?',
    choices: [
      { text: 'Malware that records keystrokes to steal passwords and sensitive data', isCorrect: true },
      { text: 'A keyboard testing tool', isCorrect: false },
      { text: 'A typing tutor program', isCorrect: false },
      { text: 'An encryption tool', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Keyloggers capture everything typed, including passwords, credit card numbers, and private messages.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a logic bomb?',
    choices: [
      { text: 'Malicious code that triggers when specific conditions are met', isCorrect: true },
      { text: 'A physical explosive device', isCorrect: false },
      { text: 'A programming error', isCorrect: false },
      { text: 'A debugging tool', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Logic bombs remain dormant until triggered by specific events like a date, action, or removed account.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a time bomb?',
    choices: [
      { text: 'Malware triggered at a specific date or time', isCorrect: true },
      { text: 'A countdown timer application', isCorrect: false },
      { text: 'A backup scheduling tool', isCorrect: false },
      { text: 'A system clock error', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Time bombs are logic bombs specifically triggered by time/date conditions, often used by disgruntled employees.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a backdoor?',
    choices: [
      { text: 'Unauthorized access method bypassing normal authentication', isCorrect: true },
      { text: 'A secondary entrance to a building', isCorrect: false },
      { text: 'A backup login page', isCorrect: false },
      { text: 'A legitimate admin tool', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Backdoors allow attackers to regain access to compromised systems while evading security controls.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a bot in malware context?',
    choices: [
      { text: 'An infected computer remotely controlled by an attacker', isCorrect: true },
      { text: 'A helpful automation script', isCorrect: false },
      { text: 'A search engine crawler', isCorrect: false },
      { text: 'A chatbot application', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Bots (zombies) are compromised devices controlled remotely, often part of larger botnets for DDoS or spam.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a botnet?',
    choices: [
      { text: 'A network of infected computers controlled by an attacker', isCorrect: true },
      { text: 'A legitimate computer network', isCorrect: false },
      { text: 'An antivirus network', isCorrect: false },
      { text: 'A social media platform', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Botnets coordinate thousands or millions of bots to perform large-scale attacks like DDoS or cryptocurrency mining.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is fileless malware?',
    choices: [
      { text: 'Malware that operates in memory without writing files to disk', isCorrect: true },
      { text: 'Malware that deletes all files', isCorrect: false },
      { text: 'Malware that only affects cloud storage', isCorrect: false },
      { text: 'Malware without any code', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Fileless malware uses legitimate tools (like PowerShell) and resides in memory, making detection difficult.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'How is malware typically delivered?',
    choices: [
      { text: 'Email attachments, malicious links, infected downloads, and exploits', isCorrect: true },
      { text: 'Only through physical USB drives', isCorrect: false },
      { text: 'Only through network vulnerabilities', isCorrect: false },
      { text: 'Malware cannot be delivered remotely', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Malware uses various vectors including phishing, drive-by downloads, software vulnerabilities, and removable media.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a dropper?',
    choices: [
      { text: 'Malware designed to install other malicious programs', isCorrect: true },
      { text: 'A tool that removes malware', isCorrect: false },
      { text: 'A file compression utility', isCorrect: false },
      { text: 'A backup application', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Droppers are often the first stage of an attack, installing additional malware payloads after gaining access.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is polymorphic malware?',
    choices: [
      { text: 'Malware that changes its code to evade signature detection', isCorrect: true },
      { text: 'Malware that affects multiple platforms', isCorrect: false },
      { text: 'Malware with many features', isCorrect: false },
      { text: 'Malware that targets databases', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Polymorphic malware mutates its appearance while maintaining functionality, bypassing signature-based detection.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is metamorphic malware?',
    choices: [
      { text: 'Malware that completely rewrites its code with each infection', isCorrect: true },
      { text: 'Malware that only changes filenames', isCorrect: false },
      { text: 'Malware that transforms data formats', isCorrect: false },
      { text: 'Malware that adapts to hardware', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Metamorphic malware is more sophisticated than polymorphic, completely rewriting itself while preserving behavior.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is scareware?',
    choices: [
      { text: 'Fake security software that tricks users into paying for removal', isCorrect: true },
      { text: 'Malware that displays scary images', isCorrect: false },
      { text: 'Legitimate antivirus software', isCorrect: false },
      { text: 'A horror game', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Scareware displays fake warnings about infections to frighten users into purchasing fraudulent security products.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is cryptojacking?',
    choices: [
      { text: 'Unauthorized use of systems to mine cryptocurrency', isCorrect: true },
      { text: 'Stealing encryption keys', isCorrect: false },
      { text: 'Breaking encrypted communications', isCorrect: false },
      { text: 'Hijacking crypto wallets only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Cryptojacking malware secretly uses victim\'s computing resources for cryptocurrency mining, slowing systems and increasing power costs.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What are common indicators of malware infection?',
    choices: [
      { text: 'Slow performance, unexpected popups, unusual network activity, disabled security', isCorrect: true },
      { text: 'Only blue screen errors', isCorrect: false },
      { text: 'Faster computer performance', isCorrect: false },
      { text: 'No visible symptoms exist', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Multiple symptoms often indicate infection: system slowdowns, crashes, suspicious processes, or unauthorized changes.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a RAT (Remote Access Trojan)?',
    choices: [
      { text: 'Malware providing full remote control of infected systems', isCorrect: true },
      { text: 'A rodent control system', isCorrect: false },
      { text: 'A legitimate remote desktop tool', isCorrect: false },
      { text: 'A network speed test', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'RATs give attackers complete control over systems, allowing file access, keylogging, webcam activation, and more.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a wiper?',
    choices: [
      { text: 'Malware designed to destroy data, often permanently', isCorrect: true },
      { text: 'A disk cleaning utility', isCorrect: false },
      { text: 'A temporary file remover', isCorrect: false },
      { text: 'A screen cleaning application', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Wipers are destructive malware that overwrite or delete data, sometimes disguising as ransomware without recovery options.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a PUP (Potentially Unwanted Program)?',
    choices: [
      { text: 'Software that may be unwanted despite not being overtly malicious', isCorrect: true },
      { text: 'A type of puppy training software', isCorrect: false },
      { text: 'Definitely malicious malware', isCorrect: false },
      { text: 'A secure application', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'PUPs include bundled toolbars, aggressive adware, or programs that diminish user experience without clear malicious intent.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is a macro virus?',
    choices: [
      { text: 'Virus embedded in document macros (Word, Excel)', isCorrect: true },
      { text: 'A very large virus', isCorrect: false },
      { text: 'A keyboard shortcut virus', isCorrect: false },
      { text: 'A photography software virus', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Macro viruses exploit scripting capabilities in documents, executing when the file is opened with macros enabled.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is drive-by download?',
    choices: [
      { text: 'Malware automatically downloaded when visiting a compromised website', isCorrect: true },
      { text: 'Downloading files while driving', isCorrect: false },
      { text: 'Intentionally downloading software', isCorrect: false },
      { text: 'A cloud storage service', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Drive-by downloads exploit browser vulnerabilities to install malware without user knowledge or consent.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'What is the difference between a virus and a worm in terms of spread?',
    choices: [
      { text: 'Viruses need host files and user action; worms self-propagate', isCorrect: true },
      { text: 'Worms are slower to spread', isCorrect: false },
      { text: 'Viruses spread faster than worms', isCorrect: false },
      { text: 'They spread identically', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'This fundamental difference affects containment strategies: viruses require user awareness, worms need network defenses.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'Why do Trojans not self-replicate like viruses and worms?',
    choices: [
      { text: 'They rely on social engineering to trick users into installation', isCorrect: true },
      { text: 'They are less sophisticated', isCorrect: false },
      { text: 'They are more dangerous so don\'t need to', isCorrect: false },
      { text: 'Replication is technically impossible for Trojans', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Trojans focus on deception rather than replication, using disguises to achieve initial compromise.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 1,
    question: 'Why is understanding malware types important for defense?',
    choices: [
      { text: 'Different malware types require different detection and removal strategies', isCorrect: true },
      { text: 'It\'s not important', isCorrect: false },
      { text: 'All malware is treated the same way', isCorrect: false },
      { text: 'Only for malware researchers', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Recognizing malware characteristics enables appropriate response: behavioral detection for polymorphic malware, network segmentation for worms, etc.',
    points: 100
  }
];

// Malware Defense Lesson 2: Malware Analysis Techniques (30 questions)
const malwareDefenseLesson2Questions = [
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is malware analysis?',
    choices: [
      { text: 'The process of studying malware to understand its behavior and capabilities', isCorrect: true },
      { text: 'Deleting suspicious files', isCorrect: false },
      { text: 'Installing antivirus software', isCorrect: false },
      { text: 'Backing up data', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Malware analysis helps security professionals understand threats, develop signatures, and create defenses.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is static analysis?',
    choices: [
      { text: 'Examining malware without executing it', isCorrect: true },
      { text: 'Running malware to observe behavior', isCorrect: false },
      { text: 'Analyzing network traffic', isCorrect: false },
      { text: 'Testing on real systems', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Static analysis examines code, strings, and structure without risking execution, providing initial insights safely.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is dynamic analysis?',
    choices: [
      { text: 'Executing malware in a controlled environment to observe behavior', isCorrect: true },
      { text: 'Reading malware source code', isCorrect: false },
      { text: 'Checking file signatures', isCorrect: false },
      { text: 'Scanning with antivirus', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Dynamic analysis reveals runtime behavior like network connections, file modifications, and system changes.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What advantage does static analysis have?',
    choices: [
      { text: 'Safer - no risk of infection since malware isn\'t executed', isCorrect: true },
      { text: 'Shows all malware behaviors', isCorrect: false },
      { text: 'Always faster than dynamic', isCorrect: false },
      { text: 'Requires no skills', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Static analysis can be performed on any sample without risking system compromise, though it may miss runtime behaviors.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What advantage does dynamic analysis have?',
    choices: [
      { text: 'Reveals actual runtime behavior that static analysis might miss', isCorrect: true },
      { text: 'Completely safe with no precautions needed', isCorrect: false },
      { text: 'Doesn\'t require specialized environments', isCorrect: false },
      { text: 'Works on all malware without limitations', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Dynamic analysis shows real behavior including unpacking, network activity, and system interactions that code alone may not reveal.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is code disassembly?',
    choices: [
      { text: 'Converting compiled code back to assembly language for analysis', isCorrect: true },
      { text: 'Breaking software into pieces', isCorrect: false },
      { text: 'Removing code from a system', isCorrect: false },
      { text: 'Writing new code', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Disassembly translates machine code to readable assembly, allowing analysts to understand program logic.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is code decompilation?',
    choices: [
      { text: 'Converting compiled code back to a higher-level language', isCorrect: true },
      { text: 'Compiling source code', isCorrect: false },
      { text: 'Optimizing code performance', isCorrect: false },
      { text: 'Encrypting code', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Decompilation attempts to reverse compilation, producing higher-level code (like C) that\'s easier to understand than assembly.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is a debugger used for in malware analysis?',
    choices: [
      { text: 'Step-by-step execution to examine code behavior and memory', isCorrect: true },
      { text: 'Fixing bugs in legitimate software', isCorrect: false },
      { text: 'Removing malware automatically', isCorrect: false },
      { text: 'Encrypting files', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Debuggers allow analysts to pause execution, inspect variables, and understand malware logic instruction-by-instruction.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What information can strings analysis reveal?',
    choices: [
      { text: 'Text within malware like IPs, domains, file paths, and messages', isCorrect: true },
      { text: 'Only file names', isCorrect: false },
      { text: 'Complete source code', isCorrect: false },
      { text: 'User passwords', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Extracting strings often reveals command servers, registry keys, error messages, and other valuable intelligence.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is behavioral analysis?',
    choices: [
      { text: 'Observing what malware does: files created, registry changes, network activity', isCorrect: true },
      { text: 'Analyzing human behavior', isCorrect: false },
      { text: 'Reading malware comments', isCorrect: false },
      { text: 'Performance testing', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Behavioral analysis focuses on actions rather than code, revealing malware intent and impact.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is packing in malware?',
    choices: [
      { text: 'Compressing and obfuscating code to evade detection', isCorrect: true },
      { text: 'Packaging software for distribution', isCorrect: false },
      { text: 'Organizing files into folders', isCorrect: false },
      { text: 'Creating backups', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Packers compress malware and encrypt it, requiring unpacking at runtime to execute the real payload.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is unpacking?',
    choices: [
      { text: 'Decompressing packed malware to reveal the actual code', isCorrect: true },
      { text: 'Installing software', isCorrect: false },
      { text: 'Extracting ZIP files', isCorrect: false },
      { text: 'Removing software', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Unpacking is often necessary before meaningful static analysis can be performed on packed malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is a hash in malware analysis?',
    choices: [
      { text: 'A unique fingerprint (MD5, SHA-256) identifying a file', isCorrect: true },
      { text: 'Encrypted data', isCorrect: false },
      { text: 'A type of malware', isCorrect: false },
      { text: 'A network address', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Hashes allow quick identification and comparison of malware samples, sharing intelligence across organizations.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is YARA?',
    choices: [
      { text: 'A pattern-matching tool for identifying malware based on rules', isCorrect: true },
      { text: 'An antivirus program', isCorrect: false },
      { text: 'A programming language', isCorrect: false },
      { text: 'A network protocol', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'YARA rules describe malware patterns (strings, byte sequences) to classify and detect samples.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is a sandbox in malware analysis?',
    choices: [
      { text: 'An isolated environment for safely executing malware', isCorrect: true },
      { text: 'A children\'s play area', isCorrect: false },
      { text: 'A type of firewall', isCorrect: false },
      { text: 'A backup system', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Sandboxes provide controlled environments where malware can run without affecting production systems.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What can network traffic analysis during execution reveal?',
    choices: [
      { text: 'Command-and-control servers, exfiltration attempts, propagation behavior', isCorrect: true },
      { text: 'Only IP addresses', isCorrect: false },
      { text: 'Nothing useful', isCorrect: false },
      { text: 'User passwords only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Monitoring network activity reveals communication patterns, data theft, and infrastructure used by attackers.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is API monitoring in dynamic analysis?',
    choices: [
      { text: 'Tracking which system functions the malware calls', isCorrect: true },
      { text: 'Creating new APIs', isCorrect: false },
      { text: 'Monitoring network speed', isCorrect: false },
      { text: 'Checking website availability', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'API calls reveal malware capabilities: file operations, registry access, network communications, process creation.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is process monitoring?',
    choices: [
      { text: 'Tracking processes created, modified, or terminated by malware', isCorrect: true },
      { text: 'Manufacturing process analysis', isCorrect: false },
      { text: 'Business workflow monitoring', isCorrect: false },
      { text: 'CPU usage tracking only', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Process monitoring reveals how malware injects into legitimate processes or spawns malicious children.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is file system monitoring?',
    choices: [
      { text: 'Tracking files created, modified, or deleted by malware', isCorrect: true },
      { text: 'Disk space management', isCorrect: false },
      { text: 'File backup scheduling', isCorrect: false },
      { text: 'Defragmentation', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'File monitoring shows persistence mechanisms, payload drops, and data destruction attempts.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is registry monitoring (Windows)?',
    choices: [
      { text: 'Tracking registry keys malware creates or modifies', isCorrect: true },
      { text: 'Registering software licenses', isCorrect: false },
      { text: 'Domain name registration', isCorrect: false },
      { text: 'User account creation', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Registry changes often indicate persistence mechanisms, configuration storage, or system modifications.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What are Indicators of Compromise (IOCs) from analysis?',
    choices: [
      { text: 'Artifacts like IPs, domains, file hashes, and registry keys for detection', isCorrect: true },
      { text: 'Just file names', isCorrect: false },
      { text: 'User account names', isCorrect: false },
      { text: 'System performance metrics', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IOCs extracted from analysis enable detection, hunting, and sharing intelligence with other organizations.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is signature-based detection?',
    choices: [
      { text: 'Identifying malware by matching known patterns from analysis', isCorrect: true },
      { text: 'Digital signature verification', isCorrect: false },
      { text: 'Handwriting recognition', isCorrect: false },
      { text: 'Biometric authentication', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Analysis produces signatures (byte patterns, hashes) used by antivirus to detect known threats.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is heuristic detection?',
    choices: [
      { text: 'Detecting malware based on suspicious behaviors rather than signatures', isCorrect: true },
      { text: 'Random guessing', isCorrect: false },
      { text: 'Only checking file names', isCorrect: false },
      { text: 'User-based detection', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Heuristics identify unknown malware by recognizing malicious patterns like encryption loops or privilege escalation.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What are common malware analysis tools?',
    choices: [
      { text: 'IDA Pro, OllyDbg, Wireshark, Process Monitor, and sandboxes', isCorrect: true },
      { text: 'Microsoft Word and Excel', isCorrect: false },
      { text: 'Media players', isCorrect: false },
      { text: 'Web browsers only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Specialized tools for disassembly, debugging, network analysis, and behavioral monitoring are essential for thorough analysis.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is memory forensics?',
    choices: [
      { text: 'Analyzing RAM dumps to find malware artifacts and evidence', isCorrect: true },
      { text: 'Testing memory chips', isCorrect: false },
      { text: 'Remembering past events', isCorrect: false },
      { text: 'Hard drive analysis', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Memory analysis can reveal process injection, hidden network connections, encryption keys, and fileless malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is the purpose of creating malware signatures?',
    choices: [
      { text: 'Enable detection tools to identify and block the malware', isCorrect: true },
      { text: 'Sign malware for authentication', isCorrect: false },
      { text: 'Authorize malware execution', isCorrect: false },
      { text: 'Improve malware performance', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Signatures derived from analysis let antivirus and IDS/IPS recognize and stop threats.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is code injection analysis?',
    choices: [
      { text: 'Understanding how malware injects code into other processes', isCorrect: true },
      { text: 'Injecting code into malware', isCorrect: false },
      { text: 'Writing new code', isCorrect: false },
      { text: 'SQL injection testing', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Analyzing injection techniques reveals how malware hides within legitimate processes to evade detection.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'What is anti-analysis technique?',
    choices: [
      { text: 'Methods malware uses to detect and evade analysis environments', isCorrect: true },
      { text: 'Techniques to prevent security analysis', isCorrect: false },
      { text: 'Tools that block all analysis', isCorrect: false },
      { text: 'Legal restrictions on analysis', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Malware may detect VMs, debuggers, or sandboxes and alter behavior or terminate to avoid analysis.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'Why do analysts use both static and dynamic analysis together?',
    choices: [
      { text: 'They complement each other, providing complete understanding', isCorrect: true },
      { text: 'It\'s a legal requirement', isCorrect: false },
      { text: 'One is always insufficient', isCorrect: false },
      { text: 'To waste time', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Static analysis shows code structure while dynamic reveals runtime behavior; together they provide comprehensive intelligence.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 2,
    question: 'Why is malware analysis crucial for cybersecurity?',
    choices: [
      { text: 'Enables creation of defenses, signatures, and understanding of threats', isCorrect: true },
      { text: 'Only for academic research', isCorrect: false },
      { text: 'Not important anymore', isCorrect: false },
      { text: 'Only for law enforcement', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Analysis drives threat intelligence, detection rules, incident response, and proactive defense strategies.',
    points: 100
  }
];

// Malware Defense Lesson 3: Safe Analysis Environments (30 questions)
const malwareDefenseLesson3Questions = [
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why use isolated environments for malware analysis?',
    choices: [
      { text: 'Prevents malware from infecting production systems and networks', isCorrect: true },
      { text: 'Makes analysis faster', isCorrect: false },
      { text: 'It\'s not necessary', isCorrect: false },
      { text: 'Only for legal reasons', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Isolation ensures that malware cannot escape the analysis environment and cause real damage.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a virtual machine (VM)?',
    choices: [
      { text: 'Emulated computer system running as software on a host', isCorrect: true },
      { text: 'A physical test computer', isCorrect: false },
      { text: 'An encryption tool', isCorrect: false },
      { text: 'A network device', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'VMs provide isolated operating systems perfect for malware testing without risking the host machine.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What VM software is commonly used for malware analysis?',
    choices: [
      { text: 'VMware, VirtualBox, Hyper-V', isCorrect: true },
      { text: 'Microsoft Word', isCorrect: false },
      { text: 'Web browsers', isCorrect: false },
      { text: 'Media players', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'These hypervisors create isolated virtual environments where malware can be safely analyzed.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a sandbox?',
    choices: [
      { text: 'Restricted environment that limits what software can do', isCorrect: true },
      { text: 'A beach area', isCorrect: false },
      { text: 'A type of malware', isCorrect: false },
      { text: 'A physical testing room', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Sandboxes enforce security policies preventing malware from accessing sensitive resources or escaping containment.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a snapshot in virtualization?',
    choices: [
      { text: 'A saved state of a VM that can be restored', isCorrect: true },
      { text: 'A photograph of the screen', isCorrect: false },
      { text: 'A backup of files only', isCorrect: false },
      { text: 'A network configuration', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Snapshots allow quick restoration to clean states after malware infection, enabling repeated analysis.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why take a snapshot before running malware?',
    choices: [
      { text: 'Allows quick restoration to a clean state after analysis', isCorrect: true },
      { text: 'Makes malware run faster', isCorrect: false },
      { text: 'Required by law', isCorrect: false },
      { text: 'For documentation only', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Pre-analysis snapshots ensure you can reset the environment completely, removing all malware traces.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is network isolation in analysis?',
    choices: [
      { text: 'Disconnecting analysis systems from production networks', isCorrect: true },
      { text: 'Turning off WiFi only', isCorrect: false },
      { text: 'Using strong passwords', isCorrect: false },
      { text: 'Installing firewall software', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Network isolation prevents malware from spreading, communicating with command servers, or exfiltrating data.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a completely isolated "air-gapped" network?',
    choices: [
      { text: 'Network with no physical connection to other networks or internet', isCorrect: true },
      { text: 'A wireless network', isCorrect: false },
      { text: 'A fast network', isCorrect: false },
      { text: 'An encrypted network', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Air-gapped networks provide maximum isolation, though controlled internet simulation may be needed for some malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why might analysts create a simulated internet environment?',
    choices: [
      { text: 'To observe malware network behavior without real internet access', isCorrect: true },
      { text: 'To browse websites safely', isCorrect: false },
      { text: 'To improve network speed', isCorrect: false },
      { text: 'It serves no purpose', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Fake internet services (DNS, HTTP) allow observing malware communications safely in controlled environments.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What are analysis tools like Cuckoo Sandbox?',
    choices: [
      { text: 'Automated malware analysis systems', isCorrect: true },
      { text: 'Games', isCorrect: false },
      { text: 'Web browsers', isCorrect: false },
      { text: 'Email clients', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Automated sandboxes execute malware, monitor behavior, and generate reports without manual intervention.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What precautions should be taken with analysis computers?',
    choices: [
      { text: 'Never connect to production networks, use dedicated hardware, fresh snapshots', isCorrect: true },
      { text: 'Use them for regular work too', isCorrect: false },
      { text: 'No precautions needed', isCorrect: false },
      { text: 'Just install antivirus', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Strict separation prevents accidental contamination and ensures analysis environment integrity.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Can malware detect virtual machines?',
    choices: [
      { text: 'Yes, through VM artifacts, hardware signatures, and timing differences', isCorrect: true },
      { text: 'No, it\'s impossible', isCorrect: false },
      { text: 'Only physical computers can be detected', isCorrect: false },
      { text: 'Detection never affects analysis', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Sophisticated malware checks for VM indicators and may alter behavior or refuse to execute.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'How can analysts make VMs less detectable?',
    choices: [
      { text: 'Remove VM tools, change hardware IDs, modify registry values', isCorrect: true },
      { text: 'Install more software', isCorrect: false },
      { text: 'It\'s impossible', isCorrect: false },
      { text: 'Use default settings', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Hardening VMs against detection involves removing telltale signs and mimicking real systems.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is the purpose of using different VM snapshots?',
    choices: [
      { text: 'Test malware across different OS versions and configurations', isCorrect: true },
      { text: 'Waste disk space', isCorrect: false },
      { text: 'No real purpose', isCorrect: false },
      { text: 'Make analysis slower', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Multiple configurations reveal OS-specific behaviors and ensure comprehensive analysis coverage.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What should be in a malware analysis toolkit?',
    choices: [
      { text: 'Debuggers, disassemblers, network monitors, and process analyzers', isCorrect: true },
      { text: 'Only antivirus software', isCorrect: false },
      { text: 'Office productivity software', isCorrect: false },
      { text: 'Games and entertainment', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Comprehensive toolkits enable static and dynamic analysis across all malware aspects.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why use a dedicated analysis workstation?',
    choices: [
      { text: 'Prevents cross-contamination with regular work systems', isCorrect: true },
      { text: 'More expensive is better', isCorrect: false },
      { text: 'Not necessary', isCorrect: false },
      { text: 'Only for compliance', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Dedicated hardware ensures complete isolation from production environments and personal data.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is containment in malware analysis?',
    choices: [
      { text: 'Preventing analyzed malware from escaping the controlled environment', isCorrect: true },
      { text: 'Storing malware samples', isCorrect: false },
      { text: 'Compressing files', isCorrect: false },
      { text: 'Documenting findings', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Multiple containment layers (VM, network isolation, physical separation) prevent accidental releases.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a honeynet?',
    choices: [
      { text: 'Decoy network designed to attract and study attackers', isCorrect: true },
      { text: 'A sweet network topology', isCorrect: false },
      { text: 'The fastest network type', isCorrect: false },
      { text: 'An encrypted network', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Honeynets lure attackers into monitored environments where their techniques and malware can be studied safely.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What safety procedures should analysts follow?',
    choices: [
      { text: 'Never execute malware on personal/work computers, always use isolated environments', isCorrect: true },
      { text: 'Run malware anywhere', isCorrect: false },
      { text: 'Share samples via personal email', isCorrect: false },
      { text: 'No procedures needed', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Strict safety protocols protect analysts, organizations, and prevent accidental malware spread.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'How should malware samples be stored?',
    choices: [
      { text: 'Encrypted, password-protected, on isolated systems', isCorrect: true },
      { text: 'On desktop in plain folders', isCorrect: false },
      { text: 'In cloud storage accounts', isCorrect: false },
      { text: 'Sent via regular email', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Secure storage prevents accidental execution and unauthorized access to dangerous samples.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is the standard password for malware archives?',
    choices: [
      { text: 'infected (commonly used convention)', isCorrect: true },
      { text: 'password', isCorrect: false },
      { text: 'malware123', isCorrect: false },
      { text: 'No password needed', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'The "infected" password convention prevents accidental extraction while allowing researchers to share samples.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why disable antivirus in analysis VMs?',
    choices: [
      { text: 'Prevents AV from interfering with malware execution and observation', isCorrect: true },
      { text: 'Antivirus slows down computers', isCorrect: false },
      { text: 'Antivirus is never useful', isCorrect: false },
      { text: 'To save money', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Temporary AV disablement allows malware to execute fully, revealing its complete behavior.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is behavioral monitoring in sandboxes?',
    choices: [
      { text: 'Tracking all system changes, network activity, and actions during execution', isCorrect: true },
      { text: 'Monitoring analyst behavior', isCorrect: false },
      { text: 'Watching network speed', isCorrect: false },
      { text: 'Checking temperature', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Comprehensive monitoring captures file, registry, network, and process activity for analysis.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is reverse engineering?',
    choices: [
      { text: 'Analyzing compiled software to understand its functionality', isCorrect: true },
      { text: 'Writing code backwards', isCorrect: false },
      { text: 'Uninstalling software', isCorrect: false },
      { text: 'Hardware repair', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Reverse engineering dissects malware to reveal algorithms, vulnerabilities, and capabilities.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What legal considerations exist for malware analysis?',
    choices: [
      { text: 'Possessing/analyzing malware may be regulated; research should be responsible', isCorrect: true },
      { text: 'It\'s completely illegal everywhere', isCorrect: false },
      { text: 'No laws apply to security research', isCorrect: false },
      { text: 'Only affects law enforcement', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Researchers must understand local laws, work ethically, and avoid weaponizing findings.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is responsible disclosure?',
    choices: [
      { text: 'Reporting vulnerabilities to vendors before public release', isCorrect: true },
      { text: 'Immediately posting all findings online', isCorrect: false },
      { text: 'Keeping all findings secret forever', isCorrect: false },
      { text: 'Selling vulnerabilities', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Responsible disclosure gives vendors time to patch before attackers exploit findings.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why document analysis procedures and findings?',
    choices: [
      { text: 'Enables reproduction, sharing intelligence, and future reference', isCorrect: true },
      { text: 'Only for legal requirements', isCorrect: false },
      { text: 'Documentation serves no purpose', isCorrect: false },
      { text: 'To waste time', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Thorough documentation supports collaboration, validates findings, and builds organizational knowledge.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What is a clean room for analysis?',
    choices: [
      { text: 'Completely isolated environment free from external influences', isCorrect: true },
      { text: 'A physically clean laboratory', isCorrect: false },
      { text: 'A room with white walls', isCorrect: false },
      { text: 'An office with good hygiene', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Clean rooms ensure analysis results aren\'t contaminated by external factors or previous infections.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'What backup strategies should analysis labs use?',
    choices: [
      { text: 'Regular snapshots, configuration backups, tool archives', isCorrect: true },
      { text: 'No backups needed', isCorrect: false },
      { text: 'Only backup once per year', isCorrect: false },
      { text: 'Backups slow down analysis', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Backups enable quick recovery if analysis environments become corrupted or need reconfiguration.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 3,
    question: 'Why is safe malware analysis environment setup crucial?',
    choices: [
      { text: 'Protects analysts, organizations, and prevents accidental outbreaks', isCorrect: true },
      { text: 'Only for show', isCorrect: false },
      { text: 'Not actually important', isCorrect: false },
      { text: 'Just slows down work', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Proper environments are the foundation of responsible malware research and organizational security.',
    points: 100
  }
];

// Malware Defense Lesson 4: Prevention and Response (30 questions)
const malwareDefenseLesson4Questions = [
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is antivirus software?',
    choices: [
      { text: 'Program that detects, prevents, and removes malware', isCorrect: true },
      { text: 'Software that creates viruses', isCorrect: false },
      { text: 'A firewall', isCorrect: false },
      { text: 'A backup tool', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Antivirus is fundamental security software using signatures and heuristics to protect against malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is EDR (Endpoint Detection and Response)?',
    choices: [
      { text: 'Advanced security monitoring and response for endpoints', isCorrect: true },
      { text: 'A type of malware', isCorrect: false },
      { text: 'An encryption method', isCorrect: false },
      { text: 'A network protocol', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'EDR solutions provide continuous monitoring, threat detection, investigation, and response capabilities on endpoints.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'How does EDR differ from traditional antivirus?',
    choices: [
      { text: 'EDR provides behavioral monitoring, threat hunting, and incident response', isCorrect: true },
      { text: 'They are identical', isCorrect: false },
      { text: 'EDR is just rebranded antivirus', isCorrect: false },
      { text: 'EDR is less capable', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'While AV focuses on prevention, EDR adds detection of sophisticated threats and response capabilities.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is patch management?',
    choices: [
      { text: 'Systematically updating software to fix vulnerabilities', isCorrect: true },
      { text: 'Repairing clothing', isCorrect: false },
      { text: 'Network bandwidth management', isCorrect: false },
      { text: 'File organization', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Regular patching closes security holes that malware exploits, a critical preventive measure.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'Why is timely patching important?',
    choices: [
      { text: 'Exploits for known vulnerabilities spread quickly after disclosure', isCorrect: true },
      { text: 'Patches make computers faster', isCorrect: false },
      { text: 'It\'s not actually important', isCorrect: false },
      { text: 'Only for compliance', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Attackers rapidly weaponize disclosed vulnerabilities; delayed patching leaves windows of exposure.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is application whitelisting?',
    choices: [
      { text: 'Only allowing approved applications to run', isCorrect: true },
      { text: 'Making applications white colored', isCorrect: false },
      { text: 'Blocking all applications', isCorrect: false },
      { text: 'A list of malware', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Whitelisting prevents unauthorized software execution, blocking malware by default.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is the principle of least privilege?',
    choices: [
      { text: 'Users should only have minimum permissions necessary for their role', isCorrect: true },
      { text: 'Everyone should be administrator', isCorrect: false },
      { text: 'Privileges don\'t matter', isCorrect: false },
      { text: 'Only applies to physical access', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Limiting privileges reduces malware impact by restricting what compromised accounts can do.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'How does user awareness training help prevent malware?',
    choices: [
      { text: 'Educated users recognize phishing, suspicious links, and social engineering', isCorrect: true },
      { text: 'Training has no impact', isCorrect: false },
      { text: 'Only technical controls matter', isCorrect: false },
      { text: 'Users can\'t be trained', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Humans are often the weakest link; training transforms users into a defensive layer.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is email filtering?',
    choices: [
      { text: 'Blocking malicious emails and attachments before reaching users', isCorrect: true },
      { text: 'Organizing inbox folders', isCorrect: false },
      { text: 'Making emails prettier', isCorrect: false },
      { text: 'Deleting all emails', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Email filters catch phishing, malicious attachments, and malware before user interaction.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is web filtering?',
    choices: [
      { text: 'Blocking access to malicious or inappropriate websites', isCorrect: true },
      { text: 'Making websites load faster', isCorrect: false },
      { text: 'Improving website design', isCorrect: false },
      { text: 'Creating websites', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Web filters prevent users from accessing sites hosting malware or phishing content.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What should you do if you suspect malware infection?',
    choices: [
      { text: 'Isolate system, report to IT/security, don\'t use it for sensitive tasks', isCorrect: true },
      { text: 'Continue working normally', isCorrect: false },
      { text: 'Just restart the computer', isCorrect: false },
      { text: 'Ignore it', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Quick isolation prevents spread and data theft; professional remediation ensures complete removal.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is incident response for malware?',
    choices: [
      { text: 'Systematic process to contain, eradicate, and recover from infections', isCorrect: true },
      { text: 'Ignoring the infection', isCorrect: false },
      { text: 'Just deleting suspicious files', isCorrect: false },
      { text: 'Reinstalling everything always', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Structured response ensures thorough remediation, evidence preservation, and lessons learned.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'Why is data backup important for malware defense?',
    choices: [
      { text: 'Enables recovery without paying ransomware demands', isCorrect: true },
      { text: 'Backups prevent infections', isCorrect: false },
      { text: 'Only for hardware failures', isCorrect: false },
      { text: 'Not actually important', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Regular, tested backups are the best defense against ransomware and destructive malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is the 3-2-1 backup rule?',
    choices: [
      { text: '3 copies, 2 different media types, 1 offsite', isCorrect: true },
      { text: '3 backups per day, 2 per week, 1 per month', isCorrect: false },
      { text: 'Backup 3 times, 2 locations, 1 cloud', isCorrect: false },
      { text: 'A random number sequence', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'This rule ensures backup resilience against various failure scenarios including ransomware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'Should you pay ransomware demands?',
    choices: [
      { text: 'No - it funds criminals, no guarantee of decryption, and encourages attacks', isCorrect: true },
      { text: 'Always pay immediately', isCorrect: false },
      { text: 'Payment is the only solution', isCorrect: false },
      { text: 'Paying prevents future attacks', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Law enforcement and security experts advise against payment; backups and prevention are better strategies.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is system hardening?',
    choices: [
      { text: 'Reducing attack surface by removing unnecessary services and features', isCorrect: true },
      { text: 'Making hardware more durable', isCorrect: false },
      { text: 'Increasing disk encryption only', isCorrect: false },
      { text: 'Installing more software', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Hardening minimizes vulnerabilities by disabling unneeded services, ports, and features.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is defense in depth for malware?',
    choices: [
      { text: 'Multiple layers of security controls protecting against threats', isCorrect: true },
      { text: 'Using only one security tool', isCorrect: false },
      { text: 'Installing software deeply', isCorrect: false },
      { text: 'Deep packet inspection only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Layered defenses (AV, EDR, firewall, training, backups) ensure if one fails, others still protect.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is network segmentation for malware containment?',
    choices: [
      { text: 'Dividing networks to limit malware lateral movement', isCorrect: true },
      { text: 'Cutting network cables', isCorrect: false },
      { text: 'Slowing down networks', isCorrect: false },
      { text: 'Creating wireless segments only', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Segmentation contains infections to specific areas, preventing organization-wide compromise.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What are IOCs used for in malware response?',
    choices: [
      { text: 'Searching for additional compromised systems', isCorrect: true },
      { text: 'Only for documentation', isCorrect: false },
      { text: 'Creating malware', isCorrect: false },
      { text: 'No practical use', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'IOCs enable threat hunting across the environment to find other infections from the same attack.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is forensic imaging in malware response?',
    choices: [
      { text: 'Creating exact copies of infected systems for investigation', isCorrect: true },
      { text: 'Taking photographs', isCorrect: false },
      { text: 'Artistic rendering', isCorrect: false },
      { text: 'Drawing diagrams', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Forensic images preserve evidence for analysis while allowing production systems to be cleaned.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is remediation?',
    choices: [
      { text: 'Process of removing malware and restoring systems to secure state', isCorrect: true },
      { text: 'Creating remedies for illness', isCorrect: false },
      { text: 'Ignoring infections', isCorrect: false },
      { text: 'Temporary fixes only', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Complete remediation eliminates malware, closes vulnerabilities, and prevents reinfection.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'Why is root cause analysis important after malware incidents?',
    choices: [
      { text: 'Identifies how infection occurred to prevent recurrence', isCorrect: true },
      { text: 'Just for documentation', isCorrect: false },
      { text: 'To assign blame', isCorrect: false },
      { text: 'Not necessary', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Understanding attack vectors enables targeted improvements to prevent similar future infections.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is threat intelligence sharing?',
    choices: [
      { text: 'Organizations sharing IOCs and attack information to defend collectively', isCorrect: true },
      { text: 'Sharing malware samples publicly', isCorrect: false },
      { text: 'Posting all findings on social media', isCorrect: false },
      { text: 'Keeping all information secret', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Collaboration through platforms like ISACs helps organizations defend against common threats.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is application control?',
    choices: [
      { text: 'Managing which applications can run on systems', isCorrect: true },
      { text: 'Controlling application windows', isCorrect: false },
      { text: 'Remote desktop control', isCorrect: false },
      { text: 'Keyboard shortcuts', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Application control prevents unauthorized software execution, blocking most malware.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is vulnerability management?',
    choices: [
      { text: 'Identifying, prioritizing, and remediating security weaknesses', isCorrect: true },
      { text: 'Creating vulnerabilities', isCorrect: false },
      { text: 'Ignoring security issues', isCorrect: false },
      { text: 'Only scanning once', isCorrect: false }
    ],
    difficulty: 'medium',
    explanation: 'Proactive vulnerability management reduces malware entry points before they\'re exploited.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is zero trust security?',
    choices: [
      { text: 'Never trust, always verify - continuous authentication and authorization', isCorrect: true },
      { text: 'Trusting no one personally', isCorrect: false },
      { text: 'Disabling all security', isCorrect: false },
      { text: 'Only trusting administrators', isCorrect: false }
    ],
    difficulty: 'hard',
    explanation: 'Zero trust assumes breach and continuously validates access, limiting malware lateral movement.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is security monitoring?',
    choices: [
      { text: 'Continuous observation of systems for suspicious activity', isCorrect: true },
      { text: 'Watching security guards', isCorrect: false },
      { text: 'Only checking logs once monthly', isCorrect: false },
      { text: 'Physical surveillance', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Real-time monitoring enables early detection and response to malware infections.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is macro security in Office documents?',
    choices: [
      { text: 'Settings controlling whether macros can execute', isCorrect: true },
      { text: 'Large security features', isCorrect: false },
      { text: 'Keyboard shortcut security', isCorrect: false },
      { text: 'Photography security', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Disabling macros or requiring approval prevents macro virus infections from malicious documents.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'What is browser security configuration?',
    choices: [
      { text: 'Settings that block malicious scripts, downloads, and plugins', isCorrect: true },
      { text: 'Changing browser colors', isCorrect: false },
      { text: 'Only clearing history', isCorrect: false },
      { text: 'Bookmark organization', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Proper browser configuration prevents drive-by downloads and malicious script execution.',
    points: 100
  },
  {
    module: 'malware-defense',
    lessonNumber: 4,
    question: 'Why is a comprehensive malware defense strategy important?',
    choices: [
      { text: 'Threats are sophisticated and diverse, requiring multi-layered protection', isCorrect: true },
      { text: 'One tool solves everything', isCorrect: false },
      { text: 'Defense doesn\'t matter anymore', isCorrect: false },
      { text: 'Only for large organizations', isCorrect: false }
    ],
    difficulty: 'easy',
    explanation: 'Modern malware requires combined prevention, detection, response, and recovery capabilities.',
    points: 100
  }
];

// Combine all quiz questions into one array
const quizQuestions = [
  ...cryptographyLesson1Questions,
  ...cryptographyLesson2Questions,
  ...cryptographyLesson3Questions,
  ...cryptographyLesson4Questions,
  ...webSecurityLesson1Questions,
  ...webSecurityLesson2Questions,
  ...webSecurityLesson3Questions,
  ...webSecurityLesson4Questions,
  ...networkDefenseLesson1Questions,
  ...networkDefenseLesson2Questions,
  ...networkDefenseLesson3Questions,
  ...networkDefenseLesson4Questions,
  ...malwareDefenseLesson1Questions,
  ...malwareDefenseLesson2Questions,
  ...malwareDefenseLesson3Questions,
  ...malwareDefenseLesson4Questions
];

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
    
    console.log('🗑️  Clearing existing data...');
    await QuizQuestion.deleteMany({});
    await Monster.deleteMany({});
    
    console.log('📝 Inserting quiz questions...');
    
    // Insert all quiz questions (480 total across 4 modules)
    await QuizQuestion.insertMany(quizQuestions);
    
    console.log(`✅ Inserted ${quizQuestions.length} quiz questions`);
    
    console.log('👾 Inserting monsters...');
    await Monster.insertMany(monsters);
    console.log(`✅ Inserted ${monsters.length} monsters`);
    
    // Summary
    const questionCount = await QuizQuestion.countDocuments();
    const monsterCount = await Monster.countDocuments();
    
    console.log('\n🎉 ====================================');
    console.log('   DATABASE SEEDING COMPLETE!');
    console.log('   ====================================');
    console.log(`\n📊 Total Questions: ${questionCount}`);
    console.log(`👾 Total Monsters: ${monsterCount}`);
    console.log('\n✅ ALL MODULES COMPLETE (480 questions):');
    console.log('   📘 Cryptography: 120 questions (Lessons 1-4)');
    console.log('   🔒 Web Security: 120 questions (Lessons 1-4)');
    console.log('   🛡️  Network Defense: 120 questions (Lessons 1-4)');
    console.log('   🦠 Malware Defense: 120 questions (Lessons 1-4)');
    console.log('\n🎯 All 16 lessons ready for battle quiz!');
    console.log('====================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
