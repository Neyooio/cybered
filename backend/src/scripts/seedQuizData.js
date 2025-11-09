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
